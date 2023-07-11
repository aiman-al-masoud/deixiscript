import { $ } from "./exp-builder.ts";
import { findAst } from "./findAst.ts";
import { subst } from "./subst.ts";
import { KnowledgeBase, LLangAst } from "./types.ts";

export function decompress(ast: LLangAst, kb: KnowledgeBase): LLangAst {

    switch (ast.type) {
        case "generalized":
        case "happen-sentence":
        case "string":
        case "number":
        case "boolean":
        case "entity":
        case "variable":
        case "list-pattern":
        case "list-literal":
        case 'anything':
            return ast
        case 'is-a-formula':
        case 'has-formula':

            // maybe will produce bug if deeply nested and? keep nesting down?

            const conj = findAst(ast, 'conjunction').at(0)

            if (conj) {
                const withF1 = subst(ast, [conj, conj.f1])
                const withF2 = subst(ast, [conj, conj.f2])
                return decompress($(withF1).and(withF2).$, kb)
            }

            const disj = findAst(ast, 'disjunction').at(0)

            if (disj) {
                const withF1 = subst(ast, [disj, disj.f1])
                const withF2 = subst(ast, [disj, disj.f2])
                return decompress($(withF1).or(withF2).$, kb)
            }

            // const anaphor = findAst(ast, 'anaphor').at(0)

            // if (anaphor) {
            //     return decompress(subst(ast, [anaphor, decompress(anaphor, kb)]), kb)
            // }

            return ast

        case "equality":
            return ast
        case "conjunction":
            return $(decompress(ast.f1, kb)).and(decompress(ast.f2, kb)).$
        case "disjunction":
            return $(decompress(ast.f1, kb)).or(decompress(ast.f2, kb)).$
        case "negation":
            return $(decompress(ast.f1, kb)).isNotTheCase.$
        case "existquant":
            return {
                type: 'existquant',
                variable: ast.variable,
                where: decompress(ast.where, kb),
            }
        case "derived-prop":
            return $(ast.conseq).when(decompress(ast.when, kb)).$
        case "if-else":
            return $(decompress(ast.then, kb)).if(decompress(ast.condition, kb)).else(decompress(ast.otherwise, kb)).$
        case "math-expression":
            return ast
        case "anaphor":
            // const referents = getAnaphora(ast, kb)
            // if (referents.length > 1) {
            //     return referents.reduce((a, b) => a.and(b), $(referents[0])).$
            // }
            // return referents[0]
            return ast

    }

    throw new Error('not implemented: ' + ast.type)
}

