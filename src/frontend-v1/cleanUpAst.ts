import { $ } from "../core/exp-builder.ts";
import { LLangAst, Atom, AtomicFormula, Formula } from "../core/types.ts";
import { parseNumber } from "../utils/parseNumber.ts";

// WILL (hopefully) be rendered USELESS by new additions 
// to parser (numbers,bools and defaults)

/**
 * Some ASTs have optional fields.
 * It's easier to insert the default (neutral) filler here than to make those
 * fields optionally undefined.
 * 
 * Also because some values out of the parser need to be converted to number/bool
 */
export function cleanUpAst(ast: Partial<LLangAst>): LLangAst {

    switch (ast.type) {
        case 'is-a-formula':
            return {
                type: 'is-a-formula',
                t1: cleanUpAst(ast.t1!) as Atom,
                t2: cleanUpAst(ast.t2!) as Atom,
                after: ast.after ? cleanUpAst(ast.after!) as Atom : $([]).$,
            }
        case 'has-formula':
            return {
                type: 'has-formula',
                t1: cleanUpAst(ast.t1!) as Atom,
                t2: cleanUpAst(ast.t2!) as Atom,
                as: cleanUpAst(ast.as!) as Atom,
                after: ast.after ? cleanUpAst(ast.after!) as Atom : $([]).$,
            }
        case 'generalized':
            const keyEntries = Object.entries(ast.keys!)
            const goodKeys = keyEntries.filter(e => e[0] !== 'type')
            const keys = Object.fromEntries(goodKeys)

            return {
                type: 'generalized',
                after: ast.after ? cleanUpAst(ast.after) as Atom : $([]).$,
                keys,
            }
        case 'anaphor':
            return {
                type: 'anaphor',
                head: ast.head!,
                description: ast.description ? cleanUpAst(ast.description) : $(true).$,
            }
        case 'number':
            return {
                type: 'number',
                //@ts-ignore
                value: parseNumber(ast.value)
            } as LLangAst

        case 'boolean':
            return {
                type: 'boolean',
                //@ts-ignore
                value: ast.value === 'true'
            }
        case 'math-expression':
            return {
                type: 'math-expression',
                left: cleanUpAst(ast.left!) as Atom,
                right: cleanUpAst(ast.right!) as Atom,
                operator: ast.operator!
            }
        case 'conjunction':
        case 'disjunction':
            return {
                ...ast,
                f1: cleanUpAst(ast.f1!)!,
                f2: cleanUpAst(ast.f2!)!,
            } as LLangAst
        case 'if-else':
            return {
                type: 'if-else',
                condition: cleanUpAst(ast.condition!)!,
                otherwise: cleanUpAst(ast.otherwise!)!,
                then: cleanUpAst(ast.then!) as Formula,
            }
        case 'variable':
        case 'entity':
        case 'happen-sentence':
        case 'list-pattern':
            return ast as LLangAst
        case 'existquant':
            return {
                type: 'existquant',
                variable: ast.variable!,
                where: cleanUpAst(ast.where!)!
            }
        case 'equality':
            return {
                type: 'equality',
                t1: cleanUpAst(ast.t1!) as Atom,
                t2: cleanUpAst(ast.t2!) as Atom,
            }
        case 'derived-prop':
            return {
                type: 'derived-prop',
                conseq: cleanUpAst(ast.conseq!) as AtomicFormula,
                when: cleanUpAst(ast.when!),
            }
        case 'negation':
            return {
                type: 'negation',
                f1: cleanUpAst(ast.f1!) as Formula
            }
        case 'list-literal':
            return ast as LLangAst
    }

    return ast as LLangAst
}