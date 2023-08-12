import { mapAsts } from "../core/mapAsts.ts";
import { match } from "../core/match.ts";
import { subst } from "../core/subst.ts";
import { LLangAst, KnowledgeBase, isAtom, isWhenDerivationClause, isConst } from "../core/types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { first } from "../utils/first.ts";


export function linearize(ast: LLangAst, kb: KnowledgeBase): string | undefined {
    const list = lin(ast, kb)
    if (!list) return undefined
    const r1 = unroll(list)
    return r1
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

function unroll(ast: LLangAst): string {

    if (ast.type === 'list') {
        return '(' + ast.value.flatMap(x => unroll(x)).reduce((a, b) => a + b + ' ', '').trim() + ')'
    }

    if (isConst(ast)) return ast.value + ''

    throw new Error('')
}
