import { deepMapOf } from "../utils/DeepMap.ts";
import { Atom, LLangAst, VarMap, SimpleFormula, isAtom } from "./types.ts";


export function match(template: /* SimpleFormula | Atom */ LLangAst, f: LLangAst): VarMap | undefined {

    if (template.type === 'is-a-formula' && f.type === 'is-a-formula') {

        const m1 = match(template.t1, f.t1)
        const m2 = match(template.t2, f.t2)
        const m3 = match(template.after, f.after)

        return reduceMatchList([m1, m2, m3])

    } else if (template.type === 'has-formula' && f.type === 'has-formula') {

        const m1 = match(template.t1, f.t1)
        const m2 = match(template.t2, f.t2)
        const m3 = match(template.after, f.after)
        const m4 = match(template.as, f.as)

        return reduceMatchList([m1, m2, m3, m4])

    } else if (template.type === 'generalized' && f.type === 'generalized') {

        const templateKeys = Object.keys(template.keys)
        const fKeys = Object.keys(f.keys)

        if (templateKeys.length !== fKeys.length) {
            return undefined
        }

        const ms = templateKeys.map(k => {

            const v1 = template.keys[k]
            const v2 = f.keys[k]

            if (!v1 || !v2) return undefined

            return match(v1, v2)
        })
            .concat(match(template.after, f.after))

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

        const m1 = match(template.t1, f.t1)
        const m2 = match(template.t2, f.t2)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'entity' && f.type === 'entity') {
        return template.value === f.value ? deepMapOf() : undefined
    } else if (template.type === 'variable' && isAtom(f)) {
        return deepMapOf([[template, f]])
    }

    // console.warn('error match: template=' + template.type + ' f=' + f.type)
}

function reduceMatchList(ms: (VarMap | undefined)[]): VarMap | undefined {
    if (ms.some(x => x === undefined)) return undefined

    return ms.map(x => x as VarMap)
        .reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}