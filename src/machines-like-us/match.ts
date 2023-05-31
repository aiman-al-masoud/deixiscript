import { cartesian } from "../utils/cartesian.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { formulasEqual } from "./formulasEqual.ts";
import { getAtoms } from "./getAtoms.ts";
import { substAll } from "./subst.ts";
import { Atom, isVarish, LLangAst, Variable, VarMap } from "./types.ts";

export function match(template: LLangAst, formula: LLangAst) {

    const templateVars = getAtoms(template).filter(isVarish)
    const formulaTerms = getAtoms(formula)

    // console.log('templateVars=', templateVars)

    const varsToCands = templateVars.map(v => formulaTerms.map(t => [v, t] as const))
    const allCombos = cartesian(...varsToCands).map(x => deepMapOf(x))

    const result = allCombos.filter(c => {
        // console.log('---------')
        const sub = substAll(template, c)
        // console.log('sub=',sub)
        // console.log('sub=', sub)
        // const equal = JSON.stringify(sub) === JSON.stringify(formula)
        // return equal
        const equals = formulasEqual(sub, formula)


        // if (equals) console.log(c, '----------') //console.log('sub=', sub, '\n', 'formula=', formula, '\n--------------')


        return equals
    })
        .map(unCrapify)

    return result
}



function unCrapify(v: VarMap) {
    const newEntries: [Variable, Atom][] = []

    v.forEach((v, k) => {
        if (k.type === 'list-pattern') {

            if (v.type !== 'list-literal') throw new Error('error! ' + v.type);
            if (v.list.length < 1) throw new Error('error!')

            newEntries.push([k.seq as Variable, { type: 'list-literal', list: v.list.slice(0, -1) }])
            newEntries.push([k.tail as Variable, v.list.at(-1)!])

        } else {
            newEntries.push([k, v])
        }
    })

    return deepMapOf(newEntries)
}



// const x = match($('x:thing').isa('animal').$, $('capra').isa('animal').$)

// const x = match(
//     $('x:thing').isa('animal').after('s:seq|e:event').$,
//     $('capra').isa('animal').after(['event#1', 'event#2']).$
// )

// console.log(x)