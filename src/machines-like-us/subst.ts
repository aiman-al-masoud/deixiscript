import { LLangAst, Atom, atomsEqual, Variable, VarMap, ListPattern, isVarish } from "./types.ts";


export function substAll<T extends LLangAst>(formula: T, map: VarMap): T

export function substAll(formula: LLangAst, map: VarMap): LLangAst {
    const subs = Array.from(map.entries())
    return subs.reduce((f, s) => subst(f, s[0], s[1]), formula)
}

function subst<T extends LLangAst>(formula: T, variable: Variable | ListPattern, replacement: Atom): T

function subst(
    ast: LLangAst,
    variable: Variable | ListPattern,
    replacement: Atom,
): LLangAst {

    if (!isVarish(variable)) {//TODO: remove
        throw new Error('subst() got a non-var and non-list-pattern as a varish!')
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
            if (replacement.type !== 'list-literal') return ast
            if (!atomsEqual(variable, ast)) return ast

            return {
                type: 'list-pattern',
                seq: { list: replacement.list.slice(0, -1), type: 'list-literal' },// as any,
                tail: replacement.list.at(-1)! //as any,
            }

        case 'variable':
            return atomsEqual(ast, variable) ? replacement : ast
        case 'constant':
        case 'boolean':
            return ast
        case 'derived-prop':
            throw new Error('not implemented!')

    }

}


// import { $ } from "./exp-builder.ts";
// import { deepMapOf } from "../utils/DeepMap.ts";
// const x = $('s:sequence|y:event').$
// const f = $('x:capra').isa('y').after('s:sequence|y:event').$
// const m: VarMap = deepMapOf([[x as any as Variable, $(['e1', 'e2']).$]])
// console.log(substAll(f, m))

