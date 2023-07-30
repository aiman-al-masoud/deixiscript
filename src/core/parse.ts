import { LLangAst, KnowledgeBase, isLLangAst, findMatch } from "./types.ts";


export function parse(
    ast: LLangAst,
    kb0: KnowledgeBase,
): {
    result: LLangAst,
    kb: KnowledgeBase,
} {

    const when = findMatch(ast, kb0)
    if (!when) return { result: ast, kb: kb0 }
    const when2 = findMatch(when, kb0) ?? when

    const entries = Object.entries(when2).filter((e): e is [string, LLangAst] => isLLangAst(e[1])).map(e => [e[0], parse(e[1], kb0).result])
    const ast2 = { ...when2, ...Object.fromEntries(entries) }
    return { result: ast2, kb: kb0 }
}
