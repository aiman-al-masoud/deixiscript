import { LLangAst, Constant, KnowledgeBase, Variable } from "./types.ts";
import { substAll } from "./subst.ts";
import { test } from "./test.ts";
import { uniq } from "../utils/uniq.ts";
import { cartesian } from "../utils/cartesian.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from './exp-builder.ts'

export function findAll(
    formula: LLangAst,
    variables: Variable[],
    kb: KnowledgeBase,
): DeepMap<Variable, Constant>[] {

    const constants = uniq(kb.wm.flatMap(x => x)).map(c => $(c).$)

    const varToCands = variables.map(v => {
        const candidates =
            constants.filter(c => test($(c.value).isa(v.varType).$, kb))
        return candidates.map(c => [v, c] as const)
    })

    const allCombos = cartesian(...varToCands).map(x => deepMapOf(x))


    const results = allCombos.filter(c => {
        const sub = substAll(formula, c)
        // console.log('sub=', sub)
        return test(sub, kb)
    })

    return results
}
