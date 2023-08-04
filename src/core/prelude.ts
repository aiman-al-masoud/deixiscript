import { $ } from "./exp-builder.ts";
import { KnowledgeBase } from "./types.ts";

export function getStandardKb(): KnowledgeBase {
    return {
        wm: [],
        deicticDict: {},
        derivClauses: [

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
            $({ limitedNumOf: 'prop:thing', onConcept: 'c:thing', max: 'n:number' }).when(
                $('ann:thing').exists.where(
                    $('ann:thing').isa('only-one-annotation')
                        .and($('c:thing').has('ann:thing').as('part'))
                        .and($('ann:thing').has('prop:thing').as('prop'))
                        .and($('ann:thing').has('c:thing').as('concept'))
                        .and($('ann:thing').has('n:number').as('max'))
                )
            ).$,

            // mutually exclusive concepts annotation
            $({ concept: 'c1:thing', excludes: 'c2:thing' }).when(
                $('ann:thing').exists.where(
                    $('ann:thing').isa('mutex-concepts-annotation')
                        .and($('ann:thing').has('c1:thing').as('concept'))
                        .and($('ann:thing').has('c2:thing').as('concept'))
                )
            ).$,

            // default copula behavior
            $({ subject: 'x:thing', verb: 'be', object: 'y:thing' }).when(
                $('x:thing').equals('y:thing')
            ).$,

            // pronouns as derivation clauses
            $('it').when('x:thing').$,

        ],
    }
}

