import { isConst, KnowledgeBase, isHasSentence, LLangAst, astsEqual, isIsASentence, addWorldModels, isAtom, isTruthy, pointsToThings, definitionOf, evalArgs, Number } from "./types.ts";
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
                const when = definitionOf(ast, kb)
                if (when) return ask(when, kb)

                const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
                const deicticDict = { ...kb.deicticDict, [ast.value as string]: lastTime + 1 }
                return { result: ast, kb: { ...kb, deicticDict, wm: addWorldModels(kb.wm, [[ast.value, ast.type]]) } }
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

            if (!isConst(t1) || !isConst(t2)) return { result: $(false).$, kb: kb }

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
                const { kb: kb1, result } = ask(ast.f1, kb)
                return { result: $(!isTruthy(result)).$, kb: kb1 }
            }
        case 'conjunction':
            {
                if (pointsToThings(ast.f1) || pointsToThings(ast.f2)) return { result: ast, kb: kb }
                const { kb: kb1, result: f1 } = ask(ast.f1, kb)
                if (!isTruthy(f1)) return { result: $(false).$, kb: kb1 }
                return ask(ast.f2, kb1)
            }
        case 'disjunction':
            {
                if (pointsToThings(ast.f1) || pointsToThings(ast.f2)) return { result: ast, kb: kb }
                const { kb: kb1, result: f1 } = ask(ast.f1, kb)
                if (isTruthy(f1)) return { result: $(true).$, kb: kb1 }
                return ask(ast.f2, kb1)
            }
        case 'existquant':
            {
                const { result: thing } = ask(ast.value, kb)
                return { result: $(thing.type !== 'nothing').$, kb: kb }
            }
        case 'variable':
            return ask($(ast).suchThat(true).$, kb)
        case 'arbitrary-type':

            const maps = findAll(ast.description, [ast.head], kb)
            const candidates = maps.map(x => x.get(ast.head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb.deicticDict[c2.value as string] ?? 0) - (kb.deicticDict[c1.value as string] ?? 0)
            )

            if (candidates.length === 1) {
                return ask(sortedCandidates[0], kb)
            } else if (ast.number.value === 1 && candidates.length > 1) {
                return ask(sortedCandidates[0], kb)
            } else if (ast.number.value === '*' && candidates.length > 1) {
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
                const { kb: kb1, result } = ask(ast.condition, kb)
                if (isTruthy(result)) return ask(ast.then, kb1)
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

                const { result: complementName, kb: kb1 } = ask(ast.complementName, kb)
                const { result: complement, kb: kb2 } = ask(ast.complement, kb1)

                const rast = { ...ast, complement, complementName }
                const w = definitionOf(rast, kb2)
                if (w) return ask(w, kb2)

                return ask(removeImplicit(ast), kb2)
            }
        case 'cardinality':
            {
                return ask(removeImplicit(ast), kb)
            }
        case 'which':
            {
                return ask(removeImplicit(ast), kb)
            }

        case "command":
        case "question":
        case 'after-derivation-clause':
        case 'when-derivation-clause':
            throw new Error(``)
    }

}


