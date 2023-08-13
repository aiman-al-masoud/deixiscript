import { $ } from "../core/exp-builder.ts";
import { mapAsts } from "../core/mapAsts.ts";
import { match } from "../core/match.ts";
import { subst } from "../core/subst.ts";
import { LLangAst, KnowledgeBase, isAtom, isWhenDerivationClause, isConst, Constant } from "../core/types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { first } from "../utils/first.ts";


export function linearize(ast: LLangAst, kb: KnowledgeBase): string | undefined {
    const list = lin(ast, kb)
    if (!list) return undefined
    const toks = toTokens(list)
    const code = toks.reduce((a, b) => (a + b.value).trim() + ' ', '')
    return code
}

function lin(ast: LLangAst, kb: KnowledgeBase): LLangAst | undefined {

    if (isAtom(ast)) return ast

    const unwrap = (v: LLangAst) => mapAsts(v, x => x.type === 'generalized' && x['parse'] ? x['parse'] : x)

    const whenDcs = kb.derivClauses.filter(isWhenDerivationClause)

    const x = first(whenDcs, dc => {

        const when = unwrap(dc.when)
        const m = match(when, ast, kb)

        if (!m) return undefined
        const m2 = mapStuff(m, v => lin(v, kb) ?? v)
        const sub = subst(dc.conseq, m2)
        return sub
    })

    const result = x ? unwrap(x) : x
    return result
}

export function mapStuff<A>(m: DeepMap<A, A>, f: (v: A) => A): DeepMap<A, A> {
    const entries = Array.from(m.entries())
    const newEntries = entries.map(e => [f(e[0]), f(e[1])] as const)
    return deepMapOf(newEntries)
}

function toTokens(ast: LLangAst): Constant[] {

    if (ast.type === 'list') {
        return [$('(').$, ...ast.value.flatMap(x => toTokens(x)), $(')').$]
    }

    if (isConst(ast)) return [ast]

    throw new Error('')
}
