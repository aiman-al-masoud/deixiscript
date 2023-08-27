import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { LLangAst, pointsToThings } from "./types.ts";
import { assert } from "../utils/assert.ts";


export function removeImplicit(ast: LLangAst, i = 0): LLangAst { // problem: increments even if never used

    switch (ast.type) {
        case 'implicit-reference':

            const head = $(`x${i}:thing`).$
            return $(head).suchThat($(head).isa(ast.headType), ast.number).$
        case 'which':
            {
                const inner = removeImplicit(ast.inner, i + 1)
                if (inner.type !== 'arbitrary-type') return { ...ast, inner }

                const description = $(inner.description).and(subst(ast.which, [$._.$, inner.head])).$
                const r = removeImplicit({ ...inner, description }, i + 1)
                return r
            }
        case 'complement':
            {
                // if (!pointsToThings(ast)) return ast

                const phrase = removeImplicit(ast.phrase, i + 1)
                if (phrase.type !== 'arbitrary-type') return { ...ast, phrase }

                const description = $(phrase.description).and($(phrase.head).has(ast.complement).as(ast.complementName)).$
                const r = removeImplicit({ ...phrase, description }, i + 1)
                return r
            }

        default:
            // const anaphors = findAsts(ast, 'implicit-reference')
            const anaphors = findAsts(ast, 'complement', 'which', 'implicit-reference')
            const subs = anaphors.map(x => [x, removeImplicit(x, i + 1)] as [LLangAst, LLangAst])
            const result = subst(ast, deepMapOf(subs))
            // if (findAsts(result, 'which', 'implicit-reference').length) console.log(anaphors)
            // assert(!findAsts(result, 'which', 'implicit-reference').length)
            return result

    }

}
