import { deepMapOf } from "../utils/DeepMap.ts";
import { Atom, LLangAst, VarMap, SimpleFormula } from "./types.ts";


export function match(template: SimpleFormula | Atom, f: LLangAst): VarMap | undefined {

    if (template.type === 'is-a-formula' && f.type === 'is-a-formula') {

        const m1 = match(template.t1, f.t1)
        const m2 = match(template.t2, f.t2)
        const m3 = match(template.after, f.after)

        // console.log(m1, m2, m3)

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

        if (template.list.length !== f.list.length) return undefined
        const ms = template.list.map((x, i) => match(x, f.list[i]))
        return reduceMatchList(ms)

    } else if (template.type === 'list-pattern' && f.type === 'list-pattern') {
        //
    } else if (template.type === 'list-literal' && f.type === 'list-pattern') {
        //
    } else if (template.type === 'list-pattern' && f.type === 'list-literal') {

        const seq = f.list.splice(0, -1)
        const tail = f.list.at(-1)

        if (!tail) return undefined

        const m1 = match(template.seq, { list: seq, type: 'list-literal' })
        const m2 = match(template.tail, tail)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'equality' && f.type === 'equality') {

        const m1 = match(template.t1, f.t1)
        const m2 = match(template.t2, f.t2)

        return reduceMatchList([m1, m2])

    } else if (template.type === 'constant' && f.type === 'constant') {

        // if(template.value === 'dude') console.log(template.value === f.value)
        // if(template.value !== f.value) console.log('template=', template, 'f=',f)

        return template.value === f.value ? deepMapOf() : undefined

    } else if (template.type === 'variable' && f.type === 'variable') {
        return deepMapOf([[template, f]])
    } else if (template.type === 'variable' && f.type === 'constant') {
        return deepMapOf([[template, f]])
    } else if (template.type === 'variable' && f.type === 'list-literal') {
        return deepMapOf([[template, f]])
    } else if (template.type === 'variable' && f.type === 'number') {
        return deepMapOf([[template, f]])
    } else if (template.type === 'variable' && f.type === 'boolean') {
        return deepMapOf([[template, f]])
    }

    // console.warn('error match: template=' + template.type + ' f=' + f.type)
    return undefined

    // if (!isFormulaWithAfter(f) || !isFormulaWithAfter(template)) {
    //     return
    // }

    // if (!isListLiteral(f.after)) {
    //     return undefined
    // }

    // if (isTruthy(template.after) && !isTruthy(f.after)) {
    //     return undefined
    // }

    // if (template.type !== f.type) {
    //     return undefined
    // }

    // let afterMap: VarMap
    // let zipped: (readonly [Atom, Atom])[] = []

    // if (isVar(template.after)) {
    //     afterMap = deepMapOf([[template.after, { type: 'list-literal', list: f.after.list.slice(0, -1) }]])
    // } else if (isConst(template.after)) {
    //     afterMap = deepMapOf()
    // } else if (template.after.type === 'list-literal') {
    //     const list = f.after.list
    //     afterMap = deepMapOf(template.after.list
    //         .filter(isVar)
    //         .map((x, i) => [x, list[i]]))
    // } else if (isVar(template.after.seq) && isVar(template.after.tail)) {
    //     afterMap = deepMapOf([[template.after.seq, { type: 'list-literal', list: f.after.list.slice(0, -1) }], [template.after.tail, f.after.list.at(-1)!]])
    // } else {
    //     afterMap = deepMapOf()
    // }

    // if (template.type === 'generalized' && f.type === 'generalized') {
    //     const templateKeys = Object.keys(template.keys)
    //     const fKeys = Object.keys(f.keys)
    //     const intersect = intersection(templateKeys, fKeys)

    //     if (intersect.length !== templateKeys.length || intersect.length !== fKeys.length) {
    //         return undefined
    //     }

    //     zipped = templateKeys.map(k => [template.keys[k], f.keys[k]] as const)
    // } else if (isAtomicFormula(template) && isAtomicFormula(f)) {

    //     const templateTerms = [template.t1, template.t2, ...(template.type === 'has-formula' ? [template.as] : [])]
    //     const fTerms = [f.t1, f.t2, ...(f.type === 'has-formula' ? [f.as] : [])]
    //     zipped = templateTerms.map((x, i) => [x, fTerms[i]] as const)
    // }

    // const disagree = zipped.some(e => (!e[0] || !e[1]) || isConst(e[0]) && isConst(e[1]) && !atomsEqual(e[0], e[1]))
    // const reduced = zipped.filter(e => e[0] !== e[1]).filter(e => isVar(e[0])) as [Variable, Atom][]

    // if (!disagree) {
    //     return deepMapOf([...afterMap, ...reduced])
    // }

}


function reduceMatchList(ms: (VarMap | undefined)[]): VarMap | undefined {
    if (ms.some(x => x === undefined)) return undefined

    return ms.map(x => x as VarMap)
        .reduce((x, y) => deepMapOf([...x, ...y]), deepMapOf())
}