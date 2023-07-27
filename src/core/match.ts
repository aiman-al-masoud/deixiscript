import { deepMapOf } from "../utils/DeepMap.ts";
import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { subst } from "./subst.ts";
import { LLangAst, AstMap, isAtom, isLLangAst, isConst, isSimpleFormula, KnowledgeBase } from "./types.ts";


export function match(template: LLangAst, f: LLangAst, kb: KnowledgeBase): AstMap | undefined {

    if (isConst(template) && isConst(f)) {

        return template.value === f.value ? deepMapOf() : undefined

    } else if (template.type === 'variable' && f.type === 'variable') {

        // if (template.varType === f.varType || ask($(f.varType).isa(template.varType).$, kb).result.value){
        //     return deepMapOf([[template, f]])
        // }

        // return template.varType === f.varType ? deepMapOf([[template, f]]) : undefined // may undermatch in case of subtype/supertype relationships
        return deepMapOf([[template, f]]) // overmatch to avoid having to check subtype/supertype relations (hyperonymy)????

    } else if (
        template.type === f.type ||
        template instanceof Array && f instanceof Array
    ) {

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
        const seq = f.value.slice(0, -1)
        const tail = f.value.at(-1)

        if (!tail) return undefined

        const m1 = match(template.seq, { value: seq, type: 'list-literal' }, kb)
        const m2 = match(template.value, tail, kb)

        return reduceMatchList([m1, m2])

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

    } else if (template.type === 'arbitrary-type' && isConst(f)) {

        const m = match(template.head, f, kb)
        if (!m) return undefined

        const desc = subst(template.description, [template.head, f])
        const ok = ask(desc, kb).result.value
        if (ok) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && isConst(f)) {

        if (ask($(f).isa(template.varType).$, kb).result.value) {
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

    // console.warn('error match: template=' + template.type + ' f=' + f.type)
}

function reduceMatchList(ms: (AstMap | undefined)[]): AstMap | undefined {
    if (ms.some(x => x === undefined)) return undefined

    return ms.map(x => x as AstMap)
        .reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}
