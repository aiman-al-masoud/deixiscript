import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { Equality, LLangAst, Number } from "./types.ts";

/**
 * Interprets an Equality as a linear equation and solves it.
 * Returns the value of the variable.
 */
export function solve(ast: Equality): Number {

    if (findAsts(ast, 'variable').length > 1) {
        throw new Error('Cannot solve equation with more than one variable')
    }

    if (ast.subject.type === 'variable' && ast.object.type === 'number') {
        return ast.object
    }

    if (ast.subject.type === 'math-expression' && ast.object.type === 'number') {
        // k op X = c 
        // k + X = c  ---> X = c - k
        // k - X = c  ---> X = k - c
        // k * X = c  ---> X = c/k
        // k / X = c  ---> X = k/c

        // X op k = c 
        // X + k = c  ---> X = c - k
        // X - k = c  ---> X = c + k
        // X * k = c  ---> X = c/k
        // X / k = c  ---> X = c * k

        const c = ast.object.value
        const k = ast.subject.right.type === 'number' ? ast.subject.right.value : ast.subject.left.value as number
        const X = ast.subject.right.type !== 'number' ? ast.subject.right : ast.subject.left
        const op = ast.subject.operator as '+' | '-' | '*' | '/'
        const kIsLeft = k === ast.subject.left.value

        const newRhs = kIsLeft ? {
            '+': c - k,
            '-': k - c,
            '*': c / k,
            '/': k / c,
        }[op] : {
            '+': c - k,
            '-': k + c,
            '*': c / k,
            '/': k * c,
        }[op]

        return solve($(X).equals(newRhs).$)
    }

    if (ast.subject.type === 'math-expression' && ast.object.type === 'number') {
        return solve($(ast.object).equals(ast.subject).$)
    }

    throw new Error('Bad equation')
}


export function findEquations(ast: LLangAst): Equality[] {

    // console.log(findAsts(ast, 'equality'))

    const eqs = findAsts(ast, 'equality')
        .filter(x => x.subject.type === 'math-expression' || x.object.type === 'math-expression')

    // console.log(eqs)
    return eqs
}
