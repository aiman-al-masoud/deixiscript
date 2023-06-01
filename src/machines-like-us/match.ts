// import { cartesian } from "../utils/cartesian.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { Atom, atomsEqual, isTruthy, isConst, isListLiteral, isVar, LLangAst, Variable, VarMap, isAtomicFormula } from "./types.ts";
import { intersection } from '../utils/intersection.ts'

export function match(template: LLangAst, f: LLangAst): VarMap | undefined {

    if (template.type === 'generalized' && f.type === 'generalized') {
        const templateKeys = Object.keys(template.keys)
        const fKeys = Object.keys(f.keys)
        const intersect = intersection(templateKeys, fKeys)

        if (intersect.length !== templateKeys.length || intersect.length !== fKeys.length) {
            return
        }

        const zipped = templateKeys.map(k => [template.keys[k], f.keys[k]] as const)

        // TODO: DUPLICATE CODE!
        const disagree = zipped.some(e => (!e[0] || !e[1]) || isConst(e[0]) && isConst(e[1]) && !atomsEqual(e[0], e[1]))
        const reduced = zipped.filter(e => e[0] !== e[1]).filter(e => isVar(e[0])) as [Variable, Atom][]

        if (!disagree) {
            return deepMapOf(reduced)
        }

        throw new Error('not implemented!')
    }

    if (!isAtomicFormula(f) || !isAtomicFormula(template)) {
        return
    }

    if (!isListLiteral(f.after)) {
        return undefined
    }

    if (isTruthy(template.after) && !isTruthy(f.after)) {
        return undefined
    }

    let afterMap: VarMap

    if (isVar(template.after)) {
        afterMap = deepMapOf([[template.after, { type: 'list-literal', list: f.after.list.slice(0, -1) }]])
    } else if (isConst(template.after) || template.after.type === 'boolean' || template.after.type === 'number') {
        afterMap = deepMapOf()
    } else if (template.after.type === 'list-literal') {
        const list = f.after.list
        afterMap = deepMapOf(template.after.list
            .filter(isVar)
            .map((x, i) => [x, list[i]]))
    } else if (isVar(template.after.seq) && isVar(template.after.tail)) {
        afterMap = deepMapOf([[template.after.seq, { type: 'list-literal', list: f.after.list.slice(0, -1) }], [template.after.tail, f.after.list.at(-1)!]])
    } else {
        afterMap = deepMapOf()
    }

    const templateTerms = [template.t1, template.t2, ...(template.type === 'has-formula' ? [template.as] : [])]
    const fTerms = [f.t1, f.t2, ...(f.type === 'has-formula' ? [f.as] : [])]

    const zipped = templateTerms.map((x, i) => [x, fTerms[i]] as const)
    const disagree = zipped.some(e => (!e[0] || !e[1]) || isConst(e[0]) && isConst(e[1]) && !atomsEqual(e[0], e[1]))
    const reduced = zipped.filter(e => e[0] !== e[1]).filter(e => isVar(e[0])) as [Variable, Atom][]

    if (!disagree) {
        return deepMapOf([...afterMap, ...reduced])
    }

}
