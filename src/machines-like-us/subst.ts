import { LLangAst, Atom, atomsEqual, isVar, Variable, VarMap } from "./types.ts";


export function substAll<T extends LLangAst>(formula: T, map: VarMap): T

export function substAll(formula: LLangAst, map: VarMap): LLangAst {
    const subs = Array.from(map.entries())
    return subs.reduce((f, s) => subst(f, s[0], s[1]), formula)
}

function subst<T extends LLangAst>(formula: T, variable: Variable, replacement: Atom): T

function subst(
    ast: LLangAst,
    variable: Variable,
    replacement: Atom,
): LLangAst {

    if (!isVar(variable)) {//TODO: remove
        throw new Error('subst() got a non-var as a variable!')
    }

    switch (ast.type) {
        case 'equality':
            return {
                type: 'equality',
                t1: subst(ast.t1, variable, replacement),
                t2: subst(ast.t2, variable, replacement),
            }
        case 'conjunction':
            return {
                type: 'conjunction',
                f1: subst(ast.f1, variable, replacement),
                f2: subst(ast.f2, variable, replacement),
            }
        case 'disjunction':
            return {
                type: 'disjunction',
                f1: subst(ast.f1, variable, replacement),
                f2: subst(ast.f2, variable, replacement),
            }
        case 'negation':
            return {
                type: 'negation',
                f1: subst(ast.f1, variable, replacement),
            }
        case 'existquant':
            if (atomsEqual(ast.variable, variable)) {
                return ast
            } else {
                return {
                    type: 'existquant',
                    variable: ast.variable,
                    where: subst(ast.where, variable, replacement),
                }
            }
        case 'is-a-formula':
            return {
                type: 'is-a-formula',
                t1: subst(ast.t1, variable, replacement),
                t2: subst(ast.t2, variable, replacement),
                after: subst(ast.after, variable, replacement),
            }
        case 'has-formula':
            return {
                type: 'has-formula',
                t1: subst(ast.t1, variable, replacement),
                t2: subst(ast.t2, variable, replacement),
                as: subst(ast.as, variable, replacement),
                after: subst(ast.after, variable, replacement),
            }
        case 'if-else':
            return {
                type: 'if-else',
                condition: subst(ast.condition, variable, replacement),
                then: subst(ast.then, variable, replacement),
                otherwise: subst(ast.otherwise, variable, replacement),
            }
        case 'list-literal':
            return {
                type: 'list-literal',
                list: ast.list.map(e => subst(e, variable, replacement)),
            }
        case 'list-pattern':
            throw new Error('not implemented!')
        case 'variable':
            return atomsEqual(ast, variable) ? replacement : ast
        case 'constant':
        case 'boolean':
            return ast
        case 'derived-prop':
            throw new Error('not implemented!')

    }

}