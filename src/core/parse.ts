import { LLangAst, KnowledgeBase, isLLangAst, findMatch } from "./types.ts";


export function parse(
    ast: LLangAst,
    kb: KnowledgeBase,
): LLangAst {

    const when = findMatch(ast, kb)
    if (!when) return ast

    const entries = Object.entries(when)
        .filter((e): e is [string, LLangAst] => isLLangAst(e[1]))
        .map(e => [e[0], parse(e[1], kb)])

    const ast2 = { ...when, ...Object.fromEntries(entries) }
    return parse(ast2, kb)
}
