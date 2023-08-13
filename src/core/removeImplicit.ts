import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { ImplicitReference, LLangAst } from "./types.ts";
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
            return { description: removeImplicit(description), head, type: 'arbitrary-type', number: ast.number, /* isNew: ast.isNew */ }
        } else {
            return { description: $(head).isa(ast.headType).$, head, type: 'arbitrary-type', number: ast.number, /* isNew: ast.isNew */ }
        }

    } else if (ast.type==='which'){

        // console.log(ast)

        const v = { ...ast, ...ast.inner, which: ast.which } as LLangAst
        // @ts-ignore
        delete v['inner']

        return removeImplicit(v)

    } else if (ast.type === 'complement') {

        const phrase = removeImplicit(ast.phrase)
        if (phrase.type !== 'arbitrary-type') throw new Error(``)
        const description = $(phrase.description).and($(phrase.head).has(ast.complement).as(ast.complementName)).$
        const r = removeImplicit({ ...phrase, description })
        return r

    } else if (ast.type === 'cardinality') {
        // console.log('ast=', ast)

        const v = { ...ast, ...ast.value, number: ast.number } as LLangAst
        //@ts-ignore
        delete v['value']

        // console.log('v=', v)
        return removeImplicit(v)

    } else {
        const anaphors = findAsts(ast, 'implicit-reference')
        const subs = anaphors.map(x => [x, removeImplicit(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, deepMapOf(subs))
        return result
    }

}
