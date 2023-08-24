import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { LLangAst, pointsToThings } from "./types.ts";

export function decompress<T extends LLangAst>(ast: T): T
export function decompress(ast: LLangAst): LLangAst {

    const logiConn = findAsts(ast, 'conjunction').at(0) ?? findAsts(ast, 'disjunction').at(0)

    if (logiConn && pointsToThings(logiConn)) {
        const f1 = subst(ast, [logiConn, logiConn.f1])
        const f2 = subst(ast, [logiConn, logiConn.f2])
        return {
            type: ast.type === 'negation' ? opposite(logiConn.type) : logiConn.type, // de morgan
            f1: decompress(f1),
            f2: decompress(f2),
        }
    }

    return ast

}

function opposite(type: 'conjunction' | 'disjunction'): 'conjunction' | 'disjunction' {
    return type === 'conjunction' ? 'disjunction' : 'conjunction'
}