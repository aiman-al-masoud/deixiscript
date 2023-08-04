import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { first } from "../utils/first.ts";
import { parseNumber } from "../utils/parseNumber.ts";
import { $ } from "./exp-builder.ts";
import { mapAsts } from "./mapAsts.ts";
import { match } from "./match.ts";
import { subst } from "./subst.ts";
import { LLangAst, KnowledgeBase, definitionOf, isAtom, isConst, isWhenDerivationClause } from "./types.ts";


export function parse(
    ast: LLangAst,
    kb: KnowledgeBase,
): LLangAst {

    const when = definitionOf(ast, kb)
    if (!when) return ast

    const ast2 = mapAsts(when, x => parse(x, kb))
    return ast2
}


//----------------------------------work in progress--------------------------------------------

export function linearize(ast: LLangAst, kb: KnowledgeBase): string | undefined {
    const list = lin(ast, kb)
    if (!list) return undefined
    return unroll(list)
}

function lin(ast: LLangAst, kb: KnowledgeBase): LLangAst | undefined {

    if (isAtom(ast)) return ast

    const unwrap = (v: LLangAst) => mapAsts(v, x => x.type === 'generalized' && x['parse'] ? x['parse'] : x)
    const wrap = (v: LLangAst) => mapAsts(v, x => $({ parse: x }).$, false)

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
        return ast.value.flatMap(x => unroll(x)).reduce((a, b) => a + ' ' + b, '')
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


//---------------------------------------------------------------------

export function tokenize(code: string) {
    return code.replace(/\(|\)|\[|\]/g, x => ' ' + x + ' ')
        .split(/\s+/)
        .filter(x => x.length)
        .map(x => parseNumber(x) ?? x)
        .map(x => x === 'true' ? true : x === 'false' ? false : x)
}


