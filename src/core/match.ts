import { deepMapOf } from "../utils/DeepMap.ts";
import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { subst } from "./subst.ts";
import { LLangAst, AstMap, isAtom, isLLangAst, isConst, isSimpleFormula, KnowledgeBase, isTruthy, ListPattern, ListLiteral, astsEqual, ImplicitReference } from "./types.ts";


export function match(template: LLangAst, f: LLangAst, kb: KnowledgeBase): AstMap | undefined {

    if (isConst(template) && isConst(f)) {

        if (template.value === f.value) return deepMapOf()

        if (isTruthy(ask($(f).isa(template).$, kb).result)) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && f.type === 'variable') {

        if (template.value === f.value) return deepMapOf([[template, f]])

        if (isTruthy(ask($(f.varType).isa(template.varType).$, kb).result)) return deepMapOf([[template, f]])

        // return deepMapOf([[template, f]])

    } else if (template instanceof Array && f instanceof Array) {

        return matchLists(template, f, kb)
    } else if (template.type === 'implicit-reference' && f.type === 'implicit-reference') {


        return matchImplicit(template, f, kb)

    } else if (template.type === 'arbitrary-type' && f.type === 'arbitrary-type') {

        // console.log(template, f)
        const m1 = match(template.head, f.head, kb)
        if (!m1) return undefined
        if (template.description.type === 'boolean' && template.description.value) return reduceMatchList([m1])

        const m2 = match(template.description, f.description, kb)

        return reduceMatchList([m1, m2])

    } else if (template.type === f.type) {

        const templateT = template as { [x: string]: LLangAst }
        const fT = f as { [x: string]: LLangAst }

        const templateKeys = Object.keys(template).filter(x => isLLangAst(templateT[x]) || (templateT[x] instanceof Array))
        const fKeys = Object.keys(f).filter(x => isLLangAst(fT[x]) || (fT[x] instanceof Array))

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

        return reduceMatchList(ms)

    } else if (template.type === 'list-pattern' && f.type === 'list-literal') {

        const { m } = matchListPToList(template, f, kb)
        return m

    } else if (template.type === 'implicit-reference' && f.type === 'variable') {

        return match(removeImplicit(template), f, kb)

    } else if (template.type === 'arbitrary-type' && f.type === 'variable') {
        const m1 = match(template.head, f, kb)
        const m2 = match(template.description, $(true).$, kb)
        if (reduceMatchList([m1, m2])) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && f.type === 'arbitrary-type') {
        const m1 = match(template, f.head, kb)
        if (m1 !== undefined) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && f.type === 'math-expression') {
        if (template.varType === 'number') return deepMapOf([[template, f]])

    } else if (template.type === 'number' && f.type === 'math-expression') {
        return deepMapOf([[template, f]])

    } else if (template.type === 'implicit-reference' && isConst(f)) {

        return match(removeImplicit(template), f, kb)

    } else if (template.type === 'arbitrary-type' && isConst(f)) {

        const m = match(template.head, f, kb)
        if (!m) return undefined

        const desc = subst(template.description, [template.head, f])
        const ok = isTruthy(ask(desc, kb).result)
        if (ok) return deepMapOf([[template, f]])

    } else if (template.type === 'implicit-reference' && f.type === 'arbitrary-type') {

        return match(removeImplicit(template), f, kb)

    } else if (template.type === 'variable' && isConst(f)) {

        if (isTruthy(ask($(f).isa(template.varType).$, kb).result)) {
            return deepMapOf([[template, f]])
        }

    } else if (template.type === 'variable' && isAtom(f)) {
        return deepMapOf([[template, f]])
    } else if (
        isSimpleFormula(template)
        && (f.type === 'conjunction' || f.type === 'disjunction')
    ) {
        const m1 = match(template, f.f1, kb)
        const m2 = match(template, f.f2, kb)
        if (m1) return m1
        if (m2) return m2
    }


}

function reduceMatchList(ms: (AstMap | undefined)[]): AstMap | undefined {
    if (ms.some(x => x === undefined)) return undefined

    return ms.map(x => x as AstMap)
        .reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}

function matchLists(template: LLangAst[], f: LLangAst[], kb: KnowledgeBase) {

    if (template.length > f.length) return undefined

    let ff = [...f]
    const ms: (AstMap | undefined)[] = []

    template.forEach(t => {

        if (t.type === 'list-pattern') {
            const { m, tailIndex } = matchListPToList(t, { type: 'list-literal', value: ff }, kb)
            ms.push(m)
            ff = ff.slice(tailIndex + 1)
        } else {
            ms.push(match(t, ff[0], kb))
            ff = ff.slice(1)
        }
    })

    return reduceMatchList(ms)

}

function matchListPToList(template: ListPattern, f: ListLiteral, kb: KnowledgeBase) {

    const tailIndex =
        astsEqual(template.value, $._.$) ? // no tail case
            f.value.length
            : f.value.findIndex((x, i) => {
                const m1 = match(template.value, x, kb)
                const m2 = match(template.seq, $(f.value.slice(0, i)).$, kb)
                return reduceMatchList([m1, m2])
            })

    if (tailIndex < 0) {
        return {
            m: undefined,
            tailIndex,
        }
    }

    const seq = f.value.slice(0, tailIndex)
    const tail = f.value[tailIndex]

    return {
        m: deepMapOf([[template.value, tail], [template.seq, $(seq).$]]),
        tailIndex,
    }

}

function matchImplicit(template: ImplicitReference, f: ImplicitReference, kb: KnowledgeBase) {
    return match(removeImplicit(template), removeImplicit(f), kb)
}