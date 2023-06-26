import { $ } from "../core/exp-builder.ts";
import { LLangAst, Atom } from "../core/types.ts";
import { parseNumber } from "../utils/parseNumber.ts";

/**
 * Some ASTs have optional fields.
 * It's easier to insert the default (neutral) filler here than to make those
 * fields optionally undefined.
 * 
 * Also because some values out of the parser need to be converted to number/bool
 */
//TODO: complete!! fully recursive!
export function cleanUpAst(ast: Partial<LLangAst>): LLangAst {
    switch (ast.type) {
        case 'is-a-formula':
        case 'has-formula':
            if (!ast.after) {
                return {
                    ...ast,
                    after: $([]).$,
                } as LLangAst
            }
            break
        case 'generalized':
            const keyEntries = Object.entries(ast.keys!)
            const goodKeys = keyEntries.filter(e => e[0] !== 'type')
            const keys = Object.fromEntries(goodKeys)

            if (!ast.after) {
                return {
                    ...ast,
                    after: $([]).$,
                    keys,
                } as LLangAst
            }
            break
        case 'anaphor':
            if (!ast.description) {
                return {
                    ...ast,
                    description: $(true).$,
                } as LLangAst
            }
            break
        case 'number':
            return {
                ...ast,
                //@ts-ignore
                value: parseNumber(ast.value)
            } as LLangAst

        case 'boolean':
            return {
                ...ast,
                //@ts-ignore
                value: ast.value === 'true'
            }
        case 'math-expression':
            return {
                ...ast,
                left: cleanUpAst(ast.left!) as Atom,
                right: cleanUpAst(ast.right!) as Atom,
            } as LLangAst
    }
    return ast as LLangAst
}