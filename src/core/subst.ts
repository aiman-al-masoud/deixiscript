import { LLangAst, AstMap, isLLangAst, astsEqual } from "./types.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";


export function subst<T extends LLangAst>(formula: T, map: AstMap): T
export function subst<T extends LLangAst>(formula: T, ...entries: [LLangAst, LLangAst][]): T

export function subst(formula: LLangAst, arg: unknown): LLangAst {

    if (arg instanceof DeepMap) {
        const subs = Array.from(arg.entries())
        return subs.reduce((f, s) => substOnce(f, s[0], s[1]), formula)
    } else if (arg instanceof Array) {
        return subst(formula, deepMapOf([arg] as [LLangAst, LLangAst][]))
    }

    throw new Error('illegal argument! ' + arg)
}

function substOnce<T extends LLangAst>(
    formula: T,
    oldTerm: LLangAst,
    replacement: LLangAst): T

function substOnce(
    ast: LLangAst,
    oldTerm: LLangAst,
    replacement: LLangAst,
): LLangAst {

    if (astsEqual(oldTerm, ast)) {   
        return replacement
    }

    switch (ast.type) {

        case 'equality':

            return {
                type: 'equality',
                subject: substOnce(ast.subject, oldTerm, replacement),
                object: substOnce(ast.object, oldTerm, replacement),
            }
        case 'conjunction':
            return {
                type: 'conjunction',
                f1: substOnce(ast.f1, oldTerm, replacement),
                f2: substOnce(ast.f2, oldTerm, replacement),
            }
        case 'disjunction':
            return {
                type: 'disjunction',
                f1: substOnce(ast.f1, oldTerm, replacement),
                f2: substOnce(ast.f2, oldTerm, replacement),
            }
        case 'negation':
            return {
                type: 'negation',
                f1: substOnce(ast.f1, oldTerm, replacement),
            }
        case 'existquant':

            return {
                type: 'existquant',
                value: substOnce(ast.value, oldTerm, replacement),
            }

        case 'arbitrary-type':

            if (astsEqual(ast.head, oldTerm)) {
                return ast
            } else {
                return {
                    type: 'arbitrary-type',
                    head: ast.head,
                    description: substOnce(ast.description, oldTerm, replacement),
                }
            }

        case 'is-a-formula':
            return {
                type: 'is-a-formula',
                subject: substOnce(ast.subject, oldTerm, replacement),
                object: substOnce(ast.object, oldTerm, replacement),
                after: substOnce(ast.after, oldTerm, replacement),
            }
        case 'has-formula':
            return {
                type: 'has-formula',
                subject: substOnce(ast.subject, oldTerm, replacement),
                object: substOnce(ast.object, oldTerm, replacement),
                as: substOnce(ast.as, oldTerm, replacement),
                after: substOnce(ast.after, oldTerm, replacement),
            }
        case 'if-else':
            return {
                type: 'if-else',
                condition: substOnce(ast.condition, oldTerm, replacement),
                then: substOnce(ast.then, oldTerm, replacement),
                otherwise: substOnce(ast.otherwise, oldTerm, replacement),
            }
        case 'list-literal':
            return {
                type: 'list-literal',
                value: ast.value.map(e => substOnce(e, oldTerm, replacement)),
            }
        case 'list-pattern':
            if (!astsEqual(oldTerm, ast)) return ast


            if (replacement.type === 'list-literal') return {
                type: 'list-pattern',
                seq: { value: replacement.value.slice(0, -1), type: 'list-literal' },
                value: replacement.value.at(-1)!
            }

            if (replacement.type === 'list-pattern') return replacement

            throw new Error('error!')

        case 'variable':
        case 'entity':
        case 'boolean':
        case 'number':
        case 'string':
            return astsEqual(ast, oldTerm) ? replacement : ast

        case 'derivation-clause':
            // throw new Error('not implemented!')
            return {
                type: 'derivation-clause',
                conseq: substOnce(ast.conseq, oldTerm, replacement),
                when: substOnce(ast.when, oldTerm, replacement),
            }
        case 'generalized':
            const newEntries = Object.entries(ast).filter(e => isLLangAst(e[1])).map(e => [e[0], substOnce(e[1] as LLangAst, oldTerm, replacement)] as const)

            return {
                ...ast,
                ...Object.fromEntries(newEntries),
            }
        case 'implicit-reference':
            return {
                type: 'implicit-reference',
                headType: ast.headType,
                number: ast.number,
                which: ast.which ? substOnce(ast.which, oldTerm, replacement) : ast.which,
                whose: ast.whose ? substOnce(ast.whose, oldTerm, replacement) : ast.whose,
                location: ast.location ? substOnce(ast.location, oldTerm, replacement) : ast.location,
            }
        case 'math-expression':
            return {
                type: 'math-expression',
                left: substOnce(ast.left, oldTerm, replacement),
                right: substOnce(ast.right, oldTerm, replacement),
                operator: ast.operator,
            }
        case 'happen-sentence':
            throw new Error('not implemented!')
        case 'command':
        case 'question':
            throw new Error('not implemented!')
        case 'anything':
            return ast
        case 'nothing':
            return ast

    }

}

