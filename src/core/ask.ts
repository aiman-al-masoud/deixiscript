import { isConst, KnowledgeBase, isHasSentence, LLangAst, astsEqual, isIsASentence, addWorldModels, isAtom, isTruthy, pointsToThings, definitionOf, Number } from "./types.ts";
import { evalArgs } from "./evalArgs.ts";
import { findAll, } from "./findAll.ts";
import { $ } from "./exp-builder.ts";
import { decompress } from "./decompress.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { sorted } from "../utils/sorted.ts";
import { uniq } from "../utils/uniq.ts";
import { match } from "./match.ts";
import { assert } from "../utils/assert.ts";


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
            {
                const { rast } = evalArgs(ast, kb)
                const when = definitionOf(rast, kb)
                if (when) return ask(when, kb)
                const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
                const deicticDict = { ...kb.deicticDict, [rast.value as string]: lastTime + 1 }
                return { result: rast, kb: { ...kb, deicticDict, wm: addWorldModels(kb.wm, [[ast.value, ast.type]]) } }
            }
        case 'list':
        case 'nothing':
            return { result: ast, kb: kb }
        case 'is-a-formula':

            const { rast: r, kb: kb1 } = evalArgs(ast, kb)

            const t1 = r.subject
            const t2 = r.object

            if (!isAtom(t1) || !isAtom(t2)) return ask(decompress(r), kb1)

            if (t1.type === t2.value) return { result: $(true).$, kb: kb }

            if (t2.value === 'thing') return { result: $(true).$, kb: kb }

            if (!isConst(t1) || !isConst(t2)) return { result: $(false).$, kb: kb } // !!

            const concepts = kb.wm.filter(isIsASentence)
                .filter(s => s[0] === t1.value)
                .map(x => x[1])

            const uniqConcepts = uniq(concepts)

            if (uniqConcepts.includes(t2.value)) return { result: $(true).$, kb: kb }

            const ok = uniqConcepts.some(x => isTruthy(ask($(x).isa(t2.value).$, kb).result))
            if (ok) return { result: $(true).$, kb: kb }

            const w = definitionOf(r, kb1)
            if (w) return ask(w, kb1)

            return { result: $(false).$, kb: kb }

        case 'has-formula':
            {

                const { rast, kb: kb1 } = evalArgs(ast, kb)

                const when = definitionOf(rast, kb1)
                if (when) return ask(when, kb1)

                const s = rast.subject
                const o = rast.object
                const as = rast.as

                if (!isAtom(s) || !isAtom(o) || !isAtom(as)) return ask(decompress(rast), kb)

                const ok = kb.wm.filter(isHasSentence).some(hs => {
                    return s.value === hs[0]
                        && o.value === hs[1]
                        && match(as, $(hs[2]).$, kb)
                })

                return { result: $(ok).$, kb: kb }
            }
        case 'negation':
            {
                const { rast } = evalArgs(ast, kb)
                const { kb: kb1, result } = ask(rast.f1, kb)
                return { result: $(!isTruthy(result)).$, kb: kb1 }
            }
        case 'conjunction':
            {
                const { rast } = evalArgs(ast, kb)
                if (pointsToThings(rast.f1) || pointsToThings(rast.f2)) return { result: rast, kb: kb }
                const { kb: kb1, result: f1 } = ask(rast.f1, kb)
                if (!isTruthy(f1)) return { result: $(false).$, kb: kb1 }
                return ask(rast.f2, kb1)
            }
        case 'disjunction':
            {
                const { rast } = evalArgs(ast, kb)
                if (pointsToThings(rast.f1) || pointsToThings(rast.f2)) return { result: rast, kb: kb }
                const { kb: kb1, result: f1 } = ask(rast.f1, kb)
                if (isTruthy(f1)) return { result: $(true).$, kb: kb1 }
                return ask(rast.f2, kb1)
            }
        case 'existquant':
            {
                const { rast } = evalArgs(ast, kb)
                const { result: thing } = ask(rast.value, kb)
                return { result: $(thing.type !== 'nothing').$, kb: kb }
            }
        case 'variable':
            {
                const { rast } = evalArgs(ast, kb)
                return ask($(rast).suchThat(true).$, kb)
            }
        case 'arbitrary-type':

            const { rast } = evalArgs(ast, kb)

            const maps = findAll(rast.description, [rast.head], kb)
            const candidates = maps.map(x => x.get(rast.head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb.deicticDict[c2.value as string] ?? 0) - (kb.deicticDict[c1.value as string] ?? 0)
            )

            if (candidates.length === 1) {
                return ask(sortedCandidates[0], kb)
            } else if (rast.number.value === 1 && candidates.length > 1) {
                return ask(sortedCandidates[0], kb)
            } else if (rast.number.value === '*' && candidates.length > 1) {
                const andPhrase = candidates.map(x => $(x)).reduce((a, b) => a.and(b)).$
                return { result: andPhrase, kb: kb }
            } else {
                return { result: $('nothing').$, kb: kb }
            }
        case 'implicit-reference':
            {
                const { rast, kb: kb1 } = evalArgs(ast, kb)
                const w = definitionOf(rast, kb1)
                if (w) return ask(w, kb1)
                return ask(removeImplicit(ast), kb)
            }
        case 'if-else':
            {
                const { rast } = evalArgs(ast, kb)
                const { kb: kb1, result } = ask(rast.condition, kb)
                if (isTruthy(result)) return ask(rast.then, kb1)
                return ask(ast.otherwise, kb1)
            }
        case 'math-expression':
            {
                const { rast, kb: kb1 } = evalArgs(ast, kb)

                const op = rast.operator
                assert(op.type === 'entity')

                const left = rast.left as Number
                const right = rast.right as Number

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

                return ask(
                    result ?? $('nothing').$,
                    kb1,
                )
            }
        case 'generalized':
            {
                const { rast, kb: kb1 } = evalArgs(ast, kb)
                const when = definitionOf(rast, kb1)
                if (when) return ask(when, kb1)
                return { result: $(false).$, kb: kb }
            }
        case "complement":
            {
                const { rast, kb: kb2 } = evalArgs(ast, kb)
                const w = definitionOf(rast, kb2)
                if (w) return ask(w, kb2)
                return ask(removeImplicit(ast), kb2)
            }
        case 'cardinality':
            {
                const { rast } = evalArgs(ast, kb)
                return ask(removeImplicit(rast), kb)
            }
        case 'which':
            {
                const { rast } = evalArgs(ast, kb)
                return ask(removeImplicit(rast), kb)
            }

        case "command":
        case "question":
        case 'after-derivation-clause':
        case 'when-derivation-clause':
            throw new Error(``)
    }

}


