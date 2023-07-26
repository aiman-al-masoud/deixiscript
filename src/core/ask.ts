import { isConst, KnowledgeBase, isHasSentence, LLangAst, Atom, astsEqual, WmAtom, WorldModel, isIsASentence, addWorldModels, isLLangAst } from "./types.ts";
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
    kb: KnowledgeBase,
): {
    result: Atom,
    kb: KnowledgeBase,
} {

    const formula = removeImplicit(decompress(ast))

    switch (formula.type) {

        case 'boolean':
        case 'number':
        case 'entity':
        case 'string':

            const r1 = first(kb.derivClauses, dc => {

                const map = match(dc.conseq, formula)
                if (!map) return
                if (!('when' in dc)) return
                return subst(dc.when, map)
            })

            if (r1) return ask(r1, kb)

            const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
            const deicticDict = { ...kb.deicticDict, [formula.value as string]: lastTime + 1 }
            return { result: formula, kb: { ...kb, deicticDict } }
        case 'list-literal':
        case 'list-pattern':
            return { result: formula, kb }
        case 'implicit-reference':
            throw new Error('!!!!')
        case 'equality':
            const t10 = ask(formula.subject, kb).result
            const t20 = ask(formula.object, kb).result
            if (astsEqual(t10, t20)) return { result: $(true).$, kb }
            break
        case 'is-a-formula':
            const t1 = ask(formula.subject, kb).result
            const t2 = ask(formula.object, kb).result

            if (t1.type === t2.value) return { result: $(true).$, kb }

            if (
                isConst(t1) && isConst(t2)
                && getConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return { result: $(true).$, kb }
            break
        case 'has-formula':

            const t11 = ask(formula.subject, kb).result
            const t22 = ask(formula.object, kb).result
            const as = ask(formula.as, kb).result

            if (kb.wm.filter(isHasSentence).find(hs => {
                return t11.value === hs[0]
                    && t22.value === hs[1]
                    && (as.value === hs[2] || as.value === 'thing')
            })) return { result: $(true).$, kb }
            break
        case 'negation':
            if (!ask(formula.f1, kb).result.value) return { result: $(true).$, kb }
            break
        case 'conjunction':
            if (ask(formula.f1, kb).result.value && ask(formula.f2, kb).result.value) return { result: $(true).$, kb }
            break
        case 'disjunction':
            if (ask(formula.f1, kb).result.value || ask(formula.f2, kb).result.value) return { result: $(true).$, kb }
            break
        case 'existquant':
            const thing = ask(formula.value, kb).result
            if (thing.type !== 'nothing') return { result: $(true).$, kb }
            break
        case 'variable':
            return ask($(ast).suchThat(true).$, kb)
        case 'arbitrary-type':

            const maps = findAll(formula.description, [formula.head], kb)
            const candidates = maps.map(x => x.get(formula.head)).filter(isNotNullish)

            const sortedCandidates = sorted(
                candidates,
                (c1, c2) => (kb.deicticDict[c2.value as string] ?? 0) - (kb.deicticDict[c1.value as string] ?? 0)
            )

            const res = sortedCandidates.at(0)

            if (res) {
                return ask(res, kb)
            } else {
                return { result: $('nothing').$, kb }
            }

        case 'if-else':
            return ask(formula.condition, kb).result.value ? ask(formula.then, kb) : ask(formula.otherwise, kb)

        case 'after-derivation-clause':
        case 'when-derivation-clause':
            throw new Error(``)

        case 'math-expression':
            const left = ask(formula.left, kb).result.value
            const right = ask(formula.right, kb).result.value

            if (typeof left !== 'number' || typeof right !== 'number') return { result: $(false).$, kb }

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
                    ...kb,
                    wm: addWorldModels(kb.wm, [[result.value, result.type]]),
                }
            )

    }

    const entries = Object.entries(formula).filter(e => isLLangAst(e[1])).map(e => [e[0], ask(e[1], kb).result])
    const newObj = Object.fromEntries(entries)
    const formula2 = { ...formula, ...newObj }

    for (const dc of kb.derivClauses) {
        if (match(dc.conseq, formula) === undefined) continue
        const map = match(dc.conseq, formula2)
        if (!map) continue
        if (!('when' in dc)) continue
        const whenn = subst(dc.when, map)
        return ask(whenn, kb)
    }

    return { result: $(false).$, kb }

}

function getConceptsOf(x: WmAtom, cm: WorldModel): WmAtom[] {

    const r = cm.filter(s => s[0] === x && isIsASentence(s))
        .map(s => s[1])
        .flatMap(c => [c, ...getConceptsOf(c, cm)])
        .concat(['thing'])

    return uniq(r)
}
