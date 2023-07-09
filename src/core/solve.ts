import { $ } from "./exp-builder.ts";
import { getAtoms } from "./getAtoms.ts";
import { Equality, LLangAst, Number, isVar } from "./types.ts";

/**
 * Interprets an Equality as a linear equation and solves it.
 * Returns the value of the variable.
 */
export function solve(ast: Equality): Number {

    if (getAtoms(ast).filter(isVar).length > 1) {
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
    switch (ast.type) {
        case "string":
        case "number":
        case "boolean":
        case "entity":
        case "variable":
        case "list-pattern":
        case "list-literal":
        case "is-a-formula":
        case "has-formula":
        case "happen-sentence":
            return []
        case "equality":
            if (ast.t1.type === 'math-expression' || ast.t2.type === 'math-expression') return [ast]
            return []
        case "conjunction":
        case "disjunction":
            return [...findEquations(ast.f1), ...findEquations(ast.f2)]
        case "negation":
            return findEquations(ast.f1)
        case "existquant":
            return findEquations(ast.where)
        case "derived-prop":
            return [...findEquations(ast.conseq), ...findEquations(ast.when)]
        case "if-else":
            return [...findEquations(ast.condition), ...findEquations(ast.otherwise), ...findEquations(ast.then)]
        case "math-expression":
            return []
        case "anaphor":
            return findEquations(ast.description)
        case "generalized":
    }

    // throw new Error('not implemented!')
    return []
}
