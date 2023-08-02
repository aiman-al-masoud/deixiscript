import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { ImplicitReference, LLangAst, isLLangAst } from "./types.ts";
import { ArbitraryType } from "./types.ts"
import { deepMapOf } from "../utils/DeepMap.ts";


export function removeImplicit(ast: ImplicitReference): ArbitraryType
export function removeImplicit<T extends LLangAst>(ast: T): T
export function removeImplicit(
    ast: LLangAst,
): LLangAst {

    if (ast.type === 'implicit-reference') {

        const head = $(`x${10}:${ast.headType.value}`).$

        if (ast.whose) {

            const owned = $('y10:thing').$

            const description = $(owned).exists.where(
                $(owned).isa(ast.whose.subject)
                    .and($(head).has(owned))
                    .and(subst(ast.whose, [ast.whose.subject, owned])))
                .$

            return { description: removeImplicit(description), head, type: 'arbitrary-type', number: ast.number, isNew: ast.isNew }
        } else if (ast.which) {
            const description = subst(ast.which, [$._.$, head])
            return { description: removeImplicit(description), head, type: 'arbitrary-type', number: ast.number, isNew: ast.isNew }

        } else if (ast.owner) {
            return removeImplicit($.the('thing').which($(ast.owner).has($._.$).as(ast.headType)).$)
        } else {

            const complement = Object.entries({ ...ast, headType: undefined }).filter((e): e is [string, LLangAst] => isLLangAst(e[1])).at(0)

            if (complement) {
                return removeImplicit($.the(ast.headType).which($._.has(complement[1]).as(complement[0])).$)
            } else {
                return { description: $(true).$, head, type: 'arbitrary-type', number: ast.number, isNew: ast.isNew }
            }
        }

    } else {
        const anaphors = findAsts(ast, 'implicit-reference')
        const subs = anaphors.map(x => [x, removeImplicit(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, deepMapOf(subs))
        return result
    }

}
