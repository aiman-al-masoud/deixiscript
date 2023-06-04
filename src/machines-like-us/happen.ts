import { AtomicFormula,/*  Formula, */ isAtomicFormula, isConst, isVar, KnowledgeBase, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
// import { kb } from './logic.test.ts'
import { findAll } from './findAll.ts'
import { substAll } from './subst.ts'
import { dumpWorldModel } from './dumpWorldModel.ts'
import { getAtoms } from './getAtoms.ts'
import { getParts } from './wm-funcs.ts'
import { test } from './test.ts'

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

            // how about modelling the "state" of a door as a fluent at a more abstract level?
            // $({ nr: 'nr#3', part: 'state', ofConcept: 'door', amountsTo: 1 })    
            // if (isVar(dc.conseq.t1) && isVar(dc.conseq.t2)) {
            // const numberRestrictions = getParts(dc.conseq.t1.varType, kb.wm)
            // .filter(x => test($(x).isa('number-restriction').$, kb))
            // console.log(numberRestrictions)
            // console.log(findAll($({ nr: 'nr:number-restriction', part: dc.conseq.t2.varType, ofConcept: dc.conseq.t1.varType, amountsTo: 1 }).$, [$('nr:number-restriction').$], kb))
            // const y = kb.wm.filter(x=>parts.includes(x[0]))
            // console.log(y)
            // }

            const eventConsequences = results.map(r => substAll(x, r))
                .flatMap(x => dumpWorldModel(x, kb))

            const old = eventConsequences /* is old */.filter(s1 => kb.wm.some(s2 => s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]))
            const additions = eventConsequences  /* is new */.filter(s1 => !kb.wm.some(s2 => s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]))

            // console.log('old=', old)

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
