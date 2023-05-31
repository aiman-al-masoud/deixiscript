import { cartesian } from "../utils/cartesian.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { getTerms } from "./getTerms.ts";
import { substAll } from "./subst.ts";
import { formulasEqual, isVar, LLangAst, Variable } from "./types.ts";

export function match(template: LLangAst, formula: LLangAst) {

    const templateVars = getTerms(template) /* as Variable[] */.filter(isVar)
    const formulaTerms = getTerms(formula)

    // console.log('templateVars=', templateVars)

    const varsToCands = templateVars.map(v => formulaTerms.map(t => [v, t] as const))
    const allCombos = cartesian(...varsToCands).map(x => deepMapOf(x))

    const result = allCombos.filter(c => {
        // console.log(c)
        const sub = substAll(template, c)
        // console.log('sub=', sub)
        // const equal = JSON.stringify(sub) === JSON.stringify(formula)
        // return equal
        return formulasEqual(sub, formula)
    })

    return result
}

const x = match($('x:thing').isa('animal').$, $('capra').isa('animal').$)

// const x = match(
//     $('x:thing').isa('animal').after('s:seq|e:event').$,
//     $('capra').isa('animal').after(['event#1', 'event#2']).$
// )
console.log(x)

