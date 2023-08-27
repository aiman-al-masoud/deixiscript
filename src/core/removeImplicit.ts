import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { /* ImplicitReference, */ LLangAst, pointsToThings } from "./types.ts";
// import { ArbitraryType } from "./types.ts"
// import { random } from "../utils/random.ts";


// export function removeImplicit(ast: ImplicitReference): ArbitraryType
// export function removeImplicit<T extends LLangAst>(ast: T): T
export function removeImplicit(ast: LLangAst, i = 0): LLangAst { // problem: increments even if never used

    if (ast.type === 'implicit-reference') {

        const head = $(`x${/* random() */i}:thing`).$
        return $(head).suchThat($(head).isa(ast.headType), ast.number).$

    } else if (ast.type === 'which') {

        const inner = removeImplicit(ast.inner, i + 1)
        if (inner.type !== 'arbitrary-type') return ast
        const description = $(inner.description).and(subst(ast.which, [$._.$, inner.head])).$
        const r = removeImplicit({ ...inner, description }, i + 1)
        return r

    } else if (ast.type === 'complement') {

        if (!pointsToThings(ast)) return ast

        const phrase = removeImplicit(ast.phrase, i + 1)
        if (phrase.type !== 'arbitrary-type') return ast

        const description = $(phrase.description).and($(phrase.head).has(ast.complement).as(ast.complementName)).$
        const r = removeImplicit({ ...phrase, description }, i + 1)
        // console.log(r)
        return r

    } else {
        const anaphors = findAsts(ast, 'implicit-reference'/* , 'complement', 'which' */)
        const subs = anaphors.map(x => [x, removeImplicit(x, i + 1)] as [LLangAst, LLangAst])
        const result = subst(ast, deepMapOf(subs))
        return result
    }

}
