import { dumpWorldModel } from "./dumpWorldModel.ts";
import { $ } from "./exp-builder.ts";
import { DerivationClause, KnowledgeBase } from "./types.ts";

const derivationClauses: DerivationClause[] = [

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

]

const kb: KnowledgeBase = {
    wm: [],
    derivClauses: derivationClauses,
}

// 1 inheritance
console.log(dumpWorldModel($({ subject: 'capra', isAKindOf: 'mammal' }).$, kb))
// 2 association
console.log(dumpWorldModel($({ subject: 'mammal', canHaveA: 'hair' }).$, kb))
// 3 value restriction
const test3 = $({ vr: 'vr#1', part: 'mother', ofConcept: 'birth', isA: 'woman' }).$
console.log(dumpWorldModel(test3, kb))
// 4 number restriction
const test4 = $({ nr: 'nr#1', part: 'mother', ofConcept: 'birth', amountsTo: 1 }).$
console.log(dumpWorldModel(test4, kb))
// 5 cancel annotation
const test5 = $({ ann: 'ann#22', cancels: 'vr#33', fromConcept: 'capra' }).$
console.log(dumpWorldModel(test5, kb))
// 6 default annotation
const test6 = $({ ann: 'ann#44', property: 'locomotion', ofConcept: 'bird', defaultsTo: 'fly' }).$
console.log(dumpWorldModel(test6, kb))
