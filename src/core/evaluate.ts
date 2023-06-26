import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { recomputeKb } from "./recomputeKb.ts";
import { Atom, KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function evaluate(args: { ast: LLangAst, kb: KnowledgeBase, isCommand?: boolean, }): {
    kb: KnowledgeBase,
    result: Atom,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    if (args.isCommand) {
        const { kb, additions, eliminations } = recomputeKb(args.ast, args.kb)
        return {
            kb,
            additions,
            eliminations,
            result: $(true).$
        }
    } else {
        const result = ask(args.ast, args.kb)
        return {
            kb: args.kb,
            additions: [],
            eliminations: [],
            result: result as Atom,
        }
    }
}