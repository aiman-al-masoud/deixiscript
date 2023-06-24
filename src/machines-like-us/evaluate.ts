import { $ } from "./exp-builder.ts";
import { recomputeKb } from "./recomputeKb.ts";
import { test } from "./test.ts";
import { Atom, KnowledgeBase, LLangAst } from "./types.ts";

export function evaluate(ast: LLangAst, isCommand: boolean, kb: KnowledgeBase): [KnowledgeBase, Atom] {
    if (isCommand) {
        return [recomputeKb(ast, kb), $(true).$]
    } else {
        return [kb, test(ast, kb) as Atom]
    }
}