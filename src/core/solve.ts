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

    if (ast.t1.type === 'variable' && ast.t2.type === 'number') {
        return ast.t2
    }

    if (ast.t1.type === 'math-expression' && ast.t2.type === 'number') {
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

        const c = ast.t2.value
        const k = ast.t1.right.type === 'number' ? ast.t1.right.value : ast.t1.left.value as number
        const X = ast.t1.right.type !== 'number' ? ast.t1.right : ast.t1.left
        const op = ast.t1.operator as '+' | '-' | '*' | '/'
        const kIsLeft = k === ast.t1.left.value

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

    if (ast.t1.type === 'math-expression' && ast.t2.type === 'number') {
        return solve($(ast.t2).equals(ast.t1).$)
    }

    throw new Error('Bad equation')
}


export function findEquations(ast: LLangAst): Equality[] {

    return findAsts(ast, 'equality')
        .filter(x => x.t1.type === 'math-expression' || x.t2.type === 'math-expression')
}
