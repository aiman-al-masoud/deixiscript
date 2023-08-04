import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { ImplicitReference, LLangAst, astsEqual } from "./types.ts";
import { ArbitraryType } from "./types.ts"
import { deepMapOf } from "../utils/DeepMap.ts";
import { random } from "../utils/random.ts";


export function removeImplicit(ast: ImplicitReference): ArbitraryType
export function removeImplicit<T extends LLangAst>(ast: T): T
export function removeImplicit(
    ast: LLangAst,
): LLangAst {

    if (ast.type === 'implicit-reference') {

        const head = $(`x${random()}:thing`).$

        if (ast.which) {

            const description = $(head).isa(ast.headType).and(subst(ast.which, [$._.$, head])).$
            return { description: removeImplicit(description), head, type: 'arbitrary-type', number: ast.number, isNew: ast.isNew }

        } else if (ast.complement && ast.complementName) {

            if (astsEqual(ast.complementName, $('owner').$)) return removeImplicit($.the('thing').which($(ast.complement).has($._.$).as(ast.headType)).$)

            return removeImplicit($.the(ast.headType).which($._.has(ast.complement).as(ast.complementName)).$)

        } else {
            return { description: $(head).isa(ast.headType).$, head, type: 'arbitrary-type', number: ast.number, isNew: ast.isNew }
        }

    } else {
        const anaphors = findAsts(ast, 'implicit-reference')
        const subs = anaphors.map(x => [x, removeImplicit(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, deepMapOf(subs))
        return result
    }

}
