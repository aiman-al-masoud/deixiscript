import { LLangAst, Constant, KnowledgeBase, Variable } from "./types.ts";
import { subst } from "./subst.ts";
import { ask } from "./ask.ts";
import { uniq } from "../utils/uniq.ts";
import { cartesian } from "../utils/cartesian.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from './exp-builder.ts'
import { findEquations, solve } from "./solve.ts";
import { match } from "./match.ts";
import { findAsts } from "./findAsts.ts";

export function findAll(
    formula: LLangAst,
    variables: Variable[],
    kb: KnowledgeBase,
    preComputeKb = true,
): DeepMap<Variable, Constant>[] {

    const numberConstants0 = kb.derivClauses.flatMap(x => {
        const map = match(x.conseq, formula)
        if (!map) return []
        const when = subst(x.when, map)
        // console.log('when=', when)
        const mathExps = findAsts(when, 'math-expression')
        const numbers = mathExps.map(x => ask(x, kb).result)
        return numbers as Constant[]
    })

    const numberConstants = findEquations(formula).flatMap(x => {
        try {
            return solve(x)
        } catch {
            return []
        }
    })

    const constants = uniq(kb.wm.flatMap(x => x)).map(c => $(c).$).concat(numberConstants).concat(numberConstants0)

    const varToCands = variables.map(v => {
        const candidates =
            constants.filter(c => ask($(c.value).isa(v.varType).$, kb, { preComputeKb, storeDeixis: false }).result.value)
        return candidates.map(c => [v, c] as const)
    })

    const allCombos = cartesian(...varToCands).map(x => deepMapOf(x))

    const results = allCombos.filter(c => {
        const sub = subst(formula, c)
        return ask(sub, kb, { preComputeKb, storeDeixis: false }).result.value
    })

    return results
}
