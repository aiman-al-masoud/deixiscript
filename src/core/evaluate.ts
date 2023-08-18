import { ask } from "./ask.ts";
import { decompress } from "./decompress.ts";
import { definitionOf } from "./definitionOf.ts";
import { evalArgs } from "./evalArgs.ts";
import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { tell } from "./tell.ts";
import { KnowledgeBase, LLangAst, WorldModel, isTruthy } from "./types.ts";

export function evaluate(ast: LLangAst, knowledgeBase: KnowledgeBase): {
    kb: KnowledgeBase,
    result: LLangAst,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    if (ast.type === 'command') {

        const { rast, kb: kb1 } = evalArgs(ast.f1, knowledgeBase)
        const def = rast.type !== 'conjunction' ? definitionOf(rast, kb1) : undefined

        if (def) return evaluate($(def).tell.$, kb1)

        const rast2 = rast.type === 'has-formula' || rast.type == 'is-a-formula' ? decompress(rast) : rast

        const rast3 = findAsts(rast2, 'when-derivation-clause').length ?
            rast2 : removeImplicit(rast2)

        return { ...tell(rast3, kb1), result: $(true).$, }

    } else if (ast.type === 'question') {

        return evaluate(ast.f1, knowledgeBase)

    } else {


        const { rast, kb: kb1 } = evalArgs(ast, knowledgeBase)
        const when = definitionOf(rast, kb1) ?? $(false).$
        const v = ask(when, kb1)
        if (isTruthy(v.result)) return { ...v, additions: [], eliminations: [] }
        const rast2 = decompress(rast)
        const rast3 = removeImplicit(rast2)

        return {
            ...ask(rast3, kb1),
            additions: [],
            eliminations: [],
        }
    }
}