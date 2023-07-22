import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { LLangAst } from "./types.ts";

export function decompress<T extends LLangAst>(ast: T): T
export function decompress(ast: LLangAst): LLangAst {

    switch (ast.type) {

        case 'is-a-formula':
        case 'has-formula':

            const conj = findAsts(ast, 'conjunction').at(0)

            if (conj) { // and conj.f1 and conj.f2 are not formulae! maybe bug
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
            return $(decompress(ast.value)).exists.$
        case 'arbitrary-type':
            return $(decompress(ast.head)).suchThat(decompress(ast.description)).$
        case "derivation-clause":

            // const x :DerivationClause= {
            //     type : 'derivation-clause',
            //     when : ast.when,
            //     conseq : ast.conseq,
            // }
            // return x
            // console.log(JSON.stringify(x) === JSON.stringify(y))

            if (!('when' in ast)) return ast

            return $(decompress(ast.conseq)).when(decompress(ast.when)).$

        case "if-else":
            return $(decompress(ast.then)).if(decompress(ast.condition)).else(decompress(ast.otherwise)).$
        case "math-expression":
            return ast
        case 'implicit-reference':
        case 'nothing':
        case "command":
        case "question":
        case "generalized":
        case "string":
        case "number":
        case "boolean":
        case "entity":
        case "variable":
        case "list-pattern":
        case "list-literal":
            return ast

    }

}

