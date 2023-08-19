import { LLangAst, Constant, KnowledgeBase, Variable, astsEqual, isTruthy } from "./types.ts";
import { definitionOf } from "./definitionOf.ts";
import { subst } from "./subst.ts";
import { uniq } from "../utils/uniq.ts";
import { cartesian } from "../utils/cartesian.ts";
import { DeepMap, deepMapOf } from "../utils/DeepMap.ts";
import { $ } from './exp-builder.ts'
import { findAsts } from "./findAsts.ts";
import { solve } from "./solve.ts";
import { zip } from "../utils/zip.ts";
import { evaluate } from "./evaluate.ts";

export function findAll(
    ast: LLangAst,
    variables: Variable[],
    kb: KnowledgeBase,
    partialResults?: DeepMap<Variable, Constant>[],
): DeepMap<Variable, Constant>[] {

    const realAst = definitionOf(ast, kb) ?? ast

    switch (realAst.type) {

        case 'conjunction':

            // numbers shouldn't constrain second conjunct
            if (realAst.f1.type === 'is-a-formula' && astsEqual(realAst.f1.object, $('number').$)) {
                const vars = findAsts(realAst.f2, 'variable')
                return findAll(realAst.f2, vars, kb)
            }

            const vars1 = uniq(findAsts(realAst.f1, 'variable'))
            const firstChoices = findAll(realAst.f1, vars1, kb, partialResults)
            const missingVars = uniq(getMissingVars(variables, firstChoices))
            const secondChoices = getSecondChoices(realAst.f2, missingVars, kb, firstChoices)
            const result = combineChoices(firstChoices, secondChoices)
            return result
        case "existquant":
            return findAll(realAst.value, variables, kb, partialResults)
        case "negation":
            return getCombos(variables, uniq(kb.wm.flatMap(x => x).map(c => $(c).$)), kb, realAst)
        case "disjunction":
            const first = findAll(realAst.f1, variables, kb, partialResults)
            const second = findAll(realAst.f2, variables, kb, partialResults)
            const combos = first.flatMap(m1 => second.flatMap(m2 => [deepMapOf([...m1, ...m2]), deepMapOf([...m2, ...m1])]))
            const res = uniq(combos)
            return res
        case "implicit-reference":
        case "question":
        case "command":
        case "when-derivation-clause":
        case "after-derivation-clause":
        case "if-else":
        case 'cardinality':
        case 'which':
        case "complement":
            throw new Error(``)
        case "arbitrary-type":
            {
                const vars = uniq([...variables, realAst.head])
                return findAll($(realAst.head).and(realAst.description).$, vars, kb, partialResults)
            }
        case "generalized":
            return [] // if no derivation clause = no matches!    
        case 'math-expression':
            try {
                const v = variables[0]
                const n = solve(realAst, kb)
                if (n.type !== 'number') throw new Error(``)
                return [deepMapOf([[v, n]])]
            } catch { /**/ }
        // fallthrough
        case "boolean":
        case "entity":
        case "nothing":
        case "variable":
        case "number":
        case "list":
        case 'is-a-formula':
        case 'has-formula':
            const results = getCombos(variables, uniq(kb.wm.flatMap(x => x).map(c => $(c).$)), kb, realAst)
            return results
    }

}

function getCombos(
    vars: Variable[],
    consts: Constant[],
    kb: KnowledgeBase,
    ast: LLangAst,
): DeepMap<Variable, Constant>[] {

    if (vars.length === 0) {
        const isTrue = isTruthy(evaluate(ast, kb).result)
        return isTrue ? [deepMapOf()] : []
    }

    const varToCands = vars.map(v => {

        const candidates = consts.filter(c => isTruthy(evaluate($(c.value).isa(v.varType).$, kb).result))
        return candidates.map(c => [v, c] as const)
    })

    const allCombos = cartesian(...varToCands ?? []).map(x => deepMapOf(x))

    const results = allCombos.filter(c => {
        const sub = subst(ast, c)
        const isTrue = isTruthy(evaluate(sub, kb).result)
        return isTrue
    })

    return results
}

function getMissingVars(variables: Variable[], partRes: DeepMap<Variable, Constant>[]) {
    const foundVars = Array.from(partRes[0]?.keys() ?? [])
    const unfoundVars = variables.filter(v => !foundVars.some(w => astsEqual(w, v)))
    return unfoundVars
}

function getSecondChoices(ast: LLangAst, vars: Variable[], kb: KnowledgeBase, firstChoices: DeepMap<Variable, Constant>[]) {
    const result = firstChoices.map(m1 => findAll(subst(ast, m1), vars, kb, firstChoices))
    return result
}

function combineChoices(
    firstChoices: DeepMap<Variable, Constant>[],
    secondChoices: DeepMap<Variable, Constant>[][],
) {
    const zipped = zip(firstChoices, secondChoices)
    const result = zipped.flatMap(e => e[1].map(m2 => deepMapOf([...e[0], ...m2])))
    return result
}

