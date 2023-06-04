import { AtomicFormula, HasSentence,/*  Formula, */ isAtomicFormula, isHasSentence, isVar, KnowledgeBase, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
// import { kb } from './logic.test.ts'
import { findAll } from './findAll.ts'
import { substAll } from './subst.ts'
import { dumpWorldModel } from './dumpWorldModel.ts'
import { getAtoms } from './getAtoms.ts'
import { getConceptsOf } from './wm-funcs.ts'

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
export function happen(event: string, kb: KnowledgeBase): WorldModel {

    const changes = kb.derivClauses.flatMap(dc => {

        if (isAtomicFormula(dc.conseq)) {

            const x: AtomicFormula = {
                ...dc.conseq,
                after: { type: 'list-literal', list: [$(event).$] }
            }

            const variables = getAtoms(x).filter(isVar)
            const results = findAll(x, variables, kb)

            // some states are mutually exclusive, assume the newer dislodges the older

            const eventConsequences = results.map(r => substAll(x, r))
                .flatMap(x => dumpWorldModel(x, kb))

            // const old = eventConsequences /* is old */.filter(s1 => kb.wm.some(s2 => s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]))
            const additions = eventConsequences  /* is new */.filter(s1 => !kb.wm.some(s2 => s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]))

            return additions
        }

        return []
    })

    return changes

}

// const wm1 = happen('door-opening-event#1', kb)
// console.log(wm1)
// // TODO need a way of dealing with mutually exclusive properties
// // mabe use number-restriction.
// // $({nr:'nr#1', part:'state', ofConcept:'door', amountsTo:1})
// // $({ nr: 'nr:number-restriction', part: 'state', ofConcept: 'door', amountsTo: 1 })
// // also query for possible cancellations
// // getParts() and check if there is a cancel-annotation with subject = 'state'
// const wm2 = happen('door-closing-event#1', { ...kb, wm: [...kb.wm, ...wm1] })
// console.log(wm2)


export function getExcludedBy(h: HasSentence, kb: KnowledgeBase) {
    const concepts = getConceptsOf(h[0], kb.wm)
    // console.log(concepts)

    const qs =
        concepts.map(c => $({ ann: 'x:mutex-annotation', property: h[1] as string, excludes: 'y:thing', onPart: h[2] as string, onConcept: c as string }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('x:mutex-annotation').$, $('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(x => x?.value !== h[1]).map(x => x?.value))

    // console.log(r)
    const results = r.map(x => [h[0], x, h[2]] as HasSentence)
    return results
    // console.log(results)

}

export function recomputeKb(event: string, kb: KnowledgeBase) {

    const additions = happen(event, kb)
    const eliminations = additions.filter(isHasSentence).flatMap(s => getExcludedBy(s, kb))
    const filtered = kb.wm.filter(s1 => !eliminations.some(s2 => s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]))
    const final = filtered.concat(additions)

    const result: KnowledgeBase = {
        derivClauses: kb.derivClauses,
        wm: final
    }

    // console.log(result)
    return result
}

