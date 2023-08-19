import { LLangAst, AstMap, isLLangAst, astsEqual } from "./types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { hash } from "../utils/hash.ts";
import { sorted } from "../utils/sorted.ts";
import { $ } from "./exp-builder.ts";
import { valueIs } from "../utils/valueIs.ts";


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
    ast: LLangAst,
    oldTerm: LLangAst,
    replacement: LLangAst,
): LLangAst {

    if (astsEqual(oldTerm, ast)) {
        return replacement
    }

    if (ast.type === 'list') {
        return $(ast.value.map(e => substOnce(e, oldTerm, replacement))).$
    }

    const newEntries = Object.entries(ast)
        .filter(valueIs(isLLangAst))
        .map(e => [e[0], substOnce(e[1], oldTerm, replacement)] as const)

    return {
        ...ast,
        ...Object.fromEntries(newEntries),
    }
}
