import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { Atom, Equality, KnowledgeBase, Number } from "./types.ts";


/**
 * Interprets an Equality as a linear equation and solves it.
 * Returns the value of the variable.
 */
export function solve(ast: Equality, kb: KnowledgeBase): Number | undefined {

    // check if is equation
    // check number of vars

    if (ast.subject.type === 'variable') {
        const result = ask(ast.object, kb).result
        if (result.type !== 'number') throw new Error(``)
        return result
    }

    if (ast.subject.type === 'math-expression' && ast.object.type !== 'math-expression') {

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

        const c = ask(ast.object, kb).result.value
        if (typeof c !== 'number') throw new Error(``)

        // const left = ast.subject.left.type!=='variable' ?  ask(ast.subject.left, kb).result :ast.subject.left
        // const right = ast.subject.right.type!=='variable'?  ask(ast.subject.right, kb).result : ast.subject.right

        // const k = left.type === 'number' ? left.value : right.value as number
        // const kIsLeft = k === left.value
        // const X = kIsLeft ? ast.subject.right : ast.subject.left
        // const op = ast.subject.operator as '+' | '-' | '*' | '/'

        // ---------------------------------
        // console.log(ast)
        // console.log('left=', left, 'right=', right, 'k=', k, 'kIsLeft=', kIsLeft, 'X=', X)
        // ---------------------------------

        const k = ast.subject.right.type === 'number' ? ast.subject.right.value : (ast.subject.left as Atom).value as number
        const X = ast.subject.right.type !== 'number' ? ast.subject.right : ast.subject.left
        const op = ast.subject.operator as '+' | '-' | '*' | '/'
        const kIsLeft = k === (ast.subject.left as Atom).value

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


        return solve($(X).equals(newRhs).$, kb)
    }

    if (ast.subject.type === 'math-expression' && ast.object.type !== 'math-expression') {
        return solve($(ast.object).equals(ast.subject).$, kb)
    }

    throw new Error('Bad equation')
}


