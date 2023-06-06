import { assert, assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { recomputeKb } from "./happen.ts";
import { test } from "./test.ts";
import { derivationClauses } from "./derivation-clauses.ts";
import { KnowledgeBase } from "./types.ts";
import { WorldModel } from "./types.ts";

export const model: WorldModel = [

    /* World Model */
    ...$('event#1').isa('birth-event').dump(),
    ...$('event#1').has('person#1').as('baby').dump(),
    ...$('event#1').has('person#2').as('mother').dump(),
    ...$('event#1').has('time-point#1').as('time').dump(),
    ...$('event#1').has('space-point#1').as('location').dump(),
    ...$('space-point#1').has('boston').as('enclosing-city').dump(),
    ...$('person#1').has('event#1').as('birth').dump(),
    ...$('person#2').isa('woman').dump(),
    ...$('person#1').isa('person').dump(),
    ...$('boston').isa('city').dump(),
    ...$('space-point#1').isa('space-point').dump(),
    ...$('door#1').isa('door').dump(),
    ...$('door-opening-event#1').isa('door-opening-event').dump(),
    ...$('door-opening-event#1').has('door#1').as('object').dump(),
    ...$('door-closing-event#1').isa('door-closing-event').dump(),
    ...$('door-closing-event#1').has('door#1').as('object').dump(),
    ...$('person#3').isa('person').dump(),
    ...$({ subject: 'person#3', isNear: 'door#1' }).dump(derivationClauses),


    /* Conceptual Model */
    ...$({ subject: 'agent', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'person', isAKindOf: 'agent' }).dump(derivationClauses),
    ...$({ subject: 'woman', isAKindOf: 'person' }).dump(derivationClauses),
    ...$({ subject: 'event', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'door-opening-event', isAKindOf: 'event' }).dump(derivationClauses),
    ...$({ subject: 'birth-event', isAKindOf: 'event' }).dump(derivationClauses),
    ...$({ subject: 'time-instant', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'point-in-space', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'city', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'multiple-birth-event', isAKindOf: 'birth-event' }).dump(derivationClauses),

    ...$({ subject: 'birth-event', canHaveA: 'mother' })
        .and($({ subject: 'birth-event', canHaveA: 'baby' }))
        .and($({ subject: 'birth-event', canHaveA: 'time' }))
        .and($({ subject: 'birth-event', canHaveA: 'location' }))
        .and($({ vr: 'vr#1', part: 'mother', ofConcept: 'birth-event', isA: 'woman' }))
        .and($({ nr: 'nr#1', part: 'mother', ofConcept: 'birth-event', amountsTo: 1 }))
        .and($({ nr: 'nr#2', part: 'baby', ofConcept: 'birth-event', amountsTo: 1 }))
        .and($({ subject: 'person', canHaveA: 'birth' }))
        .and($({ vr: 'vr#2', part: 'birth', ofConcept: 'person', isA: 'birth-event' }))
        .and($({ subject: 'open', isAKindOf: 'state' }))
        .and($({ subject: 'closed', isAKindOf: 'state' }))
        .and($({ subject: 'state', isAKindOf: 'thing' }))
        .dump(derivationClauses),

    ...$({ ann: 'ann#24', property: 'open', excludes: 'closed', onPart: 'state', onConcept: 'door' }).dump(derivationClauses),


]


export const kb: KnowledgeBase = {
    wm: model,
    derivClauses: derivationClauses
}

// console.log(kb.wm)

Deno.test({
    name: 'test1',
    fn: () => {
        const f = $('person#2').isa('person').$
        assert(test(f, kb))
    }
})

Deno.test({
    name: 'test2',
    fn: () => {

        const derivClauses = [
            $('x:dude').isa('dude').when($('x:dude').isa('person')).$,
        ]

        const yes = $('person#2').isa('dude').$
        const no = $('person#2').isa('anythingelse').$

        assert(test(yes, { wm: model, derivClauses }))
        assert(!test(no, { wm: model, derivClauses }))
    }
})

Deno.test({
    name: 'test3',
    fn: () => {
        const f = $('x:person').isa('person').$
        const v = $('x:person').$
        const results = findAll(f, [v], kb)
        // assertEquals(results.length, 3)
        assertEquals(results.length, 4)
    }
})


Deno.test({
    name: 'test4',
    fn: () => {

        const dc = $('x:person').has('c:city').as('birth-city').when(
            $('e:event').exists.where($('y:space-point').exists.where(
                $('y:space-point').has('c:city').as('enclosing-city')
                    .and($('e:event').has('y:space-point').as('location'))
                    .and($('x:person').has('e:event').as('birth'))
            ))
        ).$

        const query = $('person#1').has('boston').as('birth-city').$

        assert(test(query, { wm: model, derivClauses: [dc] }))
    }
})

Deno.test({
    name: 'test5',
    fn: () => {

        const ok = $('door#1').has('open').as('state').after(['door-opening-event#1']).$
        const ok2 = $('door#1').has('closed').as('state').after(['door-closing-event#1']).$
        const ok3 = $('door#1').has('open').as('state').after(['door-closing-event#1', 'door-opening-event#1']).$
        const no = $('door#1').has('open').as('state').after(['event#1']).$
        const ok4 = $('door#1').has('open').as('state').after(['door-opening-event#1', 'event#1']).$
        const no2 = $('door#1').has('open').as('state').after(['door-closing-event#1', 'event#1']).$
        const ok5 = $('door#1').has('closed').as('state').after(['door-opening-event#1', 'door-opening-event#1', 'door-closing-event#1']).$
        const no3 = $('door#1').has('closed').as('state').after(['door-opening-event#1', 'door-closing-event#1', 'door-opening-event#1', 'event#1']).$
        const find1 = $('door#1').has('open').as('state').after(['e:event']).$

        assert(test(ok, kb))
        assert(test(ok2, kb))
        assert(test(ok3, kb))
        assert(!test(no, kb))
        assert(test(ok4, kb))
        assert(!test(no2, kb))
        assert(test(ok5, kb))
        assert(!test(no3, kb))
        const results = findAll(find1, [$('e:event').$], kb)
        assertEquals(results[0].get($('e:event').$)?.value, 'door-opening-event#1')

    }
})

Deno.test({
    name: 'test6',
    fn: () => {

        const dp = $({ isStupid: 'x:thing' }).when(
            $('x:thing').has('stupid').as('intelligence')
        ).$

        const kb: KnowledgeBase = {
            wm: [
                ['capra', 'animal'],
                ['cat', 'animal'],
                ['capra', 'stupid', 'intelligence'],
                ['cat', 'smart', 'intelligence'],
            ],
            derivClauses: [dp]
        }

        assert(test($({ isStupid: 'capra' }).$, kb))
        assert(!test($({ isStupid: 'cat' }).$, kb))

    }
})

Deno.test({
    name: 'test7',
    fn: () => {
        assert(test($(2).isGreaterThan(1).$, { wm: [], derivClauses: [] }))
    }
})

Deno.test({
    name: 'test8',
    fn: () => {
        const dp = $({ subject: 'x:thing', isSmallerThan: 'y:thing' }).when(
            $('y:thing').isGreaterThan('x:thing')
        ).$

        const kb: KnowledgeBase = {
            wm: [],
            derivClauses: [dp],
        }

        assert(test($({ subject: 1, isSmallerThan: 2 }).$, kb))
    }
})


Deno.test({
    name: 'test9',
    fn: () => {

        const dc = [
            $({ subject: 'x:thing', isLargerThan: 'y:thing' }).when(
                $('v1:number').exists.where($('v2:number').exists.where(
                    $('x:thing').has('v1:number').as('volume')
                        .and($('y:thing').has('v2:number').as('volume'))
                        .and($('v1:number').isGreaterThan('v2:number'))
                ))
            ).$
        ]

        const wm = $('bucket#1').isa('bucket')
            .and($('apple#1').isa('apple'))
            .and($('bucket#1').has(2).as('volume'))
            .and($('apple#1').has(1).as('volume'))
            .dump()

        const test1 = $({ subject: 'bucket#1', isLargerThan: 'apple#1' }).$
        const wrong1 = $({ subject: 'apple#1', isLargerThan: 'bucket#1' }).$

        assert(test(test1, { wm: wm, derivClauses: dc }))
        assert(!test(wrong1, { wm: wm, derivClauses: dc }))

    }
})

Deno.test({
    name: 'test10',
    fn: () => {

        const x = test($('x:thing').exists.where(
            $({ ann: 'x:thing', property: 'open', excludes: 'closed', onPart: 'state', onConcept: 'door' })
        ).$, kb)

        assert(x)

    }
})

Deno.test({
    name: 'test11',
    fn: () => {
        const res = recomputeKb(['door-opening-event#1', 'door-closing-event#1'], kb)
        assert(test($('door#1').has('closed').as('state').$, res))
        assert(test($('door#1').has('open').as('state').isNotTheCase.$, res))
    }
})

Deno.test({
    name: 'test12',
    fn: () => {
        const kb2 = recomputeKb(['door-closing-event#1'], kb)
        assert(test($('door#1').has('closed').as('state').$, kb2))
        const f1 = $({ subject: 'door-opening-event#1', isPossibleFor: 'person#3' })
        const f2 = $({ subject: 'door-opening-event#1', isPossibleFor: 'person#2' }).isNotTheCase
        assert(test(f1.$, kb2))
        assert(test(f2.$, kb2))
        const f3 = $('door#1').has('open').as('state').after(['door-opening-event#1'])
        assert(test(f3.$, kb2))
    }
})

Deno.test({
    name: 'test13',
    fn: () => {
        // the empty sequence of actions (events) is always possible for any agent

        const f1 = $({ subject: [], isPossibleSeqFor: 'person#1' })
        assert(test(f1.$, kb))

        // const f2 = $({ subject: ['door-opening-event#1'], isPossibleSeqFor: 'person#1' }).isNotTheCase
        // assert(test(f2.$, kb))
    }
})

Deno.test({
    name: 'test14',
    fn: () => {
        const kb2 = recomputeKb(['door-closing-event#1'], kb)
        const f1 = $({ subject: ['door-opening-event#1'], isPossibleSeqFor: 'person#3' })
        assert(test(f1.$, kb2))
    }
})

Deno.test({
    name: 'test15',
    fn: () => {

        const kb2 = recomputeKb(['door-closing-event#1'], kb)

        const f2 = $({ subject: ['door-opening-event#1'], isPossibleSeqFor: 'person#3' })
        assert(test(f2.$, kb2))

        const f1 = $({ subject: 'e:event', isPossibleFor: 'person#3' })
        const result = findAll(f1.$, [$('e:event').$], kb2)
        assert(result[0].get($('e:event').$)?.value === 'door-opening-event#1')

        // why not finding sequence?
        const f3 = $({ subject: ['e:event'], isPossibleSeqFor: 'person#3' })
        const result2 = findAll(f3.$, [$('e:event').$], kb2)
        console.log(result2)

    }
})