import { deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { LLangAst, AstMap, isAtom, isLLangAst, isConst, isSimpleFormula } from "./types.ts";


export function match(template: LLangAst, f: LLangAst): AstMap | undefined {

    if (isConst(template) && isConst(f)) {
        return template.value === f.value ? deepMapOf() : undefined

    } else if (template.type === 'variable' && f.type === 'variable') {
        // return template.varType === f.varType ? deepMapOf([[template, f]]) : undefined // may undermatch in case of subtype/supertype relationships
        return deepMapOf([[template, f]]) // overmatch to avoid having to check subtype/supertype relations????

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

            const result = match(v1, v2)

            return result
        })

        return reduceMatchList(ms)

    } else if (template.type === 'list-pattern' && f.type === 'list-literal') {
        const seq = f.value.slice(0, -1)
        const tail = f.value.at(-1)

        if (!tail) return undefined

        const m1 = match(template.seq, { value: seq, type: 'list-literal' })
        const m2 = match(template.value, tail)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'arbitrary-type' && f.type === 'variable') {
        const m1 = match(template.head, f)
        const m2 = match(template.description, $(true).$)
        if (reduceMatchList([m1, m2])) return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && f.type === 'arbitrary-type') {
        const m1 = match(template, f.head)
        if (m1 !== undefined) return deepMapOf([[template, f]])

    } else if (template.type==='variable' && f.type==='math-expression'){
        if (template.varType === 'number') return deepMapOf([[template, f]])

    } else if (template.type==='number' && f.type==='math-expression'){
        return deepMapOf([[template, f]])

    // } else if (template.type==='arbitrary-type' && f.type==='math-expression'){
    //     return deepMapOf([[template, f]])
        

    } else if (template.type === 'arbitrary-type' && isConst(f)) {
        return deepMapOf([[template, f]])

    } else if (template.type === 'variable' && isAtom(f)) {
        return deepMapOf([[template, f]])
    } else if (
        isSimpleFormula(template)
        && (f.type === 'conjunction' || f.type === 'disjunction')
    ) {
        const m1 = match(template, f.f1)
        const m2 = match(template, f.f2)
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
