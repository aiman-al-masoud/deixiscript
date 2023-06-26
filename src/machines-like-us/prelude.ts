import { $ } from "./exp-builder.ts";
import { DerivationClause, KnowledgeBase } from "./types.ts";

export function getStandardKb(): KnowledgeBase {
    return {
        wm: conceptualModel,
        derivClauses: derivationClauses,
        deicticDict: {},
    }
}

const derivationClauses: DerivationClause[] = [

    // inheritance
    $({ subject: 'c:thing', isAKindOf: 'sc:thing' }).when(
        $('c:thing').has('sc:thing').as('superconcept')
    ).$,

    // role
    $({ subject: 'c:thing', modal:'can', verb:'have', object: 'prop:thing' }).when(
        $('c:thing').has('prop:thing').as('part')
    ).$,

    // value restriction
    $({ annotation: 'vr:thing', subject: 'part:thing', owner: 'owner-concept:thing', verb: 'be', object: 'value:thing' }).when(
        $('owner-concept:thing').has('vr:thing').as('part')
            .and($('vr:thing').isa('value-restriction'))
            .and($('vr:thing').has('part:thing').as('subject'))
            .and($('vr:thing').has('value:thing').as('object'))
    ).$,

    // number restriction
    $({ annotation: 'nr:thing', subject: 'part:thing', owner: 'owner-concept:thing', verb:'amount', recipient: 'value:thing' }).when(
        $('owner-concept:thing').has('nr:thing').as('part')
            .and($('nr:thing').isa('number-restriction'))
            .and($('nr:thing').has('part:thing').as('subject'))
            .and($('nr:thing').has('value:thing').as('object'))
    ).$,

    // cancel annotation // annot: subject copula-verb predicate("cancelled") ablative
    $({ ann: 'ann:thing', cancels: 'old:thing', fromConcept: 'concept:thing' }).when(
        $('concept:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('cancel-annotation'))
            .and($('ann:thing').has('old:thing').as('subject'))
    ).$,

    // default annotation
    $({ ann: 'ann:thing', property: 'prop:thing', ofConcept: 'concept:thing', defaultsTo: 'default:thing' }).when(
        $('concept:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('default-annotation'))
            .and($('ann:thing').has('prop:thing').as('subject'))
            .and($('ann:thing').has('default:thing').as('object'))
    ).$,

    // excludes annotation
    $({ ann: 'ann:thing', property: 'p1:thing', excludes: 'p2:thing', onPart: 'prop:thing', onConcept: 'c:thing' }).when(
        $('c:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('mutex-annotation'))
            .and($('ann:thing').has('p1:thing').as('p'))
            .and($('ann:thing').has('p2:thing').as('p'))
            .and($('ann:thing').has('prop:thing').as('prop'))
            .and($('ann:thing').has('c:thing').as('concept'))
    ).$,

    // single-entry-for annotation
    $({ ann: 'ann:thing', onlyHaveOneOf: 'prop:thing', onConcept: 'c:thing' }).when(
        $('c:thing').has('ann:thing').as('part')
            .and($('ann:thing').isa('only-one-annotation'))
            .and($('ann:thing').has('prop:thing').as('prop'))
            .and($('ann:thing').has('c:thing').as('concept'))
    ).$,

    // empty event sequence always possible
    $({ subject: 's:seq', isPossibleSeqFor: 'a:agent' }).when(
        $('s:seq').is([])
    ).$,

    // possiblity of non empty event sequence
    $({ subject: 's:seq|e:event', isPossibleSeqFor: 'a:agent' }).when(
        $({ subject: 's:seq', isPossibleSeqFor: 'a:agent' })
            .and($({ subject: 'e:event', isPossibleFor: 'a:agent' }).after('s:seq'))
    ).$,

]

const conceptualModel =
    $({ subject: 'agent', isAKindOf: 'thing' }).dump(derivationClauses).wm
