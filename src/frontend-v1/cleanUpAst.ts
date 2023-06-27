import { $ } from "../core/exp-builder.ts";
import { LLangAst, Atom, AtomicFormula } from "../core/types.ts";
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
            return ast as LLangAst
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
            return ast as LLangAst
        case 'anaphor':
            if (!ast.description) {
                return {
                    ...ast,
                    description: $(true).$,
                } as LLangAst
            }
            return ast as LLangAst
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
        case 'conjunction':
        case 'disjunction':
            return {
                ...ast,
                f1: cleanUpAst(ast.f1!)!,
                f2: cleanUpAst(ast.f2!)!,
            } as LLangAst
        case 'if-else':
            return {
                ...ast,
                condition: cleanUpAst(ast.condition!)!,
                otherwise: cleanUpAst(ast.otherwise!)!,
                then: cleanUpAst(ast.then!)!,
            } as LLangAst
        case 'variable':
        case 'entity':
        case 'happen-sentence':
        case 'list-pattern':
            return ast as LLangAst
        case 'existquant':
            return {
                ...ast,
                where: cleanUpAst(ast.where!)!
            } as LLangAst
        case 'equality':
            return {
                ...ast,
                t1: cleanUpAst(ast.t1!) as Atom,
                t2: cleanUpAst(ast.t2!) as Atom,
            } as LLangAst
        case 'derived-prop':
            return {
                ...ast,
                conseq: cleanUpAst(ast.conseq!) as AtomicFormula,
                when: cleanUpAst(ast.when!),
            } as LLangAst
        case 'negation':
            return {
                ...ast,
                f1: cleanUpAst(ast.f1!)!
            } as LLangAst
        case 'list-literal':
            return ast as LLangAst
    }

    return ast as LLangAst
}