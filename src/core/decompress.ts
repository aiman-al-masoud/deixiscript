import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { LLangAst } from "./types.ts";

export function decompress(ast: LLangAst): LLangAst {

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

            const conj = findAsts(ast, 'conjunction').at(0)

            if (conj) {
                const withF1 = subst(ast, [conj, conj.f1])
                const withF2 = subst(ast, [conj, conj.f2])
                return decompress($(withF1).and(withF2).$)
            }

            const disj = findAsts(ast, 'disjunction').at(0)

            if (disj) {
                const withF1 = subst(ast, [disj, disj.f1])
                const withF2 = subst(ast, [disj, disj.f2])
                return decompress($(withF1).or(withF2).$)
            }

            // const anaphor = findAst(ast, 'anaphor').at(0)

            // if (anaphor) {
            //     return decompress(subst(ast, [anaphor, decompress(anaphor)]))
            // }

            return ast

        case "equality":
            return ast
        case "conjunction":
            return $(decompress(ast.f1)).and(decompress(ast.f2)).$
        case "disjunction":
            return $(decompress(ast.f1)).or(decompress(ast.f2)).$
        case "negation":
            return $(decompress(ast.f1)).isNotTheCase.$
        case "existquant":
            if (ast.value.type === 'arbitrary-type') {
                return {
                    type: 'existquant',
                    value: $(ast.value.head).suchThat(decompress(ast.value.description)).$,
                }
            }
            return ast//TODO
        case "derived-prop":
            // return $(ast.conseq).when(decompress(ast.when)).$
            return ast //TODO
        case "if-else":
            return $(decompress(ast.then)).if(decompress(ast.condition)).else(decompress(ast.otherwise)).$
        case "math-expression":
            return ast
        case "anaphor":
            // const referents = getAnaphora(ast, kb)
            // if (referents.length > 1) {
            //     return referents.reduce((a, b) => a.and(b), $(referents[0])).$
            // }
            // return referents[0]
            return ast
        case 'arbitrary-type':
            return ast //TODO

    }

    throw new Error('not implemented: ' + ast.type)
}

