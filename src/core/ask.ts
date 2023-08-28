import { KnowledgeBase, isHasSentence, LLangAst, astsEqual, isIsASentence, addWorldModels, isAtom, isTruthy, pointsToThings, Number, WorldModel } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { $ } from "./exp-builder.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { sorted } from "../utils/sorted.ts";
import { uniq } from "../utils/uniq.ts";
import { match } from "./match.ts";
import { assert } from "../utils/assert.ts";
import { evaluate } from "./evaluate.ts";
import { hash } from "../utils/hash.ts";


export function ask(
    ast: LLangAst,
    kb: KnowledgeBase,
): {
    result: LLangAst,
    kb: KnowledgeBase,
} {

    switch (ast.type) {

        case 'boolean':
        case 'number':
        case 'entity':
        case 'list':
        case 'nothing':
            {
                const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
                const deicticDict = { ...kb.deicticDict, [hash(ast.value)]: lastTime + 1 }
                const deltaWm: WorldModel = ast.type === 'number' ? [[ast.value, ast.type]] : []
                return { result: ast, kb: { ...kb, deicticDict, wm: addWorldModels(kb.wm, deltaWm) } }
            }
        case 'is-a-formula':
            {
                const t1 = ast.subject
                const t2 = ast.object

                assert(isAtom(t2))

                if (t1.type === t2.value) return { result: $(true).$, kb: kb }
                if (t2.value === 'thing') return { result: $(true).$, kb: kb }

                assert(isAtom(t1), JSON.stringify(t1) + '-----' + JSON.stringify(t2))

                const concepts = kb.wm
                    .filter(isIsASentence)
                    .filter(s => s[0] === t1.value)
                    .map(x => x[1])

                const uniqConcepts = uniq(concepts)

                if (uniqConcepts.includes(t2.value as string)) return { result: $(true).$, kb: kb }

                const ok = uniqConcepts.some(x => isTruthy(evaluate($(x).isa(t2).$, kb).result))

                return { result: $(ok).$, kb: kb }
            }
        case 'has-formula':
            {
                const s = ast.subject
                const o = ast.object
                const as = ast.as

                assert(isAtom(s) && isAtom(o) && isAtom(as))

                const ok = kb.wm.filter(isHasSentence).some(hs => {
                    return s.value === hs[0]
                        && o.value === hs[1]
                        && match(as, $(hs[2]).$, kb)
                })

                return { result: $(ok).$, kb: kb }
            }
        case 'negation':
            {
                const { kb: kb1, result } = evaluate(ast.f1, kb)
                return { result: $(!isTruthy(result)).$, kb: kb1 }
            }
        case 'conjunction':
            {
                if (pointsToThings(ast)) return { result: ast, kb: kb }
                const { kb: kb1, result: f1 } = evaluate(ast.f1, kb)
                if (!isTruthy(f1)) return { result: $(false).$, kb: kb1 }
                return evaluate(ast.f2, kb1)
            }
        case 'disjunction':
            {
                if (pointsToThings(ast)) return { result: ast, kb: kb }
                const { kb: kb1, result: f1 } = evaluate(ast.f1, kb)
                if (isTruthy(f1)) return { result: $(true).$, kb: kb1 }
                return evaluate(ast.f2, kb1)
            }
        case 'existquant':
            {
                const { result: thing } = evaluate(ast.value, kb)
                return { result: $(thing.type !== 'nothing').$, kb: kb }
            }
        case 'arbitrary-type':

            const head = ast.head
            if (head.type !== 'variable') return { result: head, kb }

            const maps = findAll(ast.description, [head], kb)
            const candidates = maps.map(x => x.get(head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb.deicticDict[hash(c2.value)] ?? 0) - (kb.deicticDict[hash(c1.value)] ?? 0)
            )

            const { result: n } = evaluate(ast.cardinality, kb)
            assert(n.type === 'number')
            const slice = sortedCandidates.slice(0, n.value).map($)
            const res = slice.slice(1).reduce((a, b) => a.and(b), slice[0] ?? $('nothing')).$
            return evaluate(res, kb)

        case 'if-else':
            {
                const { kb: kb1, result } = evaluate(ast.condition, kb)
                if (isTruthy(result)) return evaluate(ast.then, kb1)
                return evaluate(ast.otherwise, kb1)
            }
        case 'math-expression':
            {
                const op = ast.operator
                assert(op.type === 'entity')

                const left = evaluate(ast.left, kb).result as Number
                const right = evaluate(ast.right, kb).result as Number

                const result = {
                    '+': $(left.value + right.value).$,
                    '-': $(left.value - right.value).$,
                    '*': $(left.value * right.value).$,
                    '/': $(left.value / right.value).$,
                    '>': $(left.value > right.value).$,
                    '<': $(left.value < right.value).$,
                    '<=': $(left.value <= right.value).$,
                    '>=': $(left.value >= right.value).$,
                    '=': $(astsEqual(left, right)).$
                }[op.value]

                return evaluate(
                    result ?? $('nothing').$,
                    kb,
                )
            }

        case 'variable': // return evaluate($(ast).suchThat(true).$, kb)
        case 'generalized':
        case 'implicit-reference':
        case "complement":
        case 'which':
        case "command":
        case 'after-derivation-clause':
        case 'when-derivation-clause':
            // throw new Error(``)
            return { result: $(false).$, kb: kb }

    }

}


