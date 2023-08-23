import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { ImplicitReference, LLangAst } from "./types.ts";
import { ArbitraryType } from "./types.ts"
import { deepMapOf } from "../utils/DeepMap.ts";
import { random } from "../utils/random.ts";


export function removeImplicit(ast: ImplicitReference): ArbitraryType
export function removeImplicit<T extends LLangAst>(ast: T): T
export function removeImplicit(
    ast: LLangAst,
): LLangAst {

    if (ast.type === 'implicit-reference') {

        const head = $(`x${random()}:thing`).$
        return $(head).suchThat($(head).isa(ast.headType), ast.number).$

    } else if (ast.type === 'which') {

        const inner = removeImplicit(ast.inner)
        if (inner.type !== 'arbitrary-type') return ast
        const description = $(inner.description).and(subst(ast.which, [$._.$, inner.head])).$
        const r = removeImplicit({ ...inner, description })
        return r

    } else if (ast.type === 'complement') {

        const phrase = removeImplicit(ast.phrase)
        
        if (phrase.type === 'generalized') return ast
        if (phrase.type !== 'arbitrary-type') throw new Error(``)

        const description = $(phrase.description).and($(phrase.head).has(ast.complement).as(ast.complementName)).$
        const r = removeImplicit({ ...phrase, description })
        return r

    } else {
        const anaphors = findAsts(ast, 'implicit-reference')
        const subs = anaphors.map(x => [x, removeImplicit(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, deepMapOf(subs))
        return result
    }

}
