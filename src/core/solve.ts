import { assert } from "../utils/assert.ts";
import { evaluate } from "./evaluate.ts";
import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { KnowledgeBase, MathExpression, astsEqual } from "./types.ts";

/**
 * Interprets AST as linear equation and solves it.
 * Returns the value of the variable.
 */
export function solve(m: MathExpression, kb: KnowledgeBase) {

    assert(isEquation(m))
    const eq = leftAlignVar(m)
    if (eq.left.type === 'variable') return eq.right //return ask(eq.right, kb).result
    assert(eq.left.type === 'math-expression')

    const op = eq.left.operator
    assert(op.type === 'entity')

    const inverseOp = invert(op.value)
    assert(inverseOp)

    const newLhs = eq.left.left
    const newRhs = evaluate($(eq.right).mathOperation(eq.left.right, inverseOp).$, kb).result

    return solve($(newLhs).equals(newRhs).$, kb)
}

function leftAlignVar(m: MathExpression): MathExpression {
    const leftVars = findAsts(m.left, 'variable').length
    const rightVars = findAsts(m.right, 'variable').length

    assert(leftVars + rightVars === 1)

    if (rightVars) return { ...m, left: m.right, right: m.left }
    return m
}

function invert(op: string) {
    return {
        '+': '-',
        '-': '+',
        '*': '/',
        '/': '*',
    }[op]
}

function isEquation(m: MathExpression) {
    return astsEqual(m.operator, $('=').$)
}
