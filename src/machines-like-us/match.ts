import { cartesian } from "../utils/cartesian.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { getTerms } from "./getTerms.ts";
import { substAll } from "./subst.ts";
import { formulasEqual, isVar, LLangAst } from "./types.ts";

export function match(template: LLangAst, formula: LLangAst) {

    const templateVars = getTerms(template).filter(isVar)
    const formulaTerms = getTerms(formula)

    const varsToCands = templateVars.map(v => formulaTerms.map(t => [v, t] as const))
    const allCombos = cartesian(...varsToCands).map(x => deepMapOf(x))

    const result = allCombos.filter(c => {
        const sub = substAll(template, c)
        // const equal = JSON.stringify(sub) === JSON.stringify(formula)
        // return equal
        return formulasEqual(sub, formula)
    })

    return result
}

const x = match($('x:thing').isa('animal').$, $('capra').isa('animal').$)
console.log(x)
