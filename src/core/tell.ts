import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { subst } from "./subst.ts";
import { ask } from "./ask.ts";
import { DerivationClause, HasSentence, IsASentence, KnowledgeBase, LLangAst, Variable, WmAtom, WorldModel, addWorldModels, conceptsOf, consequencesOf, definitionOf, isAtom, isConst, isHasSentence, isIsASentence, isTruthy, isWmAtom, subtractWorldModels } from "./types.ts";
import { getParts } from "./getParts.ts";
import { decompress } from "./decompress.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { random } from "../utils/random.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { compareSpecificities } from "./compareSpecificities.ts";
import { sorted } from "../utils/sorted.ts";


/**
 * Assume the AST is true, and compute resulting knowledge base.
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
            const t1 = ask(ast.subject, kb).result
            const t2 = ask(ast.object, kb).result
            const as = ask(ast.as, kb).result
            if (!isConst(t1) || !isConst(t2) || !isConst(as)) throw new Error(`cannot serialize formula with non-constants!`)

            additions = [[t1.value, t2.value, as.value]]
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
            return isTruthy(ask(ast.condition, kb).result) ? tell(ast.then, kb) : tell(ast.otherwise, kb)
        case 'existquant':

            if (ast.value.type === 'arbitrary-type') {
                additions = instantiateConcept(ast.value.head, ast.value.description, kb)
            } else if (ast.value.type === 'implicit-reference') {
                const at = removeImplicit(ast.value)
                additions = instantiateConcept(at.head, at.description, kb)
            } else {
                throw new Error('!!!!!')
            }

            break
        case 'negation':
            const result = tell(ast.f1, kb)
            additions = result.eliminations
            eliminations = result.additions
            break
        case 'generalized':
            const when = definitionOf(ast, kb)
            if (when) return tell(when, kb)
            break
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

    // const filtered = subtractWorldModels(kb.wm, eliminations)
    // const wm = addWorldModels(filtered, additions)
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

    const r = excludedBySingleValueAnnot(h, kb, concepts)

    const results = r.map(x => [h[0], x, h[2]] as HasSentence)
    return results
}

function excludedBySingleValueAnnot(h: HasSentence, kb: KnowledgeBase, concepts: WmAtom[]): WmAtom[] {

    const qs2 =
        concepts.map(c => $({ limitedNumOf: h[2], onConcept: c, max: 'n:number' }))

    const maxes =
        qs2.flatMap(x => findAll(x.$, [$('n:number').$], kb))
            .map(x => x.get($('n:number').$))
            .filter(isNotNullish)
            .map(x => x.value)

    if (!maxes.length) return []

    // assume oldest-inserted values come first
    const old = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(isNotNullish).map(x => x.value)

    const max = Math.min(...maxes as number[]) // most restrictive
    const throwAway = old.slice(0, old.length - max + 1)
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

    const fillers = defaults.flatMap((d, i) => {
        if (d === undefined) return []
        if (typeof d === 'number' || typeof d === 'boolean') return tell($(id).has(d).as(parts[i]).$, kb).additions

        return instantiateConcept(
            $(`x:${d}`).$,
            $(id).has(`x:${d}`).as(parts[i]).$,
            kb,
        )
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

/**
 * Creates a new instance of a concept (an individual).
 * Returns the additions to the World Model ONLY.
 */
function instantiateConcept(
    head: Variable,
    description: LLangAst,
    kb: KnowledgeBase,
): WorldModel {

    const id = head.varType + '#' + random()
    const where = subst(description, [head, $(id).$])

    const isAAdditions = tell($(id).isa(head.varType).$, kb).additions
    const whereAdditions = tell(where, kb).additions

    const conflicts = isAAdditions
        .filter(isHasSentence)
        .filter(x => whereAdditions.some(y => y[0] === x[0] && y[2] === y[2]))

    const fillersWithoutConflicts = subtractWorldModels( // where prevails over defaults
        isAAdditions,
        conflicts,
    )

    const additions = addWorldModels(
        fillersWithoutConflicts,
        whereAdditions,
    )

    return additions
}

