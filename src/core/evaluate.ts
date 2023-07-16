import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { Atom, KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function evaluate(ast: LLangAst, knowledgeBase: KnowledgeBase): {
    kb: KnowledgeBase,
    result: Atom,
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
        return {
            ...ask(ast, knowledgeBase),
            additions: [],
            eliminations: [],
        }
    }
}