import { deepEquals } from "../utils/deepEquals.ts";
import { ask } from "./ask.ts";
import { decompress } from "./decompress.ts";
import { definitionOf } from "./definitionOf.ts";
import { evalArgs } from "./evalArgs.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { KnowledgeBase, LLangAst, WorldModel, astsEqual, isTruthy } from "./types.ts";

export function evaluate(ast: LLangAst, knowledgeBase: KnowledgeBase): {
    kb: KnowledgeBase,
    result: LLangAst,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    if (ast.type === 'command') {

        if (ast.f1.type === 'has-formula' || ast.f1.type==='is-a-formula' || ast.f1.type === 'complement') {
            const { rast, kb: kb1 } = evalArgs(ast.f1, knowledgeBase)

            const def = definitionOf(rast, kb1)
            if (def) return evaluate($(def).tell.$, kb1)

            const rast2 =  rast.type==='has-formula' || rast.type=='is-a-formula' ? decompress(rast) : rast


            return { ...tell(rast2, kb1), result: $(true).$, }
        }
      
        return {...tell(ast.f1, knowledgeBase),result: $(true).$,}

    } else if (ast.type === 'question') {

        return evaluate(ast.f1, knowledgeBase)

    } else {

        const { rast, kb: kb1 } = evalArgs(ast, knowledgeBase)
        const when = definitionOf(rast, kb1) ?? $(false).$
        const v = ask(when, kb1)
        if (isTruthy(v.result)) return { ...v, additions: [], eliminations: [] }
        const rast2 = decompress(rast)

        return {
            ...ask(rast2, kb1),
            additions: [],
            eliminations: [],
        }
    }
}