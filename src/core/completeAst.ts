import { $ } from "./exp-builder.ts";
import { LLangAst } from "./types.ts";

/**
 * Some ASTs have optional fields.
 * It's easier to insert the default (neutral) filler here than to make those
 * fields optionally undefined.
 */
export function completeAst(ast: Partial<LLangAst>): LLangAst {
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
    }
    return ast as LLangAst
}