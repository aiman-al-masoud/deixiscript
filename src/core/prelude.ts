import { $ } from "./exp-builder.ts";
import { KnowledgeBase } from "./types.ts";

export function getStandardKb(): KnowledgeBase {
    return {
        wm: [],
        deicticDict: {},
        derivClauses: [
            // // value restriction
            // $({ annotation: 'vr:value-restriction', subject: 'part:thing', owner: 'owner-concept:thing', verb: 'be', object: 'value:thing' }).when(
            //     $('owner-concept:thing').has('vr:value-restriction').as('part')
            //         .and($('vr:value-restriction').isa('value-restriction'))
            //         .and($('vr:value-restriction').has('part:thing').as('subject'))
            //         .and($('vr:value-restriction').has('value:thing').as('object'))
            // ).$,

            // // cancel annotation
            // $({ annotation: 'ann:cancel-annotation', subject: 'old:thing', verb: 'be', object: 'cancelled', ablative: 'concept:thing' }).when(
            //     $('concept:thing').has('ann:cancel-annotation').as('part')
            //         .and($('ann:cancel-annotation').isa('cancel-annotation'))
            //         .and($('ann:cancel-annotation').has('old:thing').as('subject'))
            // ).$,


            // number restriction
            $({ annotation: 'nr:number-restriction', subject: 'part:thing', owner: 'owner-concept:thing', verb: 'amount', recipient: 'value:thing' }).when(
                $('owner-concept:thing').has('nr:number-restriction').as('part')
                    .and($('nr:number-restriction').isa('number-restriction'))
                    .and($('nr:number-restriction').has('part:thing').as('subject'))
                    .and($('nr:number-restriction').has('value:thing').as('object'))
            ).$,

            // excludes annotation
            $({ annotation: 'ann:thing', subject: 'p1:thing', verb: 'exclude', object: 'p2:thing', location: 'prop:thing', owner: 'c:thing' }).when(
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

            // mutually exclusive concepts annotation
            $({ ann: 'ann:thing', concept: 'c1:thing', excludes: 'c2:thing' }).when(
                $('ann:thing').isa('mutex-concepts-annotation')
                    .and($('ann:thing').has('c1:thing').as('concept'))
                    .and($('ann:thing').has('c2:thing').as('concept'))
            ).$,

            // default copula behavior
            $({ subject: 'x:thing', verb: 'be', object: 'y:thing' }).when(
                $('x:thing').equals('y:thing')
            ).$,

            // pronouns as derivation clauses
            $('it').when('x:thing').$
        ],
    }
}

