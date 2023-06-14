import { AtomicFormula, GeneralizedSimpleFormula, HasSentence, isFormulaWithNonNullAfter, isHasSentence, isVar, KnowledgeBase, WmAtom, wmSentencesEqual, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
import { findAll } from './findAll.ts'
import { substAll } from './subst.ts'
import { dumpWorldModel } from './dumpWorldModel.ts'
import { getAtoms } from './getAtoms.ts'
import { getConceptsOf } from './wm-funcs.ts'

/**
 * Recompute the updated KB (situation) after a sequence of (existing) events takes place.
 */
export function recomputeKb(event: WmAtom[], kb: KnowledgeBase) {
    return event.reduce((currKb, e) => recomputeKbAfterSingleEvent(e, currKb), kb)
}

function recomputeKbAfterSingleEvent(event: WmAtom, kb: KnowledgeBase) {

    const additions = getAdditions(event, kb)
    const eliminations = additions.filter(isHasSentence).flatMap(s => getExcludedBy(s, kb))
    const filtered = kb.wm.filter(s1 => !eliminations.some(s2 => wmSentencesEqual(s1, s2)))
    const final = filtered.concat(additions)

    const result: KnowledgeBase = {
        derivClauses: kb.derivClauses,
        wm: final,
    }

    return result
}

/**
 * Computes the changes immediately caused by an event.
 * 
 * Better performance than the naive query:
 * 
 *  const f1 = $('x:thing').has('y:thing').as('z:thing')
 *  const query = f1.isNotTheCase.and(f1.after(['my-event#1']))
 * 
 * Because it tends to reduce the number of free variables in the query,
 * therefore making findAll() less expensive. The cost of findAll() is 
 * proportional to the cost of a cartesian product between x sets, which 
 * is O(n^x), where 1<=x<=3 (world model formulas have 3 terms at most), 
 * bringing it down to even just x=2 is a significant improvement.
 * 
 * Also because it tends to specify the types of the variables involved,
 * therefore filtering out the irrelevant ones, reducing the size of the sets, 
 * and therefore reducing the constant factor.
 *
 *
 */
function getAdditions(event: WmAtom, kb: KnowledgeBase): WorldModel {

    const changes = kb.derivClauses.flatMap(dc => {

        if (isFormulaWithNonNullAfter(dc.conseq)) {

            const x: AtomicFormula | GeneralizedSimpleFormula = {
                ...dc.conseq,
                after: { type: 'list-literal', list: [$(event).$] }
            }

            const variables = getAtoms(x).filter(isVar)
            const results = findAll(x, variables, kb, false)

            const eventConsequences = results.map(r => substAll(x, r))
                .flatMap(x => dumpWorldModel(x, kb))

            const additions =
                eventConsequences.filter(s1 => !kb.wm.some(s2 => wmSentencesEqual(s1, s2)))

            return additions
        }

        return []
    })

    return changes

}

export function getExcludedBy(h: HasSentence, kb: KnowledgeBase) {
    const concepts = getConceptsOf(h[0], kb.wm)

    const qs =
        concepts.map(c => $({ ann: 'x:mutex-annotation', property: h[1], excludes: 'y:thing', onPart: h[2], onConcept: c }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('x:mutex-annotation').$, $('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(x => x?.value !== h[1]).map(x => x?.value), false)


    //TODO: refactor-----
    const qs2 =
        concepts.map(c => $({ ann: 'x:only-one-annotation', onlyHaveOneOf: h[2], onConcept: c }))

    const r2 =
        qs2.flatMap(q => findAll(q.$, [$('x:only-one-annotation').$], kb))

    if (r2.length) {
        const buf = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb)
        r.push(...buf.map(x => x.get($('y:thing').$)?.value))
    }
    //---------

    const results = r.map(x => [h[0], x, h[2]] as HasSentence)
    return results

}
