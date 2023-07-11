import { LLangAst, atomsEqual, TermMap, Term, isLLangAst } from "./types.ts";


export function substAll<T extends LLangAst>(formula: T, map: TermMap): T

export function substAll(formula: LLangAst, map: TermMap): LLangAst {
    const subs = Array.from(map.entries())
    return subs.reduce((f, s) => subst(f, s[0], s[1]), formula)
}

function subst<T extends LLangAst>(formula: T, oldTerm: Term, replacement: LLangAst): T

function subst(
    ast: LLangAst,
    oldTerm: Term,
    replacement: LLangAst,
): LLangAst {

    switch (ast.type) {
        case 'equality':
            return {
                type: 'equality',
                t1: subst(ast.t1, oldTerm, replacement),
                t2: subst(ast.t2, oldTerm, replacement),
            }
        case 'conjunction':
            return {
                type: 'conjunction',
                f1: subst(ast.f1, oldTerm, replacement),
                f2: subst(ast.f2, oldTerm, replacement),
            }
        case 'disjunction':
            return {
                type: 'disjunction',
                f1: subst(ast.f1, oldTerm, replacement),
                f2: subst(ast.f2, oldTerm, replacement),
            }
        case 'negation':
            return {
                type: 'negation',
                f1: subst(ast.f1, oldTerm, replacement),
            }
        case 'existquant':
            if (atomsEqual(ast.variable, oldTerm)) {
                return ast
            } else {
                return {
                    type: 'existquant',
                    variable: ast.variable,
                    where: subst(ast.where, oldTerm, replacement),
                }
            }
        case 'is-a-formula':
            return {
                type: 'is-a-formula',
                t1: subst(ast.t1, oldTerm, replacement),
                t2: subst(ast.t2, oldTerm, replacement),
                after: subst(ast.after, oldTerm, replacement),
            }
        case 'has-formula':
            return {
                type: 'has-formula',
                t1: subst(ast.t1, oldTerm, replacement),
                t2: subst(ast.t2, oldTerm, replacement),
                as: subst(ast.as, oldTerm, replacement),
                after: subst(ast.after, oldTerm, replacement),
            }
        case 'if-else':
            return {
                type: 'if-else',
                condition: subst(ast.condition, oldTerm, replacement),
                then: subst(ast.then, oldTerm, replacement),
                otherwise: subst(ast.otherwise, oldTerm, replacement),
            }
        case 'list-literal':
            return {
                type: 'list-literal',
                value: ast.value.map(e => subst(e, oldTerm, replacement)),
            }
        case 'list-pattern':
            if (!atomsEqual(oldTerm, ast)) return ast

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
            return atomsEqual(ast, oldTerm) ? replacement : ast
        case 'derived-prop':
            throw new Error('not implemented!')
        case 'generalized':
            const newEntries = Object.entries(ast).filter(e => isLLangAst(e[1])).map(e => [e[0], subst(e[1] as LLangAst, oldTerm, replacement)] as const)

            return {
                ...ast,
                ...Object.fromEntries(newEntries),
            }
        case 'anaphor':
            throw new Error('anaphor subst not implemented!')
        case 'math-expression':
            return {
                type: 'math-expression',
                left: subst(ast.left, oldTerm, replacement),
                right: subst(ast.right, oldTerm, replacement),
                operator: ast.operator,
            }
        case 'happen-sentence':
            throw new Error('not implemented!')
        case 'command':
        case 'question':
            throw new Error('not implemented!')
        case 'anything':
            // throw new Error('not implemented!')
            return ast
    }

}

