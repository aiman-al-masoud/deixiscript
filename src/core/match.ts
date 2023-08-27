import { deepMapOf } from "../utils/DeepMap.ts";
import { hasUnmatched } from "../utils/hasUnmatched.ts";
import { evaluate } from "./evaluate.ts";
import { $ } from "./exp-builder.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { subst } from "./subst.ts";
import { LLangAst, AstMap, isLLangAst, isConst, KnowledgeBase, List, Entity, astsEqual, isTruthy } from "./types.ts";


export function match(template: LLangAst, f: LLangAst, kb: KnowledgeBase): AstMap | undefined {

    template = removeImplicit(template)
    f = removeImplicit(f)

    if (isConst(template) && isConst(f)) {
        if (template.value === f.value) return deepMapOf()
        if (isTruthy(evaluate($(f).isa(template).$, kb, { asIs: true }).result)) return deepMapOf([[template, f]])

    } else if (template.type === 'list' && f.type === 'list') {
        return matchLists(template, f, kb)

    } else if (template.type === 'is-a-formula' && f.type === 'is-a-formula') {
        return deepMapOf([[template.subject, f.subject], [template.object, f.object]])

    } else if (template.type === 'arbitrary-type' && f.type === 'arbitrary-type') {
        return match(template.description, f.description, kb)

    } else if (template.type === 'arbitrary-type' && isConst(f)) {

        if (!match($(template.head).$, f, kb)) return undefined

        const desc = subst(template.description, [template.head, f])
        const ok = isTruthy(evaluate(desc, kb, { asIs: true }).result)
        if (ok) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && f.type === 'variable') {
        if (!match($(template.varType).$, $(f.varType).$, kb)) return undefined
        return match($(template).suchThat(true).$, $(f).suchThat(true).$, kb)

    } else if (template.type === 'variable' && f.type === 'arbitrary-type') {
        return match($(template).suchThat(true).$, f, kb)

    } else if (template.type === 'variable' && isConst(f)) {

        if (!match($(template.varType).$, f, kb)) return undefined
        return deepMapOf([[template, f]])

    } else if (template.type === 'variable') {
        // if (askBin($(f).isa(template.varType).$, kb)) return deepMapOf([[template, f]])
        // if (isTruthy(evaluate($(f).isa(template.varType).$, kb, {asIs:true}).result)) return deepMapOf([[template, f]])
        return deepMapOf([[template, f]])

    } else if (template.type === f.type) {
        return matchGeneric(template, f, kb)

        // } else if (isThing(template) && isThing(f)) {
        //     return match(removeImplicit(template), removeImplicit(f), kb)

    } else if (f.type === 'conjunction' /* || f.type === 'disjunction' */) {
        const m1 = match(template, f.f1, kb)
        const m2 = match(template, f.f2, kb)
        if (m1) return m1
        if (m2) return m2
    }

}

// function isThing(ast: LLangAst): ast is Which | ImplicitReference | Constant {
//     return ast.type === 'which' || ast.type === 'implicit-reference' || (ast.type === 'complement' && pointsToThings(ast)) || isConst(ast)
// }

function matchGeneric(template: LLangAst, f: LLangAst, kb: KnowledgeBase) {
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
}

function reduceMatchList(ms: (AstMap | undefined)[]): AstMap | undefined {
    return ms.reduce((a, m) => {
        if (!m) return undefined
        if (!a) return undefined
        if (mapsDisagree(a, m)) return undefined
        return deepMapOf([...a, ...m])
    }, deepMapOf() as AstMap | undefined)
}

function mapsDisagree(m1: AstMap, m2: AstMap) {
    const ks1 = Array.from(m1.keys())
    const ks2 = Array.from(m2.keys())
    const ks = ks1.concat(ks2)
    return ks.some(k => {
        const v1 = m1.get(k)
        const v2 = m2.get(k)
        return v1 && v2 && !astsEqual(v1, v2)
    })
}

function toStringList(list: LLangAst[]) {
    const result = list.filter((x): x is Entity => x.type === 'entity').map(x => x.value)
    return result
}

function matchLists(template: List, formula: List, kb: KnowledgeBase) {

    if (template.value.length > formula.value.length) return undefined

    if (template.value.length === 0 && formula.value.length !== 0) return undefined

    let ff = [...formula.value]
    const ms: (AstMap | undefined)[] = []

    template.value.forEach((t, i) => {

        const nextT = template.value.at(i + 1)

        if (t.type === 'variable' && t.varType === 'list') {
            const k = ff.findIndex((x, j) => match(nextT ?? $('nothing').$, x, kb) && !hasUnmatched(toStringList(ff.slice(0, j))))

            if (k === -1 && nextT) return ms.push(undefined)

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
