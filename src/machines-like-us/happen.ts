import { Formula, isVar, KnowledgeBase, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
import { kb } from './logic.test.ts'
import { findAll } from './findAll.ts'
import { substAll } from './subst.ts'
import { dumpWorldModel } from './dumpWorldModel.ts'
import { getAtoms } from './getTerms.ts'

/**
 * Recomputes a world model with the changes brought forward by an event.
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

        const x = {
            ...dc.conseq,
            after: { type: 'list-literal', list: [$(event).$] }
        } as Formula

        const variables = getAtoms(x).filter(isVar)
        const results = findAll(x, variables, kb)

        return results.map(r => substAll(x, r))
            .flatMap(x => dumpWorldModel(x, kb))
    })

    return changes

}

const wm1 = happen('door-opening-event#1', kb)
console.log(wm1)
// TODO need a way of dealing with mutually exclusive properties
// mabe use number-restriction.
// $({nr:'nr#1', part:'state', ofConcept:'door', amountsTo:1})
// $({ nr: 'nr:number-restriction', part: 'state', ofConcept: 'door', amountsTo: 1 })
// also query for possible cancellations
// getParts() and check if there is a cancel-annotation with subject = 'state'
const wm2 = happen('door-closing-event#1', { ...kb, wm: [...kb.wm, ...wm1] })
console.log(wm2)
