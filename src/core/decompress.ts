import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { LLangAst, pointsToThings } from "./types.ts";

export function decompress<T extends LLangAst>(ast: T): T
export function decompress(ast: LLangAst): LLangAst {

    const conj = findAsts(ast, 'conjunction').at(0) ?? findAsts(ast, 'disjunction').at(0)

    if (conj && pointsToThings(conj.f1) && pointsToThings(conj.f2)) {
        const withF1 = subst(ast, [conj, conj.f1])
        const withF2 = subst(ast, [conj, conj.f2])
        return {
            type: conj.type,
            f1: decompress(withF1),
            f2: decompress(withF2),
        }
    }

    return ast

}