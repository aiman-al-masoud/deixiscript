import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { subst } from "./subst.ts";
import { ask } from "./ask.ts";
import { DerivationClause, HasSentence, IsASentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, addWorldModels, conceptsOf, consequencesOf, definitionOf, evalArgs, isAtom, isConst, isHasSentence, isIsASentence, isTruthy, isWmAtom, subtractWorldModels } from "./types.ts";
import { decompress } from "./decompress.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { random } from "../utils/random.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { compareSpecificities } from "./compareSpecificities.ts";
import { sorted } from "../utils/sorted.ts";
import { uniq } from "../utils/uniq.ts";
import { zip } from "../utils/zip.ts";


/**
 * Assumes the given AST is true, and compute resulting knowledge base.
 * Also provides WorldModel additions and elmininations (the "diff") 
 * to avoid having to recompute them.
 */
export function tell(ast: LLangAst, kb: KnowledgeBase): {
    kb: KnowledgeBase,
    additions: WorldModel,
    eliminations: WorldModel,
} {

    let additions: WorldModel = []
    let eliminations: WorldModel = []
    let addedDerivationClauses: DerivationClause[] = []

    switch (ast.type) {

        case 'has-formula':

            const { rast, kb: kb1 } = evalArgs(ast, kb)

            const def = definitionOf(rast, kb1)
            if (def) return tell(def, kb1)

            if (!isAtom(rast.subject) || !isAtom(rast.object) || !isAtom(rast.as)) return tell(decompress(rast), kb1)
            if (!isConst(rast.subject) || !isConst(rast.object) || !isConst(rast.as)) throw new Error(`cannot serialize formula with non-constants!`)

            additions = [[rast.subject.value, rast.object.value, rast.as.value]]

            break
        case 'is-a-formula':

            const t11 = ask(ast.subject, kb).result
            const t21 = ask(ast.object, kb).result

            if (!isAtom(t11) || !isAtom(t21)) return tell(decompress($(t11).isa(t21).$), kb)

            if (!isConst(t11) || !isConst(t21)) throw new Error('cannot serialize formula with variables!')

            additions = addWorldModels(
                [[t11.value, t21.value]],
                getDefaultFillers(t11.value, t21.value, kb),
            )

            break
        case 'conjunction':
            const result1 = tell(ast.f1, kb)
            const result2 = tell(ast.f2, result1.kb)
            additions = addWorldModels(result1.additions, result2.additions)
            addedDerivationClauses = result2.kb.derivClauses
            break
        case 'disjunction':
            throw new Error(`ambiguous disjunction`)
        case 'when-derivation-clause':
        case 'after-derivation-clause':
            addedDerivationClauses = [ast]
            break
        case 'if-else':
            {
                const { kb: kb1, result } = ask(ast.condition, kb)
                if (isTruthy(result)) return tell(ast.then, kb1)
                return tell(ast.otherwise, kb1)
            }
        case 'existquant':

            const v = removeImplicit(ast.value)

            if (v.type !== 'arbitrary-type') {
                throw new Error('!!!!!')
            }

            {
                const id = v.head.varType + '#' + random()
                const isa = $(id).isa(v.head.varType).$
                const where = subst(v.description, [v.head, $(id).$])

                const { kb: kb1 } = tell(isa, kb)
                const result = tell(where, kb1)
                return result
            }
        case 'negation':
            const result = tell(ast.f1, kb)
            additions = result.eliminations
            eliminations = result.additions
            break
        case 'generalized':
            const when = definitionOf(ast, kb)
            if (when) return tell(when, kb)
            break
        case "complement":
            return tell(removeImplicit(ast), kb)

        default:
            additions = []
            addedDerivationClauses = []
            break
    }

    const consequences = consequencesOf(ast, kb)
    const consequencesWm = consequences.flatMap(x => tell(x, kb).additions)
    additions.push(...consequencesWm)

    eliminations = [
        ...eliminations,
        ...additions.flatMap(s => excludedBy(s, kb)),
    ]

    const wm0 = addWorldModels(kb.wm, additions)
    const wm = subtractWorldModels(wm0, eliminations)

    const derivClauses = !addedDerivationClauses.length ? kb.derivClauses
        : sorted([...kb.derivClauses, ...addedDerivationClauses], (a, b) => compareSpecificities(b.conseq, a.conseq, kb))

    return {
        additions,
        eliminations,
        kb: {
            ...kb,
            wm,
            derivClauses,
        }
    }

}

function excludedBy(s: HasSentence | IsASentence, kb: KnowledgeBase) {

    if (isIsASentence(s)) {
        return excludedByIsA(s, kb)
    } else {
        return excludedByHas(s, kb)
    }

}

function excludedByHas(h: HasSentence, kb: KnowledgeBase): WorldModel {
    const concepts = conceptsOf(h[0], kb)
    const r = excludedByNumberRestriction(h, kb, concepts)
    const results = r.map(x => [h[0], x, h[2]] as HasSentence)
    return results
}

function excludedByNumberRestriction(h: HasSentence, kb: KnowledgeBase, concepts: WmAtom[]): WmAtom[] {

    const qs2 =
        concepts.map(c => $({ limitedNumOf: h[2], onConcept: c, max: 'n:number' }))

    const maxes =
        qs2.flatMap(x => findAll(x.$, [$('n:number').$], kb))
            .map(x => x.get($('n:number').$))
            .filter(isNotNullish)
            .map(x => x.value)

    if (!maxes.length) return []

    // assume oldest-inserted values come first
    const old = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(isNotNullish).map(x => x.value).concat(h[1])

    const max = Math.min(...maxes as number[]) // most restrictive
    const throwAway = old.slice(0, old.length - max)
    return throwAway
}

function excludedByIsA(is: IsASentence, kb: KnowledgeBase): WorldModel {

    const concepts = conceptsOf(is[0], kb)

    const qs = concepts.map(c => $({ concept: c, excludes: 'c2:thing' }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('c2:thing').$], kb))
            .map(x => x.get($('c2:thing').$))
            .filter(isNotNullish)
            .map(x => x.value)
            .filter(x => x !== is[1])

    const result = r.map(x => [is[0], x] as IsASentence)

    return result
}

function getDefaultFillers(id: WmAtom, concept: WmAtom, kb: KnowledgeBase) {
    const parts = getParts(concept, kb)
    const defaults = parts.map(p => findDefault(p, concept, kb))
    const pds = zip(parts, defaults)

    const fillers = pds.flatMap(e => {
        const p = e[0]
        const d = e[1]
        if (d === undefined) return []
        if (typeof d === 'number' || typeof d === 'boolean') return tell($(id).has(d).as(p).$, kb).additions

        return tell($(id).has(`x:${d}`).as(p).$, kb).additions
    })

    return fillers
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined {

    const result = ask($('x:thing').suchThat($(concept).has('x:thing').as(part)).$, kb).result
    if (result.type === 'nothing') return undefined
    if (!isAtom(result)) throw new Error(``)
    if (!isWmAtom(result.value)) throw new Error('')
    return result.value
}

function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const supers = conceptsOf(concept, kb)

    const parts = kb.wm
        .filter(isHasSentence)
        .filter(x => x[0] === concept)
        .filter(x => isTruthy(ask($(x[1]).isa('number-restriction').isNotTheCase.$, kb).result))
        .filter(x => isTruthy(ask($(x[1]).isa('mutex-concepts-annotation').isNotTheCase.$, kb).result))
        .map(x => x[2])

    const all = supers.filter(x => x !== concept).flatMap(x => getParts(x, kb)).concat(parts)
    return uniq(all)
}
