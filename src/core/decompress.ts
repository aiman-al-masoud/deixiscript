import { $ } from "./exp-builder.ts";
import { getAnaphora } from "./getAnaphora.ts";
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
            return ast
        case 'is-a-formula':

            if (ast.t1.type === 'conjunction') {
                const t1f1 = decompress(ast.t1.f1, kb)
                const t2 = decompress(ast.t2, kb)
                const t1f2 = decompress(ast.t1.f2, kb)
                return decompress($(t1f1).isa(t2).and($(t1f2).isa(t2)).$, kb)
            }

            if (ast.t2.type === 'conjunction') {
                const t1 = decompress(ast.t1, kb)
                const t2f1 = decompress(ast.t2.f1, kb)
                const t2f2 = decompress(ast.t2.f2, kb)
                return decompress($(t1).isa(t2f1).and($(t1).isa(t2f2)).$, kb)
            }

            if (ast.t1.type === 'disjunction') {
                const t1f1 = decompress(ast.t1.f1, kb)
                const t2 = decompress(ast.t2, kb)
                const t1f2 = decompress(ast.t1.f2, kb)
                return decompress($(t1f1).isa(t2).or($(t1f2).isa(t2)).$, kb)
            }

            if (ast.t2.type === 'disjunction') {
                const t1 = decompress(ast.t1, kb)
                const t2f1 = decompress(ast.t2.f1, kb)
                const t2f2 = decompress(ast.t2.f2, kb)
                return decompress($(t1).isa(t2f1).or($(t1).isa(t2f2)).$, kb)
            }

            if (ast.t1.type === 'anaphor') {
                const t1 = decompress(ast.t1, kb)
                const t2 = ast.t2
                return decompress($(t1).isa(t2).$, kb)
            }

            if (ast.t2.type === 'anaphor') {
                const t1 = ast.t1
                const t2 = decompress(ast.t2, kb)
                return decompress($(t1).isa(t2).$, kb)
            }

            return ast

        case 'has-formula':

            if (ast.t1.type === 'conjunction') {
                return decompress($(ast.t1.f1).has(ast.t2).as(ast.as).and($(ast.t1.f2).has(ast.t2).as(ast.as)).$, kb)
            }


            if (ast.t1.type === 'anaphor') {
                const t1 = decompress(ast.t1, kb)
                const t2 = ast.t2
                const as = ast.as
                const after = ast.after
                return decompress($(t1).has(t2).as(as).after(after).$, kb)
            }

            if (ast.t2.type === 'anaphor') {
                const t1 = ast.t1
                const t2 = decompress(ast.t2, kb)
                const as = ast.as
                const after = ast.after
                return decompress($(t1).has(t2).as(as).after(after).$, kb)
            }

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
            const referents = getAnaphora(ast, kb)

            if (referents.length > 1) {
                return referents.reduce((a, b) => a.and(b), $(referents[0])).$
            }

            return referents[0]

    }

    throw new Error('not implemented: ' + ast.type)
}

