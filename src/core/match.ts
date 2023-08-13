import { deepMapOf } from "../utils/DeepMap.ts";
import { hasUnmatched } from "../utils/hasUnmatched.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { $ } from "./exp-builder.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { subst } from "./subst.ts";
import { LLangAst, AstMap, isLLangAst, isConst, KnowledgeBase, List, Entity, askBin } from "./types.ts";


export function match(template: LLangAst, f: LLangAst, kb: KnowledgeBase): AstMap | undefined {

    if (isConst(template) && isConst(f)) {
        if (template.value === f.value) return deepMapOf()
        if (askBin($(f).isa(template).$, kb)) return deepMapOf([[template, f]])

    } else if (template.type === 'list' && f.type === 'list') {
        return matchLists(template, f, kb)

    } else if (template.type === 'is-a-formula' && f.type === 'is-a-formula') {
        return deepMapOf([[template.subject, f.subject], [template.object, f.object]])

    } else if (template.type === 'implicit-reference' && f.type === 'implicit-reference') {

        if (match(removeImplicit(template), removeImplicit(f), kb) === undefined) return undefined

        const ms: (AstMap | undefined)[] = []
        ms.push(deepMapOf([[template.headType, f.headType]]))

        if (template.which && f.which) ms.push(deepMapOf([[template.which, f.which]]))

        return reduceMatchList(ms)

    } else if (template.type === 'arbitrary-type' && f.type === 'arbitrary-type') {

        const m1 = match(template.head, f.head, kb)
        if (!m1) return undefined
        if (template.description.type === 'boolean' && template.description.value) return reduceMatchList([m1])

        const m2 = match(template.description, f.description, kb)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'variable' && f.type === 'variable') {
        if (template.varType === f.varType) return deepMapOf([[template, f]])
        if (askBin($(f.varType).isa(template.varType).$, kb)) return deepMapOf([[template, f]])

    } else if (template.type === f.type) {

        const templateT = template as { [x: string]: LLangAst }
        const fT = f as { [x: string]: LLangAst }

        const templateKeys = Object.keys(template).filter(x => isLLangAst(templateT[x]))
        const fKeys = Object.keys(f).filter(x => isLLangAst(fT[x]))

        if (templateKeys.length !== fKeys.length) {
            return undefined
        }

        const ms = templateKeys.map(k => {

            const v1 = templateT[k]
            const v2 = fT[k]

            if (!v1 || !v2) return undefined

            const result = match(v1, v2, kb)

            return result
        })

        const r = reduceMatchList(ms)
        return r

    } else if (template.type === 'implicit-reference' && isConst(f)) {
        return match(removeImplicit(template), f, kb)

    } else if (template.type === 'arbitrary-type' && isConst(f)) {
        const m = match(template.head, f, kb)
        if (!m) return undefined

        const desc = subst(template.description, [template.head, f])
        const ok = askBin(desc, kb)
        if (ok) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && isConst(f)) {

        if (askBin($(f).isa(template.varType).$, kb)) {
            return deepMapOf([[template, f]])
        }

    } else if (template.type === 'variable' && f.type === 'list') {
        if (askBin($(f).isa(template.varType).$, kb)) return deepMapOf([[template, f]])

    } else if (template.type === 'variable') {
        return deepMapOf([[template, f]])

    } else if (f.type === 'conjunction' || f.type === 'disjunction') {
        const m1 = match(template, f.f1, kb)
        const m2 = match(template, f.f2, kb)
        if (m1) return m1
        if (m2) return m2
    }

}

function reduceMatchList(ms: (AstMap | undefined)[]): AstMap | undefined {
    if (!ms.every(isNotNullish)) return undefined

    return ms.reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}

function toStringList(list: LLangAst[]) {
    const result = list.filter((x): x is Entity => x.type === 'entity').map(x => x.value)
    return result
}

function matchLists(template: List, formula: List, kb: KnowledgeBase) {

    if (template.value.length > formula.value.length) return undefined

    let ff = [...formula.value]
    const ms: (AstMap | undefined)[] = []

    template.value.forEach((t, i) => {

        const tpp = template.value[i + 1] ?? $('nothing').$

        if (t.type === 'variable' && t.varType === 'list') {
            const k = ff.findIndex((x, j) => match(tpp, x, kb) && !hasUnmatched(toStringList(ff.slice(0, j))))

            if (k === -1 && template.value[i + 1]) return ms.push(undefined)

            const m = match(t, $(k === -1 ? ff : ff.slice(0, k)).$, kb)
            ms.push(m)
            ff = k === -1 ? [] : ff.slice(k)
        } else {
            const ff0 = ff.at(0)
            const m = match(t, ff0 ?? $('nothing').$, kb)
            ms.push(m)
            ff = ff.slice(1)
        }
    })

    return reduceMatchList(ms)

}

// print(matchLists($(['x:number', 'y:list', 3]).$, $([0, 1, 2, 3]).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:number', 'y:list']).$, $([0, 1, 2, 3]).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:number', 'y:list', 'w:number']).$, $([0, 1, 2, 3]).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:number', 'y:list', 'w:entity']).$, $([0, 1, 2, 'cat']).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:list', 'and', 'y:list']).$, $(['cat', 'and', 'dog', 'and', 'buruf']).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['(', 'x:list', ')']).$, $(['(', 'cat', 'and', 'dog', ')']).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:list', 'and', 'y:list']).$, $(['(', 'cat', 'and', 'dog', ')', 'and', 'buruf']).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:list', 'and', 'y:list']).$, $(['cat', 'and', '(', 'dog', 'and', 'buruf', ')']).$, $.emptyKb))
// print('-----------')
// print(matchLists($(['x:list', 'y:buruf']).$, $([1,2,3,4,5]).$, $.emptyKb))

// print(matchLists($(['x:list', 'o:operator', 'y:list']).$, $([1, 'x:thing', 2]).$, $.emptyKb))

// .and($.p(['x:list', 'is', 'a', 'y:list']).when($.p('x:list').isa($.p('y:list'))))
// const m = match($(['x:list', 'is', 'a', 'y:list']).$, $(['x', 'is', 'a', 'cat']).$, $.emptyKb)
// print(m)
