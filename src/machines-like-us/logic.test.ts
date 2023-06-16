import { assert, assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $, ExpBuilder } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { recomputeKb } from "./recomputeKb.ts";
import { test } from "./test.ts";
import { derivationClauses } from "./derivation-clauses.ts";
import { Formula, KnowledgeBase } from "./types.ts";
import { WorldModel } from "./types.ts";
import { getParts } from "./wm-funcs.ts";

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

    ...$('person#3').has(5).as('position').dump(),
    ...$('door#1').has(5).as('position').dump(),

    ...$({ makeMoveEvent: 'move-event#1', subject: 'person#1', destination: 'door#1' }).dump(derivationClauses),

    ...$('door#1').has('closed').as('state').dump(),

    ...$('agent#007').isa('agent').dump(),
    ...$('agent#007').has(2).as('position').dump(),
    ...$('door#44').has(1).as('position').dump(),

    ...$({ makeMoveEvent: 'move-event#3', subject: 'agent#007', destination: 'door#44' }).dump(derivationClauses),

    /* Conceptual Model */
    ...$({ subject: 'agent', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'agent', canHaveA: 'movement' }).dump(derivationClauses),
    ...$({ vr: 'vr#43', part: 'movement', ofConcept: 'agent', isA: 'move-event' }).dump(derivationClauses),
    ...$({ subject: 'person', isAKindOf: 'agent' }).dump(derivationClauses),
    ...$({ subject: 'woman', isAKindOf: 'person' }).dump(derivationClauses),
    ...$({ subject: 'event', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'door-opening-event', isAKindOf: 'event' }).dump(derivationClauses),
    ...$({ subject: 'door-opening-event', canHaveA: 'object' }).dump(derivationClauses),
    ...$({ subject: 'birth-event', isAKindOf: 'event' }).dump(derivationClauses),
    ...$({ subject: 'time-instant', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'point-in-space', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'city', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'multiple-birth-event', isAKindOf: 'birth-event' }).dump(derivationClauses),
    ...$({ subject: 'move-event', isAKindOf: 'event' }).dump(derivationClauses),
    ...$({ subject: 'move-event', canHaveA: 'destination' }).dump(derivationClauses),
    ...$({ subject: 'door', isAKindOf: 'thing' }).dump(derivationClauses),
    ...$({ subject: 'door', canHaveA: 'opening' }).dump(derivationClauses),
    ...$({ vr: 'vr#21', part: 'opening', ofConcept: 'door', isA: 'door-opening-event' }).dump(derivationClauses),

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
        .and($({ subject: 'event', canHaveA: 'duration' }))
        .and($({ ann: 'ann#41', cancels: 'nr#2', fromConcept: 'multiple-birth-event' }))
        .dump(derivationClauses),

    ...$({ ann: 'ann#24', property: 'open', excludes: 'closed', onPart: 'state', onConcept: 'door' }).dump(derivationClauses),
    ...$({ ann: 'ann#4923', onlyHaveOneOf: 'position', onConcept: 'thing' }).dump(derivationClauses),

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
        const test2 = $({ subject: 'apple#1', isLargerThan: 'bucket#1' }).isNotTheCase.$

        assert(test(test1, { wm: wm, derivClauses: dc }))
        assert(test(test2, { wm: wm, derivClauses: dc }))

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
        assert(test($('door#1').has('closed').as('state').$, kb))
        const f1 = $({ subject: 'door-opening-event#1', isPossibleFor: 'person#3' })
        const f2 = $({ subject: 'door-opening-event#1', isPossibleFor: 'person#2' }).isNotTheCase
        assert(test(f1.$, kb))
        assert(test(f2.$, kb))
        const f3 = $('door#1').has('open').as('state').after(['door-opening-event#1'])
        assert(test(f3.$, kb))
    }
})

Deno.test({
    name: 'test13',
    fn: () => {
        // the empty sequence of actions (events) is always possible for any agent
        const f1 = $({ subject: [], isPossibleSeqFor: 'person#1' })
        assert(test(f1.$, kb))
    }
})

Deno.test({
    name: 'test14',
    fn: () => {
        const f1 = $({ subject: ['door-opening-event#1'], isPossibleSeqFor: 'person#3' })
        assert(test(f1.$, kb))
    }
})

