import { $ } from "./exp-builder.ts";
import { DerivationClause } from "./types.ts";

export const derivationClauses: DerivationClause[] = [

    /* conceptual model shorthands */

    $({ subject: 'c:thing', isAKindOf: 'sc:thing' }).when(
        $('c:thing').has('sc:thing').as('superconcept')
    ).$,

    $({ subject: 'c:thing', canHaveA: 'prop:thing' }).when(
        $('c:thing').has('prop:thing').as('part')
    ).$,

    $({ vr: 'vr:thing', part: 'part:thing', ofConcept: 'owner-concept:thing', isA: 'value:thing' }).when(
        $('owner-concept:thing').has('vr:thing').as('part')
            .and($('vr:thing').isa('value-restriction'))
            .and($('vr:thing').has('part:thing').as('subject'))
            .and($('vr:thing').has('value:thing').as('object'))
    ).$,

    $({ nr: 'nr:thing', part: 'part:thing', ofConcept: 'owner-concept:thing', amountsTo: 'value:thing' }).when(
        $('owner-concept:thing').has('nr:thing').as('part')
            .and($('nr:thing').isa('number-restriction'))
            .and($('nr:thing').has('part:thing').as('subject'))
            .and($('nr:thing').has('value:thing').as('object'))
    ).$,

    $({ ann: 'ann:thing', cancels: 'old:thing', fromConcept: 'concept:thing' }).when(
        $('concept:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('cancel-annotation'))
            .and($('ann:thing').has('old:thing').as('subject'))
    ).$,

    $({ ann: 'ann:thing', property: 'prop:thing', ofConcept: 'concept:thing', defaultsTo: 'default:thing' }).when(
        $('concept:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('default-annotation'))
            .and($('ann:thing').has('prop:thing').as('subject'))
            .and($('ann:thing').has('default:thing').as('object'))
    ).$,

    $({ ann: 'ann:thing', property: 'p1:thing', excludes: 'p2:thing', onPart: 'prop:thing', onConcept: 'c:thing' }).when(
        $('c:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('mutex-annotation'))
            .and($('ann:thing').has('p1:thing').as('p'))
            .and($('ann:thing').has('p2:thing').as('p'))
            .and($('ann:thing').has('prop:thing').as('prop'))
            .and($('ann:thing').has('c:thing').as('concept'))
    ).$,

    /* others */

    $('d:door').has('z:state').as('state').after('s:seq|e:event').when(
        $('z:state').is('open').if($('e:event').isa('door-opening-event').and($('e:event').has('d:door').as('object')))
            .else($('z:state').is('closed').if($('e:event').isa('door-closing-event').and($('e:event').has('d:door').as('object')))
                .else($('d:door').has('z:state').as('state').after('s:seq')))
    ).$,

    $({ subject: 'e:door-opening-event', isPossibleFor: 'a:agent' }).when(
        $('d:door').exists.where(
            $('e:door-opening-event').has('d:door').as('object')
                .and($('a:agent').has('d:door').as('near'))
                .and($('d:door').has('closed').as('state'))
        )
    ).$,

    $({ subject: 'e:move-event', isPossibleFor: 'a:agent' }).when(
        $('e:move-event').isa('move-event')
    ).$,

    $('x:agent').has('y:thing').as('near').after('s:seq|e:event').when(
        $(true).if($('e:event').isa('move-event')
            .and($('e:event').has('y:thing').as('destination')))
            .else($('x:agent').has('y:thing').as('near').after('s:seq'))
    ).$,

    $({ subject: 's:seq', isPossibleSeqFor: 'a:agent' }).when(
        $('s:seq').is([])
    ).$,

    $({ subject: 's:seq|e:event', isPossibleSeqFor: 'a:agent' }).when(
        $({ subject: 's:seq', isPossibleSeqFor: 'a:agent' })
            .and($({ subject: 'e:event', isPossibleFor: 'a:agent' }).after('s:seq'))
    ).$,

]

// const kb: KnowledgeBase = {
//     wm: [],
//     derivClauses: derivationClauses,
// }

// // 1 inheritance
// console.log(dumpWorldModel($({ subject: 'capra', isAKindOf: 'mammal' }).$, kb))
// // 2 association
// console.log(dumpWorldModel($({ subject: 'mammal', canHaveA: 'hair' }).$, kb))
// // 3 value restriction
// const test3 = $({ vr: 'vr#1', part: 'mother', ofConcept: 'birth', isA: 'woman' }).$
// console.log(dumpWorldModel(test3, kb))
// // 4 number restriction
// const test4 = $({ nr: 'nr#1', part: 'mother', ofConcept: 'birth', amountsTo: 1 }).$
// console.log(dumpWorldModel(test4, kb))
// // 5 cancel annotation
// const test5 = $({ ann: 'ann#22', cancels: 'vr#33', fromConcept: 'capra' }).$
// console.log(dumpWorldModel(test5, kb))
// // 6 default annotation
// const test6 = $({ ann: 'ann#44', property: 'locomotion', ofConcept: 'bird', defaultsTo: 'fly' }).$
// console.log(dumpWorldModel(test6, kb))
