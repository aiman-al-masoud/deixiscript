import { LLangAst, AstMap, isLLangAst, astsEqual } from "./types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { valueIs } from "../utils/valueIs.ts";


export function subst<T extends LLangAst>(ast: T, map: AstMap): T
export function subst<T extends LLangAst>(ast: T, ...entries: [LLangAst, LLangAst][]): T

export function subst(ast: LLangAst, arg: unknown): LLangAst {

    if (arg instanceof DeepMap) {
        const subs = Array.from(arg.entries())
        if (!subs.length) return ast
        // const sortedSubs = sorted(subs, (s1, s2) => hash(s2[0]).length - hash(s1[0]).length)
        return /* sortedSubs */subs.reduce((f, s) => substOnce(f, s[0], s[1]) as LLangAst, ast)

    } else if (arg instanceof Array) {
        return subst(ast, deepMapOf([arg] as [LLangAst, LLangAst][]))
    }

    throw new Error('illegal argument! ' + arg)
}

function substOnce(
    ast: LLangAst,
    oldTerm: LLangAst,
    replacement: LLangAst,
): LLangAst {

    if (astsEqual(oldTerm, ast)) {
        return replacement
    }

    if (ast.type === 'list') {
        return $(ast.value.map(x => substOnce(x, oldTerm, replacement))).$
    }

    const newEntries = Object.entries(ast)
        .filter(valueIs(isLLangAst))
        .map(e => [e[0], substOnce(e[1], oldTerm, replacement)] as const)

    return {
        ...ast,
        ...Object.fromEntries(newEntries),
    }
}
