import { deepMapOf } from "../utils/DeepMap.ts";
import { LLangAst, AstMap, isAtom, isLLangAst, isConst } from "./types.ts";


export function match(template: LLangAst, f: LLangAst): AstMap | undefined {

    if (template.type === 'is-a-formula' && f.type === 'is-a-formula') {

        const m1 = match(template.subject, f.subject)
        const m2 = match(template.object, f.object)
        const m3 = match(template.after, f.after)

        return reduceMatchList([m1, m2, m3])

    } else if (template.type === 'has-formula' && f.type === 'has-formula') {

        const m1 = match(template.subject, f.subject)
        const m2 = match(template.object, f.object)
        const m3 = match(template.after, f.after)
        const m4 = match(template.as, f.as)

        return reduceMatchList([m1, m2, m3, m4])

    } else if (template.type === 'generalized' && f.type === 'generalized') {

        const templateKeys = Object.keys(template).filter(x => isLLangAst(template[x]))
        const fKeys = Object.keys(f).filter(x => isLLangAst(f[x]))

        if (templateKeys.length !== fKeys.length) {
            return undefined
        }

        const ms = templateKeys.map(k => {

            const v1 = template[k]
            const v2 = f[k]

            if (!v1 || !v2) return undefined

            const result = match(v1, v2)

            return result
        })

        return reduceMatchList(ms)

    } else if (template.type === 'list-literal' && f.type === 'list-literal') {

        if (template.value.length !== f.value.length) return undefined
        const ms = template.value.map((x, i) => match(x, f.value[i]))
        return reduceMatchList(ms)

    } else if (template.type === 'list-pattern' && f.type === 'list-literal') {

        const seq = f.value.slice(0, -1)
        const tail = f.value.at(-1)

        if (!tail) return undefined

        const m1 = match(template.seq, { value: seq, type: 'list-literal' })
        const m2 = match(template.value, tail)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'equality' && f.type === 'equality') {

        const m1 = match(template.subject, f.subject)
        const m2 = match(template.object, f.object)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'entity' && f.type === 'entity') {
        return template.value === f.value ? deepMapOf() : undefined

    } else if (template.type === 'anything' && isConst(f)) {
        return deepMapOf()

    } else if (template.type === 'arbitrary-type' && f.type === 'arbitrary-type') {


        const m1 = match(template.head, f.head)
        const m2 = match(template.description, f.description)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'existquant' && f.type === 'existquant') {

        const m1 = match(template.value, f.value)
        return m1

    } else if (template.type === 'arbitrary-type' && f.type === 'variable') {

        const m1 = match(template.head, f)
        if (m1 !== undefined) return deepMapOf([[f, template]]) // ***

    } else if (template.type === 'variable' && f.type === 'arbitrary-type') {

        const m1 = match(template, f.head)
        if (m1 !== undefined) return deepMapOf([[template, f]]) // *** when matching variable to arbitrary-type or vice-versa don't lose any info, go with arbitrary-type!

    } else if (template.type === 'arbitrary-type' && isConst(f)) {
        
        return deepMapOf([[template, f]])
        

    } else if (template.type === 'conjunction' && f.type === 'conjunction') {

        const m1 = match(template.f1, f.f1)
        const m2 = match(template.f2, f.f2)
        const m11 = match(template.f1, f.f2)
        const m22 = match(template.f2, f.f1)

        return reduceMatchList([m1, m2]) ?? reduceMatchList([m11, m22])

    } else if (template.type === 'variable' && f.type === 'variable') {

        //TODO
        // return template.varType === f.varType ? deepMapOf([[template, f]]) : undefined // may undermatch in case of subtype/supertype relationships
        return deepMapOf([[template, f]]) // overmatch to avoid having to check subtype/supertype relations????

    } else if (template.type === 'variable' && isAtom(f)) {
        return deepMapOf([[template, f]])
    }

    // console.warn('error match: template=' + template.type + ' f=' + f.type)
}

function reduceMatchList(ms: (AstMap | undefined)[]): AstMap | undefined {
    if (ms.some(x => x === undefined)) return undefined

    return ms.map(x => x as AstMap)
        .reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}
