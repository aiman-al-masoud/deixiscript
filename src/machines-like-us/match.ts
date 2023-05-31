import { cartesian } from "../utils/cartesian.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { formulasEqual } from "./formulasEqual.ts";
import { getAtoms } from "./getAtoms.ts";
import { substAll } from "./subst.ts";
import { Atom, AtomicFormula, atomsEqual, isAtom, isAtomTruthy, isConst, isListLiteral, isVar, isVarish, LLangAst, Variable, VarMap } from "./types.ts";

export function match(template: LLangAst, formula: LLangAst) {

    const templateVars = getAtoms(template).filter(isVarish)
    const formulaTerms = getAtoms(formula)
    const varsToCands = templateVars.map(v => formulaTerms.map(t => [v, t] as const))
    const allCombos = cartesian(...varsToCands).map(x => deepMapOf(x))

    const result = allCombos.filter(c => {
        const sub = substAll(template, c)
        const equals = formulasEqual(sub, formula)
        return equals
    })
    // .map(unCrapify)

    return result
}



// function unCrapify(v: VarMap) {
//     const newEntries: [Variable, Atom][] = []

//     v.forEach((v, k) => {
//         if (k.type === 'list-pattern') {

//             if (v.type !== 'list-literal') throw new Error('error! ' + v.type);
//             if (v.list.length < 1) throw new Error('error!')

//             newEntries.push([k.seq as Variable, { type: 'list-literal', list: v.list.slice(0, -1) }])
//             newEntries.push([k.tail as Variable, v.list.at(-1)!])

//         } else {
//             newEntries.push([k, v])
//         }
//     })

//     return deepMapOf(newEntries)
// }



// const x = match($('x:thing').isa('animal').$, $('capra').isa('animal').$)

// const x = match(
//     $('x:thing').isa('animal').after('s:seq|e:event').$,
//     $('capra').isa('animal').after(['event#1', 'event#2']).$
// )

// console.log(x)







export function oldMatch(template: AtomicFormula, f: AtomicFormula): VarMap | undefined {

    if (!isListLiteral(f.after)) {
        return undefined
    }

    const fAfter = f.after
    let afterMap: VarMap

    if (isAtomTruthy(template.after) && !isAtomTruthy(f.after)) {
        return undefined
    }

    if (isVar(template.after)) {
        afterMap = deepMapOf([[template.after, { type: 'list-literal', list: fAfter.list.slice(0, -1) }]])
    } else if (isConst(template.after) || template.after.type === 'boolean') {
        afterMap = deepMapOf()
    } else if (template.after.type === 'list-literal') {
        afterMap = deepMapOf(template.after.list
            .filter(isVar)
            .map((x, i) => [x, fAfter.list[i]]))
    } else if(isVar(template.after.seq)&&isVar(template.after.tail)){
        afterMap = deepMapOf([[template.after.seq, { type: 'list-literal', list: fAfter.list.slice(0, -1) }], [template.after.tail, fAfter.list.at(-1)!]])
    }else{
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

