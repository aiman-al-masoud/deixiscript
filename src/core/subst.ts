import { LLangAst, AstMap, isLLangAst, astsEqual } from "./types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { hash } from "../utils/hash.ts";
import { sorted } from "../utils/sorted.ts";


export function subst<T extends LLangAst>(formula: T, map: AstMap): T
export function subst<T extends LLangAst>(formula: T, ...entries: [LLangAst, LLangAst][]): T

export function subst(formula: LLangAst, arg: unknown): LLangAst {

    if (arg instanceof DeepMap) {
        const subs = Array.from(arg.entries())
        const sortedSubs = sorted(subs, (s1, s2) => hash(s2[0]).length - hash(s1[0]).length)
        return sortedSubs.reduce((f, s) => substOnce(f, s[0], s[1]) as LLangAst, formula)

    } else if (arg instanceof Array) {
        return subst(formula, deepMapOf([arg] as [LLangAst, LLangAst][]))
    }

    throw new Error('illegal argument! ' + arg)
}

function substOnce(
    ast: LLangAst | LLangAst[],
    oldTerm: LLangAst,
    replacement: LLangAst,
): LLangAst | LLangAst[] {

    if (ast instanceof Array) {
        return ast.map(e => substOnce(e, oldTerm, replacement) as LLangAst)
    }

    if (astsEqual(oldTerm, ast)) {
        return replacement
    }

    const newEntries = Object.entries(ast)
        .filter(e => isLLangAst(e[1]) || e[1] instanceof Array)
        .map(e => [e[0], substOnce(e[1] as LLangAst, oldTerm, replacement)] as const)

    return {
        ...ast,
        ...Object.fromEntries(newEntries),
    } as LLangAst
}