Deno.test({
    name: 'test15',
    fn: () => {

        const f2 = $({ subject: ['door-opening-event#1'], isPossibleSeqFor: 'person#3' })
        assert(test(f2.$, kb))

        const f1 = $({ subject: 'e:event', isPossibleFor: 'person#3' })
        const result = findAll(f1.$, [$('e:event').$], kb)
        assert(result[0].get($('e:event').$)?.value === 'door-opening-event#1')

        const f3 = $({ subject: ['e:event'], isPossibleSeqFor: 'person#3' })
        const result2 = findAll(f3.$, [$('e:event').$], kb)
        assert(result2[0].get($('e:event').$)?.value === 'door-opening-event#1')

    }
})

Deno.test({
    name: 'test16',
    fn: () => {

        const goal = $('door#1').has('open').as('state')
        const result = plan(goal, 'person#3', kb)

        assert(result[0].get($('e:event').$)?.value === 'door-opening-event#1')
    }
})


function plan(goal: ExpBuilder<Formula>, agent: string, kb: KnowledgeBase) {

    const q = $({ subject: ['e:event'], isPossibleSeqFor: agent })
        .and(goal.after(['e:event']))

    const result = findAll(q.$, [$('e:event').$], kb)

    return result

}

Deno.test({
    name: 'test17',
    fn: () => {

        assert(!test($({ subject: 'person#1', isNear: 'door#1' }).$, kb))

        assert(!test($({ subject: 'door-opening-event#1', isPossibleFor: 'person#1' }).$, kb))

        const kb2 = recomputeKb(['move-event#1'], kb)

        assert(test($({ subject: 'person#1', isNear: 'door#1' }).$, kb2))

        assert(test($({ subject: 'door-opening-event#1', isPossibleFor: 'person#1' }).$, kb2))
    }
})


Deno.test({
    name: 'test18',
    fn: () => {
        const agent = 'person#1'
        const q = $({ subject: 'e:event', isPossibleFor: agent })
        const result = findAll(q.$, [$('e:event').$], kb)
        assert(result.length === 1)
        assertEquals(result[0].get($('e:event').$)?.value, 'move-event#1')
    }
})

Deno.test({
    name: 'test19',
    fn: () => {
        const goal = $('door#1').has('open').as('state')
        const agent = 'person#1'
        const seq: `${string}:${string}`[] = ['e1:event', 'e2:event']
        const q = $({ subject: seq, isPossibleSeqFor: agent }).and(goal.after(seq))
        const seqVars = seq.map(x => $(x).$)
        const result = findAll(q.$, seqVars, kb)
        assertEquals(result[0].get($('e1:event').$)?.value, 'move-event#1')
        assertEquals(result[0].get($('e2:event').$)?.value, 'door-opening-event#1')
    }
})

Deno.test({
    name: 'test20',
    fn: () => {
        console.log(getParts('person', kb.wm))
        console.log(getParts('birth-event', kb.wm))
        console.log(getParts('multiple-birth-event', kb.wm))

        const q = $({ vr: 'vr:value-restriction', part: 'mother', ofConcept: 'birth-event', isA: 'value:thing' })
        const result = findAll(q.$, [$('vr:value-restriction').$, $('value:thing').$], kb)
        console.log(result[0].get($('value:thing').$))

        console.log(getParts('move-event', kb.wm))
        console.log(getParts('agent', kb.wm))
        console.log(getParts('door', kb.wm))
        // console.log(getAtoms($('door#1').has('open').as('state').$))

    }
})

Deno.test({
    name: 'test21',
    fn: () => {
        assert(test($({ subject: 'agent#007', isNear: 'door#44' }).isNotTheCase.$, kb))
        const kb2 = recomputeKb(['move-event#3'], kb)
        console.log(kb2.wm)
        const results = findAll($('agent#007').has('x:thing').as('position').$, [$('x:thing').$], kb2)
        assert(results.length === 1)
        assertEquals(results[0].get($('x:thing').$)?.value, 1)
        assert(test($({ subject: 'agent#007', isNear: 'door#44' }).$, kb2))

        // console.log($({moveEvent:'move-event#42', subject:'agent#007', destination:'door#1'}).dump(kb.derivClauses))
    }
})