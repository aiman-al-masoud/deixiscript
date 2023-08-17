import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { subst } from "./subst.ts";
import { DerivationClause, HasSentence, IsASentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, addWorldModels, conceptsOf, consequencesOf, isConst, isHasSentence, isIsASentence, isTruthy, subtractWorldModels } from "./types.ts";
import { definitionOf } from "./definitionOf.ts";
// import { evalArgs } from "./evalArgs.ts";
// import { decompress } from "./decompress.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { random } from "../utils/random.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { compareSpecificities } from "./compareSpecificities.ts";
import { sorted } from "../utils/sorted.ts";
import { uniq } from "../utils/uniq.ts";
import { zip } from "../utils/zip.ts";
import { assert } from "../utils/assert.ts";
import { evaluate } from "./evaluate.ts";


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
            {

                assert(isConst(ast.subject) && isConst(ast.object) && isConst(ast.as))
                additions = [[ast.subject.value, ast.object.value, ast.as.value]]
            }
            break
        case 'is-a-formula':
            {
                assert(isConst(ast.subject) && isConst(ast.object))

                additions = addWorldModels(
                    [[ast.subject.value, ast.object.value]],
                    getDefaultFillers(ast.subject.value, ast.object.value, kb),
                )
            }
            break
        case 'conjunction':
            {
                const result1 = evaluate($(ast.f1).tell.$, kb)
                const result2 = evaluate($(ast.f2).tell.$, result1.kb)
                additions = addWorldModels(result1.additions, result2.additions)
                addedDerivationClauses = result2.kb.derivClauses
            }
            break
        case 'disjunction':
            throw new Error(`ambiguous disjunction`)
        case 'when-derivation-clause':
        case 'after-derivation-clause':
            addedDerivationClauses = [ast]
            break
        case 'if-else':
            {
                const { kb: kb1, result } = evaluate(ast.condition, kb)
                if (isTruthy(result)) return evaluate($(ast.then).tell.$, kb1)
                return evaluate($(ast.otherwise).tell.$, kb1)
            }
        case 'existquant':
            {
                const v = removeImplicit(ast.value)
                return evaluate($(v).tell.$, kb)
            }
        case 'arbitrary-type':
            {
                const id = ast.head.varType + '#' + random()
                const isa = $(id).isa(ast.head.varType)
                const where = subst(ast.description, [ast.head, $(id).$])
                const { kb: kb1 } = evaluate(isa.tell.$, kb)
                const result = evaluate($(where).tell.$, kb1)
                return result
            }
        case 'variable':
            {
                return evaluate($(ast).suchThat($(ast).isa(ast.varType)).tell.$, kb)
            }
        case 'negation':
            {
                const result = evaluate($(ast.f1).tell.$, kb)
                additions = result.eliminations
                eliminations = result.additions
            }
            break
        case 'generalized':
            {
                // const when = definitionOf(ast, kb)
                // if (when) return evaluate($(when).tell.$, kb)
            }
            break
        case "complement":
            {
                return evaluate($(ast).tell.$, kb)
            }
        case 'cardinality':
            {
                return evaluate($(removeImplicit(ast)).tell.$, kb)
            }
        case 'which':
            {
                return evaluate($(removeImplicit(ast)).tell.$, kb)
            }
        case "number":
        case "boolean":
        case "entity":
        case "nothing":
        case "list":
        case "math-expression":
        case "implicit-reference":
        case "command":
        case "question":
            throw new Error(`not implemented`)
    }

    const consequences = consequencesOf(ast, kb)
    const consequencesWm = consequences.flatMap(x => evaluate($(x).tell.$, kb).additions)
    additions = [...additions, ...consequencesWm]

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
        if (typeof d === 'number' || typeof d === 'boolean') return evaluate($(id).has(d).as(p).tell.$, kb).additions

        return evaluate($(id).has(`x:${d}`).as(p).tell.$, kb).additions
    })

    return fillers
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined {

    const result = evaluate($('x:thing').suchThat($(concept).has('x:thing').as(part)).$, kb).result
    if (result.type === 'nothing') return undefined
    assert(isConst(result))
    return result.value
}

function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const parts = kb.wm
        .filter(isHasSentence)
        .filter(x => x[0] === concept)
        .filter(x => isTruthy(evaluate($(x[1]).isa('number-restriction').isNotTheCase.$, kb).result))
        .filter(x => isTruthy(evaluate($(x[1]).isa('mutex-concepts-annotation').isNotTheCase.$, kb).result))
        .map(x => x[2])

    const supers = conceptsOf(concept, kb).filter(x => x !== concept)

    // console.log(concept, supers)

    const all = supers.flatMap(x => getParts(x, kb)).concat(parts)
    return uniq(all)
}
