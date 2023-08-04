import { mapAsts } from "../core/mapAsts.ts";

import { LLangAst, KnowledgeBase, definitionOf } from "../core/types.ts";


export function parse(
    ast: LLangAst,
    kb: KnowledgeBase,
): LLangAst {

    const when = definitionOf(ast, kb)
    if (!when) return ast

    const ast2 = mapAsts(when, x => parse(x, kb))
    return ast2
}
