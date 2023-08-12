import { $ } from "../core/exp-builder.ts";
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
    const wrap = (v: LLangAst) => mapAsts(v, x => $({ parse: x }).$, { top: false })

    const newAst = wrap(ast)
    const whenDcs = kb.derivClauses.filter(isWhenDerivationClause)

    // just unwrap dc.when instead?

    const x = first(whenDcs, dc => {
        const m = match(dc.when, newAst, kb)
        if (!m) return undefined
        // print('newAst=', newAst)
        // print('dc.when=', dc.when)
        const m2 = mapStuff(m, v => unwrap(v))
        // print('m2=', m2)
        const m3 = mapStuff(m2, v => lin(v, kb) ?? v)
        // print('m3=', m3)
        const sub = subst(dc.conseq, m3)
        // print('sub=', sub)
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
