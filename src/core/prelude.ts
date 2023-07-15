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
    $({ subject: 'c:thing', verb: 'extend', object: 'sc:thing' }).when(
        $('c:thing').isa('sc:thing')
            .or($('intermediate:thing').exists.where(
                $('intermediate:thing').isa('sc:thing')
                    .and($('c:thing').isa('intermediate:thing'))
            ))
    ).$,

    // role
    $({ subject: 'c:thing', modal: 'can', verb: 'have', object: 'prop:thing' }).when(
        $('c:thing').has('prop:thing').as('part')
    ).$,

    // value restriction
    $({ annotation: 'vr:value-restriction', subject: 'part:thing', owner: 'owner-concept:thing', verb: 'be', object: 'value:thing' }).when(
        $('owner-concept:thing').has('vr:value-restriction').as('part')
            .and($('vr:value-restriction').isa('value-restriction'))
            .and($('vr:value-restriction').has('part:thing').as('subject'))
            .and($('vr:value-restriction').has('value:thing').as('object'))
    ).$,

    // number restriction
    $({ annotation: 'nr:number-restriction', subject: 'part:thing', owner: 'owner-concept:thing', verb: 'amount', recipient: 'value:thing' }).when(
        $('owner-concept:thing').has('nr:number-restriction').as('part')
            .and($('nr:number-restriction').isa('number-restriction'))
            .and($('nr:number-restriction').has('part:thing').as('subject'))
            .and($('nr:number-restriction').has('value:thing').as('object'))
    ).$,

    // cancel annotation
    $({ annotation: 'ann:cancel-annotation', subject: 'old:thing', verb: 'be', object: 'cancelled', ablative: 'concept:thing' }).when(
        $('concept:thing').has('ann:cancel-annotation').as('part')
            .and($('ann:cancel-annotation').isa('cancel-annotation'))
            .and($('ann:cancel-annotation').has('old:thing').as('subject'))
    ).$,

    // default annotation
    $({ annotation: 'ann:default-annotation', subject: 'prop:thing', owner: 'concept:thing', verb: 'default', recipient: 'default:thing' }).when(
        $('concept:thing').has('ann:default-annotation').as('part')
            .and($('ann:default-annotation').isa('default-annotation'))
            .and($('ann:default-annotation').has('prop:thing').as('subject'))
            .and($('ann:default-annotation').has('default:thing').as('object'))
    ).$,

    // excludes annotation
    $({ annotation: 'ann:mutex-annotation', subject: 'p1:thing', verb: 'exclude', object: 'p2:thing', location: 'prop:thing', owner: 'c:thing' }).when(
        $('c:thing').has('ann:mutex-annotation').as('part')
            .and($('ann:mutex-annotation').isa('mutex-annotation'))
            .and($('ann:mutex-annotation').has('p1:thing').as('p'))
            .and($('ann:mutex-annotation').has('p2:thing').as('p'))
            .and($('ann:mutex-annotation').has('prop:thing').as('prop'))
            .and($('ann:mutex-annotation').has('c:thing').as('concept'))
    ).$,

    // single-entry-for annotation
    $({ ann: 'ann:only-one-annotation', onlyHaveOneOf: 'prop:thing', onConcept: 'c:thing' }).when(
        $('c:thing').has('ann:only-one-annotation').as('part')
            .and($('ann:only-one-annotation').isa('only-one-annotation'))
            .and($('ann:only-one-annotation').has('prop:thing').as('prop'))
            .and($('ann:only-one-annotation').has('c:thing').as('concept'))
    ).$,

    // mutually exclusive concepts annotation
    $({ ann: 'ann:mutex-concepts-annotation', concept: 'c1:thing', excludes: 'c2:thing' }).when(
        $('ann:mutex-concepts-annotation').isa('mutex-concepts-annotation')
            .and($('ann:mutex-concepts-annotation').has('c1:thing').as('concept'))
            .and($('ann:mutex-concepts-annotation').has('c2:thing').as('concept'))
    ).$,

    // empty event sequence always possible
    $({ subject: 's:seq', verb: 'be', object: 'possible-sequence', beneficiary: 'a:agent' }).when(
        $('s:seq').equals([])
    ).$,

    // possiblity of non empty event sequence
    $({ subject: 's:seq|e:event', verb: 'be', object: 'possible-sequence', beneficiary: 'a:agent' }).when(
        $({ subject: 's:seq', verb: 'be', object: 'possible-sequence', beneficiary: 'a:agent' })
            .and($({ subject: 'e:event', verb: 'be', object: 'possible', beneficiary: 'a:agent' }).after('s:seq'))
    ).$,

]

const conceptualModel =
    $({ subject: 'agent', verb: 'extend', object: 'thing' }).dump(derivationClauses).kb.wm
