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
    return unroll(list)
}

function lin(ast: LLangAst, kb: KnowledgeBase): LLangAst | undefined {

    // console.log(ast)

    if (isAtom(ast)) return ast

    const unwrap = (v: LLangAst) => mapAsts(v, x => x.type === 'generalized' && x['parse'] ? x['parse'] : x)
    const wrap = (v: LLangAst) => mapAsts(v, x => $({ parse: x }).$, { top: false })

    const newAst = wrap(ast)
    const whenDcs = kb.derivClauses.filter(isWhenDerivationClause)

    const x = first(whenDcs, dc => {
        const m = match(dc.when, newAst, kb)
        if (!m) return undefined
        const m2 = mapValues(m, v => unwrap(v))
        const m3 = mapValues(m2, v => lin(v, kb) ?? v)
        const sub = subst(dc.conseq, m3)
        return sub
    })

    const result = x ? unwrap(x) : x
    return result
}

export function mapValues<K, W, V>(m: DeepMap<K, W>, f: (v: W) => V): DeepMap<K, V> {
    const entries = Array.from(m.entries())
    const newEntries = entries.map(e => [e[0], f(e[1])] as const)
    return deepMapOf(newEntries)
}

function unroll(ast: LLangAst): string {

    if (ast.type === 'list-literal') {
        return '(' + ast.value.flatMap(x => unroll(x)).reduce((a, b) => a + b + ' ', '') + ')'
        // return $(ast.value.flatMap(x => unroll(x))).$
    }

    if (ast.type === 'list-pattern') {
        return unroll(ast.seq) + ' ' + unroll(ast.value)
        // return $([unroll(ast.seq), ast.value]).$
    }

    if (isConst(ast)) return ast.value + ''

    // console.log(ast)
    // throw new Error('')
    return ' '

    // return ast
}
