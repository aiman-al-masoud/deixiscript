import { ask } from "./ask.ts";
import { decompress } from "./decompress.ts";
import { definitionOf } from "./definitionOf.ts";
import { evalArgs } from "./evalArgs.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function evaluate(ast: LLangAst, knowledgeBase: KnowledgeBase): {
    kb: KnowledgeBase,
    result: LLangAst,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    if (ast.type === 'command') {
        return {
            ...tell(ast.f1, knowledgeBase),
            result: $(true).$,
        }
    } else if (ast.type === 'question') {

        return evaluate(ast.f1, knowledgeBase)

    } else {

        const { rast, kb: kb1 } = evalArgs(ast, knowledgeBase)
        const when = definitionOf(rast, kb1)
        if (when) return evaluate(when, kb1)
        const rast2 = ast.type === 'is-a-formula' || ast.type === 'has-formula' ? decompress(rast) : rast

        return {
            ...ask(rast2, kb1),
            additions: [],
            eliminations: [],
        }
    }
}