import { isConst, KnowledgeBase, isHasSentence, LLangAst, astsEqual, WmAtom, WorldModel, isIsASentence, addWorldModels, isLLangAst, isAtom, isTruthy, pointsToThings } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { subst } from "./subst.ts";
import { match } from "./match.ts";
import { $ } from "./exp-builder.ts";
import { decompress } from "./decompress.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { sorted } from "../utils/sorted.ts";
import { uniq } from "../utils/uniq.ts";
import { first } from "../utils/first.ts";


export function ask(
    ast: LLangAst,
    kb0: KnowledgeBase,
): {
    result: LLangAst,
    kb: KnowledgeBase,
} {

    const formula = removeImplicit(/* decompress(ast) */ ast)

    switch (formula.type) {

        case 'boolean':
        case 'number':
        case 'entity':
        case 'string':

            const r1 = findMatch(formula, kb0)
            if (r1) return ask(r1, kb0)

            const lastTime = Math.max(...Object.values(kb0.deicticDict).concat(0))
            const deicticDict = { ...kb0.deicticDict, [formula.value as string]: lastTime + 1 }
            return { result: formula, kb: { ...kb0, deicticDict } }
        case 'list-literal':
        case 'list-pattern':
        case 'nothing':
            return { result: formula, kb: kb0 }
        case 'equality':
            const t10 = ask(formula.subject, kb0).result
            const t20 = ask(formula.object, kb0).result
            return { result: $(astsEqual(t10, t20)).$, kb: kb0 }
        case 'is-a-formula':
            const t1 = ask(formula.subject, kb0).result
            const t2 = ask(formula.object, kb0).result

            if (!isAtom(t1) || !isAtom(t2)) return ask(decompress($(t1).isa(t2).$), kb0)

            if (t1.type === t2.value) return { result: $(true).$, kb: kb0 }

            if (!isConst(t1) || !isConst(t2)) throw new Error(``)

            const concepts = getConceptsOf(t1.value, kb0.wm)
            return { result: $(concepts.includes(t2.value)).$, kb: kb0 }
        case 'has-formula':

            const whennnnn = findMatch(formula, kb0)
            if (whennnnn) return ask(whennnnn, kb0)

            const t11 = ask(formula.subject, kb0).result
            const t22 = ask(formula.object, kb0).result
            const as = ask(formula.as, kb0).result

            if (!isAtom(t11) || !isAtom(t22) || !isAtom(as)) return ask(decompress($(t11).has(t22).as(as).$), kb0)

            const ok = kb0.wm.filter(isHasSentence).some(hs => {
                return t11.value === hs[0]
                    && t22.value === hs[1]
                    && (as.value === hs[2] || as.value === 'thing')
            })

            return { result: $(ok).$, kb: kb0 }
        case 'negation':
            {
                const { kb, result } = ask(formula.f1, kb0)
                return { result: $(!isTruthy(result)).$, kb }
            }
        case 'conjunction':
            {
                if (pointsToThings(formula.f1) || pointsToThings(formula.f2)) return { result: formula, kb: kb0 }
                const { kb: kb1, result: f1 } = ask(formula.f1, kb0)
                if (!isTruthy(f1)) return { result: $(false).$, kb: kb1 }
                return ask(formula.f2, kb1)
            }
        case 'disjunction':
            {
                if (pointsToThings(formula.f1) || pointsToThings(formula.f2)) return { result: formula, kb: kb0 }
                const { kb: kb1, result: f1 } = ask(formula.f1, kb0)
                if (isTruthy(f1)) return { result: $(true).$, kb: kb1 }
                return ask(formula.f2, kb1)
            }
        case 'existquant':
            const thing = ask(formula.value, kb0).result
            return { result: $(thing.type !== 'nothing').$, kb: kb0 }
        case 'variable':
            return ask($(ast).suchThat(true).$, kb0)
        case 'arbitrary-type':

            const wen = findMatch(formula, kb0)
            if (wen) return ask(wen, kb0)

            const maps = findAll(formula.description, [formula.head], kb0)
            const candidates = maps.map(x => x.get(formula.head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb0.deicticDict[c2.value as string] ?? 0) - (kb0.deicticDict[c1.value as string] ?? 0)
            )

            if (candidates.length === 1) {
                return ask(sortedCandidates[0], kb0)
            } else if (formula.number === 1 && candidates.length > 1) {
                return ask(sortedCandidates[0], kb0)
            } else if (formula.number === '*' && candidates.length > 1) {
                const andPhrase = candidates.map(x => $(x)).reduce((a, b) => a.and(b)).$
                return { result: andPhrase, kb: kb0 }
            } else {
                return { result: $('nothing').$, kb: kb0 }
            }

        case 'if-else':
            {
                const { kb, result } = ask(formula.condition, kb0)
                if (isTruthy(result)) return ask(formula.then, kb)
                return ask(formula.otherwise, kb)
            }
        case 'implicit-reference':
        case "command":
        case "question":
            throw new Error('!!!!')
        case 'after-derivation-clause':
        case 'when-derivation-clause':
            throw new Error(``)

        case 'math-expression':

            const leftSide = ask(formula.left, kb0).result
            const rightSide = ask(formula.right, kb0).result

            if (leftSide.type !== 'number' || rightSide.type !== 'number') return { result: $(false).$, kb: kb0 }

            const left = leftSide.value
            const right = rightSide.value

            const result = {
                '+': $(left + right).$,
                '-': $(left - right).$,
                '*': $(left * right).$,
                '/': $(left / right).$,
                '>': $(left > right).$,
                '<': $(left < right).$,
                '<=': $(left <= right).$,
                '>=': $(left >= right).$,
            }[formula.operator]

            return ask(
                result,
                {
                    ...kb0,
                    wm: addWorldModels(kb0.wm, [[result.value, result.type]]),
                }
            )
        case 'generalized':
            const entries = Object.entries(formula).filter((e): e is [string, LLangAst] => isLLangAst(e[1])).map(e => [e[0], ask(e[1], kb0).result])
            const newObj = Object.fromEntries(entries)
            const formula2 = { ...formula, ...newObj }
            const whenn = findMatch(formula2, kb0)
            if (whenn) {
                // console.log(whenn)
                if (formula2.returnMe) return { result: whenn, kb: kb0 }
                return ask(whenn, kb0)
            }
            return { result: $(false).$, kb: kb0 }
    }

}

function findMatch(ast: LLangAst, kb: KnowledgeBase) {

    return first(kb.derivClauses, dc => {
        if (!('when' in dc)) return

        if (isConst(ast)) {
            if (astsEqual(dc.conseq, ast)) {
                return dc.when
            } else {
                return undefined
            }
        }

        const map = match(dc.conseq, ast, kb)
        // console.log(ast)
        // console.log(dc.conseq)
        // console.log('-------------------')

        if (!map) return
        // console.log(map)

        return subst(dc.when, map)
    })
}

function getConceptsOf(x: WmAtom, cm: WorldModel): WmAtom[] {

    const r = cm.filter(s => s[0] === x && isIsASentence(s))
        .map(s => s[1])
        .flatMap(c => [c, ...getConceptsOf(c, cm)])
        .concat(['thing'])

    return uniq(r)
}

