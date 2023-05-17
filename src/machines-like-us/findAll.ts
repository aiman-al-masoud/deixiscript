import { Ast, Constant, KnowledgeBase, Variable } from "./types.ts";
import { substAll } from "./subst.ts";
import { test } from "./test.ts";
import { uniq } from "../utils/uniq.ts";
import { getSupers } from "./wm-funcs.ts";
import { cartesian } from "../utils/cartesian.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from './exp-builder.ts'

export function findAll(
    formula: Ast,
    variables: Variable[],
    kb: KnowledgeBase,
): DeepMap<Variable, Constant>[] {

    const constants = uniq(kb.wm.map(x => x[0])).map(c => $(c).$)

    const varToCands = variables.map(v => {
        const candidates = constants.filter(c => getSupers(c.value, kb.wm).includes(v.varType))
        return candidates.map(c => [v, c] as const)
    })

    const allCombos = cartesian(...varToCands)
        .map(x => deepMapOf(x))

    const results = allCombos.filter(c => {
        const sub = substAll(formula, c)
        return test(sub, kb)
    })

    return results
}
