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
    kb0: KnowledgeBase,
): {
    result: LLangAst,
    kb: KnowledgeBase,
} {

    switch (ast.type) {

        case 'boolean':
        case 'number':
        case 'entity':
            {
                const when = definitionOf(ast, kb0)
                if (when) return ask(when, kb0)

                const lastTime = Math.max(...Object.values(kb0.deicticDict).concat(0))
                const deicticDict = { ...kb0.deicticDict, [ast.value as string]: lastTime + 1 }
                return { result: ast, kb: { ...kb0, deicticDict, wm: addWorldModels(kb0.wm, [[ast.value, ast.type]]) } }
            }
        case 'list':
        case 'nothing':
            return { result: ast, kb: kb0 }
        case 'is-a-formula':

            const { rast: r, kb: kb1 } = evalArgs(ast, kb0)

            const t1 = r.subject
            const t2 = r.object

            if (!isAtom(t1) || !isAtom(t2)) return ask(decompress(r), kb1)

            if (t1.type === t2.value) return { result: $(true).$, kb: kb0 }

            if (t2.value === 'thing') return { result: $(true).$, kb: kb0 }

            if (!isConst(t1) || !isConst(t2)) return { result: $(false).$, kb: kb0 }

            const concepts = kb0.wm.filter(isIsASentence)
                .filter(s => s[0] === t1.value)
                .map(x => x[1])

            const uniqConcepts = uniq(concepts)

            if (uniqConcepts.includes(t2.value)) return { result: $(true).$, kb: kb0 }

            const ok = uniqConcepts.some(x => isTruthy(ask($(x).isa(t2.value).$, kb0).result))
            if (ok) return { result: $(true).$, kb: kb0 }

            const w = definitionOf(r, kb1)
            if (w) return ask(w, kb1)

            return { result: $(false).$, kb: kb0 }

        case 'has-formula':
            {

                const { rast, kb: kb3 } = evalArgs(ast, kb0)

                const when = definitionOf(rast, kb3)
                if (when) return ask(when, kb3)

                const s = rast.subject
                const o = rast.object
                const as = rast.as

                if (!isAtom(s) || !isAtom(o) || !isAtom(as)) return ask(decompress(rast), kb0)

                const ok = kb0.wm.filter(isHasSentence).some(hs => {
                    return s.value === hs[0]
                        && o.value === hs[1]
                        && match(as, $(hs[2]).$, kb0)
                })

                return { result: $(ok).$, kb: kb0 }
            }
        case 'negation':
            {
                const { kb, result } = ask(ast.f1, kb0)
                return { result: $(!isTruthy(result)).$, kb }
            }
        case 'conjunction':
            {
                if (pointsToThings(ast.f1) || pointsToThings(ast.f2)) return { result: ast, kb: kb0 }
                const { kb: kb1, result: f1 } = ask(ast.f1, kb0)
                if (!isTruthy(f1)) return { result: $(false).$, kb: kb1 }
                return ask(ast.f2, kb1)
            }
        case 'disjunction':
            {
                if (pointsToThings(ast.f1) || pointsToThings(ast.f2)) return { result: ast, kb: kb0 }
                const { kb: kb1, result: f1 } = ask(ast.f1, kb0)
                if (isTruthy(f1)) return { result: $(true).$, kb: kb1 }
                return ask(ast.f2, kb1)
            }
        case 'existquant':
            {
                const { result: thing } = ask(ast.value, kb0)
                return { result: $(thing.type !== 'nothing').$, kb: kb0 }
            }
        case 'variable':
            return ask($(ast).suchThat(true).$, kb0)
        case 'arbitrary-type':

            const maps = findAll(ast.description, [ast.head], kb0)
            const candidates = maps.map(x => x.get(ast.head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb0.deicticDict[c2.value as string] ?? 0) - (kb0.deicticDict[c1.value as string] ?? 0)
            )

            if (candidates.length === 1) {
                return ask(sortedCandidates[0], kb0)
            } else if (ast.number.value === 1 && candidates.length > 1) {
                return ask(sortedCandidates[0], kb0)
            } else if (ast.number.value === '*' && candidates.length > 1) {
                const andPhrase = candidates.map(x => $(x)).reduce((a, b) => a.and(b)).$
                return { result: andPhrase, kb: kb0 }
            } else {
                return { result: $('nothing').$, kb: kb0 }
            }
        case 'implicit-reference':
            {
                const { rast, kb: kb1 } = evalArgs(ast, kb0)
                const w = definitionOf(rast, kb1)

                if (w) return ask(w, kb1)
                return ask(removeImplicit(ast), kb0)
            }
        case 'if-else':
            {
                const { kb, result } = ask(ast.condition, kb0)
                if (isTruthy(result)) return ask(ast.then, kb)
                return ask(ast.otherwise, kb)
            }
        case 'math-expression':

            const { rast, kb } = evalArgs(ast, kb0)

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
                kb,
            )

        case 'generalized':
            {
                const { rast, kb: kb1 } = evalArgs(ast, kb0)
                const when = definitionOf(rast, kb1)
                if (when) return ask(when, kb1)
                return { result: $(false).$, kb: kb0 }
            }
        case "complement":
            {
                const { result: complementName, kb: kb1 } = ask(ast.complementName, kb0)
                const { result: complement, kb: kb2 } = ask(ast.complement, kb1)

                const rast = { ...ast, complement, complementName }
                const w = definitionOf(rast, kb2)
                if (w) return ask(w, kb2)

                return ask(removeImplicit(ast), kb2)
            }
        case 'cardinality':
            {
                return ask(removeImplicit(ast), kb0)
            }
        case 'which':
            {
                return ask(removeImplicit(ast), kb0)
            }

        case "command":
        case "question":
        case 'after-derivation-clause':
        case 'when-derivation-clause':
            throw new Error(``)
    }

}


