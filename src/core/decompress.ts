import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { LLangAst, pointsToThings } from "./types.ts";

export function decompress<T extends LLangAst>(ast: T): T
export function decompress(ast: LLangAst): LLangAst {

    const logiConn = findAsts(ast, 'conjunction').at(0) ?? findAsts(ast, 'disjunction').at(0)

    if (logiConn && pointsToThings(logiConn.f1) && pointsToThings(logiConn.f2)) {
        const withF1 = subst(ast, [logiConn, logiConn.f1])
        const withF2 = subst(ast, [logiConn, logiConn.f2])
        return {
            type: ast.type === 'negation' ? opposite(logiConn.type) : logiConn.type, // de morgan
            f1: decompress(withF1),
            f2: decompress(withF2),
        }
    }

    return ast

}

function opposite(type: 'conjunction' | 'disjunction'): 'conjunction' | 'disjunction' {
    return type === 'conjunction' ? 'disjunction' : 'conjunction'
}