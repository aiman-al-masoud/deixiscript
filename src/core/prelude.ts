import { $ } from "./exp-builder.ts";
import { KnowledgeBase } from "./types.ts";

export function getStandardKb(): KnowledgeBase {
    return {
        wm: [],
        deicticDict: {},
        derivClauses: [

            // single-entry-for annotation
            $({ limitedNumOf: 'prop:thing', onConcept: 'c:thing', max: 'n:number' }).when( // max=0 will probably not work
                $('ann:thing').exists.where(
                    $('ann:thing').isa('number-restriction')
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
            $('x:thing').is('y:thing').when(
                $('x:thing').equals('y:thing')
            ).$,

            // pronouns as derivation clauses
            $('it').when('x:thing').$,

        ],
    }
}

