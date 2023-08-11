import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { KnowledgeBase, MathExpression, astsEqual } from "./types.ts";

/**
 * Interprets AST as linear equation and solves it.
 * Returns the value of the variable.
 */
export function solve(m: MathExpression, kb: KnowledgeBase) {

    if (!isEquation(m)) throw new Error(``)
    const eq = leftAlignVar(m)
    if (eq.left.type === 'variable') return eq.right //return ask(eq.right, kb).result
    if (eq.left.type !== 'math-expression') throw new Error(``)

    const op = eq.left.operator
    if (op.type !== 'entity') throw new Error(``)
    const inverseOp = invert(op.value)
    if (!inverseOp) throw new Error(``)

    const newLhs = eq.left.left
    const newRhs = ask($(eq.right).mathOperation(eq.left.right, inverseOp).$, kb).result

    return solve($(newLhs).equals(newRhs).$, kb)
}

function leftAlignVar(m: MathExpression): MathExpression {
    const leftHasVars = findAsts(m.left, 'variable').length
    const rightHasVars = findAsts(m.right, 'variable').length

    if (leftHasVars + rightHasVars > 1) throw new Error(``)

    if (rightHasVars) return { ...m, left: m.right, right: m.left }
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
