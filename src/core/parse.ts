import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from "./exp-builder.ts";
import { match } from "./match.ts";
import { subst } from "./subst.ts";
import { LLangAst, KnowledgeBase, isLLangAst, definitionOf, WhenDerivationClause, ListLiteral } from "./types.ts";


export function parse(
    ast: LLangAst,
    kb: KnowledgeBase,
): LLangAst {

    const when = definitionOf(ast, kb)
    if (!when) return ast

    const entries = Object.entries(when)
        .filter((e): e is [string, LLangAst] => isLLangAst(e[1]))
        .map(e => [e[0], parse(e[1], kb)])

    const ast2 = { ...when, ...Object.fromEntries(entries) }
    return parse(ast2, kb)
}



//----------------------------------work in progress--------------------------------------------

export function lin(ast: LLangAst, kb: KnowledgeBase): LLangAst {

    const entries = Object
        .entries(ast)
        .filter((e): e is [string, LLangAst] => isLLangAst(e[1]))
        .map(e => [e[0], $({ parse: e[1] }).$] as const)

    const newAst = {
        ...ast,
        ...Object.fromEntries(entries),
    } as LLangAst


    const x = kb.derivClauses
        .filter((dc): dc is WhenDerivationClause => dc.type === 'when-derivation-clause')
        .map(dc => {
            const m = match(dc.when, newAst, kb)
            if (!m) return undefined
            const m2 = mapValues(m, v => lin(v, kb))
            const sub = subst(dc.conseq, m2)
            return sub
        })
        .filter(x => x)
        .at(0)

    if (!x) throw new Error(``)
    console.log(x)

    return $(1).$

    // const y = findAsts(x, 'list-literal')[0] as ListLiteral
    // console.log(y.value)

}

export function mapValues<K, V>(m: DeepMap<K, V>, f: (v: V) => V): DeepMap<K, V> {
    const entries = Array.from(m.entries())
    const newEntries = entries.map(e => [e[0], f(e[1])] as const)
    return deepMapOf(newEntries)
}
//---------------------------------------------------------------------

