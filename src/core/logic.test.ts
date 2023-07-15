import { assert, assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $, ExpBuilder } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { tell } from "./tell.ts";
import { ask } from "./ask.ts";
import { DerivationClause, Formula, KnowledgeBase } from "./types.ts";
import { WorldModel } from "./types.ts";
import { getStandardKb } from "./prelude.ts";
import { evaluate } from "./evaluate.ts";
import { solve } from "./solve.ts";
import { subst } from "./subst.ts";

const standardKb = getStandardKb()

const derivationClauses: DerivationClause[] = [

    ...standardKb.derivClauses,

    $('x:dude').isa('dude').when($('x:dude').isa('person')).$,

    $('x:person').has('c:city').as('birth-city').when(
        $('e:event').exists.where($('y:space-point').exists.where(
            $('y:space-point').has('c:city').as('enclosing-city')
                .and($('e:event').has('y:space-point').as('location'))
                .and($('x:person').has('e:event').as('birth'))
        ))
    ).$,

    $('d:door').has('z:state').as('state').after(['e:event']).when(
        $('z:state').equals('open').if($('e:event').isa('door-opening-event').and($('e:event').has('d:door').as('object')))
            .else($('z:state').equals('closed').if($('e:event').isa('door-closing-event').and($('e:event').has('d:door').as('object'))))
    ).$,

    $({ subject: 'x:thing', isSmallerThan: 'y:thing' }).when(
        $('y:thing').isGreaterThan('x:thing')
    ).$,

    $('x:agent').has('p:number').as('position').after(['e:event']).when(
        $(true).if(
            $('d:thing').exists.where(
                $('e:event').has('d:thing').as('destination')
                    .and($('d:thing').has('p:number').as('position'))
            ).and($('e:event').isa('move-event'))
                .and($('e:event').has('x:agent').as('subject'))
        )
    ).$,

    $({ subject: 'e:move-event', verb: 'be', object: 'possible', beneficiary: 'a:agent' })
        .when(
            $('e:move-event').isa('move-event')
                .and($('e:move-event').has('a:agent').as('subject'))
        ).$,

    $({ subject: 'e:door-opening-event', verb: 'be', object: 'possible', beneficiary: 'a:agent' })
        .when(
            $('d:door').exists.where(
                $('e:door-opening-event').has('d:door').as('object')
                    .and($({ subject: 'a:agent', isNear: 'd:door' }))
                    .and($('d:door').has('closed').as('state'))
            )
        ).$,

    $({ subject: 'x:thing', isNear: 'y:thing' }).when(
        $('p1:number').exists.where($('p2:number').exists.where(
            $('x:thing').has('p1:number').as('position')
                .and($('y:thing').has('p2:number').as('position'))
                .and($('p1:number').equals('p2:number'))
        ))
    ).$,

    $({ isMoveEvent: 'e:move-event', subject: 'x:agent', destination: 'y:thing', }).when(
        $('e:move-event').isa('move-event')
            .and($('e:move-event').has('y:thing').as('destination'))
            .and($('e:move-event').has('x:agent').as('subject'))
    ).$,

]

const model: WorldModel =

    /* World Model */
    $('event#1').isa('birth-event')
        .and($('event#1').has('person#1').as('baby'))
        .and($('event#1').has('person#2').as('mother'))
        .and($('event#1').has('time-point#1').as('time'))
        .and($('event#1').has('space-point#1').as('location'))
        .and($('space-point#1').has('boston').as('enclosing-city'))
        .and($('person#1').has('event#1').as('birth'))
        .and($('person#1').has('event#1').as('birth'))
        .and($('person#1').has('event#1').as('birth'))
        .and($('person#2').isa('woman'))
        .and($('person#1').isa('person'))
        .and($('boston').isa('city'))
        .and($('space-point#1').isa('space-point'))
        .and($('door#1').isa('door'))
        .and($('door-opening-event#1').isa('door-opening-event'))
        .and($('door-opening-event#1').has('door#1').as('object'))
        .and($('door-closing-event#1').isa('door-closing-event'))
        .and($('door-closing-event#1').has('door#1').as('object'))
        .and($('person#3').isa('person'))
        .and($('person#3').has(5).as('position'))
        .and($('door#1').has(5).as('position'))
        .and($({ isMoveEvent: 'move-event#1', subject: 'person#1', destination: 'door#1' }))
        .and($('door#1').has('closed').as('state'))
        .and($('agent#007').isa('agent'))
        .and($('agent#007').has(2).as('position'))
        .and($('door#44').has(1).as('position'))
        .and($({ isMoveEvent: 'move-event#3', subject: 'agent#007', destination: 'door#44' }))

        /* Conceptual Model */
        .and($({ subject: 'birth-event', modal: 'can', verb: 'have', object: 'mother' }))
        .and($({ subject: 'birth-event', modal: 'can', verb: 'have', object: 'baby' }))
        .and($({ subject: 'birth-event', modal: 'can', verb: 'have', object: 'time' }))
        .and($({ subject: 'birth-event', modal: 'can', verb: 'have', object: 'location' }))
        .and($({ annotation: 'vr#1', subject: 'mother', owner: 'birth-event', verb: 'be', object: 'woman' }))
        .and($({ annotation: 'nr#1', subject: 'mother', owner: 'birth-event', verb: 'amount', recipient: 1 }))
        .and($({ annotation: 'nr#2', subject: 'baby', owner: 'birth-event', verb: 'amount', recipient: 1 }))
        .and($({ subject: 'person', modal: 'can', verb: 'have', object: 'birth' }))
        .and($({ annotation: 'vr#2', subject: 'birth', owner: 'person', verb: 'be', object: 'birth-event' }))
        .and($({ subject: 'event', modal: 'can', verb: 'have', object: 'duration' }))
        .and($({ annotation: 'ann#41', subject: 'nr#2', verb: 'be', object: 'cancelled', ablative: 'multiple-birth-event' }))
        .and($({ subject: 'agent', modal: 'can', verb: 'have', object: 'movement' }))
        .and($({ annotation: 'vr#43', subject: 'movement', owner: 'agent', verb: 'be', object: 'move-event' }))
        .and($({ subject: 'door-opening-event', modal: 'can', verb: 'have', object: 'object' }))
        .and($({ subject: 'move-event', modal: 'can', verb: 'have', object: 'destination' }))
        .and($({ subject: 'door', modal: 'can', verb: 'have', object: 'opening' }))
        .and($({ annotation: 'vr#21', subject: 'opening', owner: 'door', verb: 'be', object: 'door-opening-event' }))
        .and($({ annotation: 'ann#24', subject: 'open', verb: 'exclude', object: 'closed', location: 'state', owner: 'door' }))
        .and($({ ann: 'ann#4923', onlyHaveOneOf: 'position', onConcept: 'thing' }))
        .and($({ subject: 'thing', modal: 'can', verb: 'have', object: 'x-coordinate' }))
        .and($({ annotation: 'ann#521', subject: 'x-coordinate', owner: 'thing', verb: 'default', recipient: 100 }))
        .and($({ ann: 'ann#9126', concept: 'cat', excludes: 'dog' }))

        .and($({ subject: 'agent', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'open', verb: 'extend', object: 'state' }))
        .and($({ subject: 'closed', verb: 'extend', object: 'state' }))
        .and($({ subject: 'state', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'person', verb: 'extend', object: 'agent' }))
        .and($({ subject: 'woman', verb: 'extend', object: 'person' }))
        .and($({ subject: 'woman', verb: 'extend', object: 'person' }))
        .and($({ subject: 'event', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'door-opening-event', verb: 'extend', object: 'event' }))
        .and($({ subject: 'birth-event', verb: 'extend', object: 'event' }))
        .and($({ subject: 'time-instant', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'point-in-space', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'city', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'multiple-birth-event', verb: 'extend', object: 'birth-event' }))
        .and($({ subject: 'move-event', verb: 'extend', object: 'event' }))
        .and($({ subject: 'door', verb: 'extend', object: 'thing' }))
        .and($({ subject: 'door', verb: 'extend', object: 'thing' }))
        .dump(derivationClauses).kb.wm


const kb: KnowledgeBase = {
    wm: [...standardKb.wm, ...model],
    derivClauses: derivationClauses,
    deicticDict: standardKb.deicticDict,
}

Deno.test({
    name: 'test1',
    fn: () => {
        const f = $('person#2').isa('person').$
        assert(ask(f, kb).result.value)
    }
})

Deno.test({
    name: 'test2',
    fn: () => {

        const yes = $('person#2').isa('dude').$
        const no = $('person#2').isa('anythingelse').isNotTheCase.$

        assert(ask(yes, kb).result.value)
        assert(ask(no, kb).result.value)
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
        const query = $('person#1').has('boston').as('birth-city').$
        assert(ask(query, kb).result.value)
    }
})

Deno.test({
    name: 'test5',
    fn: () => {

        const ok = $('door#1').has('open').as('state').after(['door-opening-event#1']).$
        const ok2 = $('door#1').has('closed').as('state').after(['door-closing-event#1']).$

        assert(ask(ok, kb).result.value)
        assert(ask(ok2, kb).result.value)

    }
})

Deno.test({
    name: 'test7',
    fn: () => {
        assert(ask($(2).isGreaterThan(1).$, $.emptyKb).result.value)
    }
})

Deno.test({
    name: 'test8',
    fn: () => {
        assert(ask($({ subject: 1, isSmallerThan: 2 }).$, kb).result.value)
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
            .dump().kb.wm

        const test1 = $({ subject: 'bucket#1', isLargerThan: 'apple#1' }).$
        const test2 = $({ subject: 'apple#1', isLargerThan: 'bucket#1' }).isNotTheCase.$

        assert(ask(test1, { wm: wm, derivClauses: dc, deicticDict: {}, }).result.value)
        assert(ask(test2, { wm: wm, derivClauses: dc, deicticDict: {}, }).result.value)

    }
})

Deno.test({
    name: 'test10',
    fn: () => {

        const x = ask($('x:thing').exists.where(
            $({ annotation: 'x:thing', subject: 'open', verb: 'exclude', object: 'closed', location: 'state', owner: 'door' })
        ).$, kb)

        assert(x.result.value)

    }
})

Deno.test({
    name: 'test11',
    fn: () => {

        const res1 = tell($('door-opening-event#1').happens.$, kb).kb
        const res2 = tell($('door-closing-event#1').happens.$, res1).kb

        assert(ask($('door#1').has('closed').as('state').$, res2).result.value)
        assert(ask($('door#1').has('open').as('state').isNotTheCase.$, res2).result.value)
    }
})

Deno.test({
    name: 'test12',
    fn: () => {
        assert(ask($('door#1').has('closed').as('state').$, kb).result.value)
        const f1 = $({ subject: 'door-opening-event#1', verb: 'be', object: 'possible', beneficiary: 'person#3' })
        const f2 = $({ subject: 'door-opening-event#1', verb: 'be', object: 'possible', beneficiary: 'person#2' }).isNotTheCase

        assert(ask(f1.$, kb).result.value)
        assert(ask(f2.$, kb).result.value)
        const f3 = $('door#1').has('open').as('state').after(['door-opening-event#1'])
        assert(ask(f3.$, kb).result.value)
    }
})

Deno.test({
    name: 'test13',
    fn: () => {
        // the empty sequence of actions (events) is always possible for any agent
        const f1 = $({ subject: [], verb: 'be', object: 'possible-sequence', beneficiary: 'person#1' })

        assert(ask(f1.$, kb).result.value)
    }
})

Deno.test({
    name: 'test14',
    fn: () => {
        const f1 = $({ subject: ['door-opening-event#1'], verb: 'be', object: 'possible-sequence', beneficiary: 'person#3' })
        assert(ask(f1.$, kb).result.value)
    }
})

Deno.test({
    name: 'test15',
    fn: () => {

        const f2 = $({ subject: ['door-opening-event#1'], verb: 'be', object: 'possible-sequence', beneficiary: 'person#3' })

        assert(ask(f2.$, kb).result.value)

        const f1 = $({ subject: 'e:event', verb: 'be', object: 'possible', beneficiary: 'person#3' })

        const result = findAll(f1.$, [$('e:event').$], kb)
        assert(result[0].get($('e:event').$)?.value === 'door-opening-event#1')

        const f3 = $({ subject: ['e:event'], verb: 'be', object: 'possible-sequence', beneficiary: 'person#3' })

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

    const q = $({ subject: ['e:event'], verb: 'be', object: 'possible-sequence', beneficiary: agent })
        .and(goal.after(['e:event']))

    const result = findAll(q.$, [$('e:event').$], kb)

    return result

}

Deno.test({
    name: 'test17',
    fn: () => {
        assert(!ask($({ subject: 'person#1', isNear: 'door#1' }).$, kb).result.value)
        assert(!ask($({ subject: 'door-opening-event#1', verb: 'be', object: 'possible', beneficiary: 'person#1' }).$, kb).result.value)
        assert(!ask($({ subject: 'door-opening-event#1', verb: 'be', object: 'possible', beneficiary: 'person#1' }).$, kb).result.value)


        const kb2 = tell($('move-event#1').happens.$, kb).kb

        assert(ask($({ subject: 'person#1', isNear: 'door#1' }).$, kb2).result.value)
        assert(ask($({ subject: 'door-opening-event#1', verb: 'be', object: 'possible', beneficiary: 'person#1' }).$, kb2).result.value)


    }
})


Deno.test({
    name: 'test18',
    fn: () => {
        const agent = 'person#1'
        const q = $({ subject: 'e:event', verb: 'be', object: 'possible', beneficiary: agent })
        const result = findAll(q.$, [$('e:event').$], kb)
        assert(result.length === 1)
        assertEquals(result[0].get($('e:event').$)?.value, 'move-event#1')
    }
})

Deno.test({
    name: 'test21',
    fn: () => {
        assert(ask($({ subject: 'agent#007', isNear: 'door#44' }).isNotTheCase.$, kb).result.value)
        const kb2 = tell($('move-event#3').happens.$, kb).kb
        const results = findAll($('agent#007').has('x:thing').as('position').$, [$('x:thing').$], kb2)
        assert(results.length === 1)
        assertEquals(results[0].get($('x:thing').$)?.value, 1)
        assert(ask($({ subject: 'agent#007', isNear: 'door#44' }).$, kb2).result.value)
    }
})


Deno.test({
    name: 'test23',
    fn: () => {
        const kb2 = $('cat#1').has(3).as('weight')
            .and($('dog#1').has(4).as('weight'))
            .and($('cat#1').isa('cat'))
            .and($('dog#1').isa('dog'))
            .dump().kb

        // ((the number such that (the cat has the number as weight)) is (3))
        const x = $('x:number').suchThat($('c:cat').suchThat().has('x:number').as('weight')).equals(3).$
        assert(ask(x, kb2).result.value)
    }
})


Deno.test({
    name: 'test24',
    fn: () => {
        const q = $(1).plus(2).$
        assertEquals(ask(q, kb).result, $(3).$)
    }
})

Deno.test({
    name: 'test25',
    fn: () => {

        const kb = $(1).isa('number')
            .and($(2).isa('number'))
            .dump().kb.wm

        const q = $('x:number').plus('y:number').equals(3).$

        const res = findAll(q, [$('x:number').$, $('y:number').$], { wm: kb, derivClauses: [], deicticDict: {}, })
        assertEquals(res[0].get($('x:number').$), $(1).$)
        assertEquals(res[0].get($('y:number').$), $(2).$)

    }
})

Deno.test({
    name: 'test26',
    fn: () => {
        assertEquals(ask($(3).plus(3).$, kb).result, $(6).$)
        assertEquals(ask($(3).minus(3).$, kb).result, $(0).$)
        assertEquals(ask($(3).times(3).$, kb).result, $(9).$)
        assertEquals(ask($(3).over(3).$, kb).result, $(1).$)
    }
})

Deno.test({
    name: 'test27',
    fn: () => {

        const wm =
            $({ ann: 'ann#429', onlyHaveOneOf: 'last-thought-of', onConcept: 'thing' })
                .and($('capra#1').has(1).as('last-thought-of'))
                .dump(kb.derivClauses).kb.wm

        const kb2: KnowledgeBase = { wm: wm, derivClauses: kb.derivClauses, deicticDict: kb.deicticDict }

        const kb3 = tell($('capra#1').has(2).as('last-thought-of').$, kb2).kb

        assert(findAll($('capra#1').has('x:thing').as('last-thought-of').$, [$('x:thing').$], kb3).length === 1)

    }
})


Deno.test({
    name: 'test28',
    fn: () => {
        const kb =
            $('cat#2').isa('cat')
                .and($('cat#3').isa('cat'))
                .and($('cat#1').isa('cat'))
                .and($('cat#1').has('big').as('size'))
                .and($('cat#4').isa('cat'))
                .dump().kb

        const command = $('x:cat').suchThat().has('black').as('color').if($('cat#1').has('big').as('size'))

        const kb2 = tell(command.$, kb).kb

        assert(ask($('x:cat').suchThat().has('black').as('color').$, kb2).result.value)

    }
})

Deno.test({
    name: 'test29',
    fn: () => {
        const q = $('x:cat').exists.where($('x:cat').has('red').as('color'))
        const kb2 = tell(q.$, $.emptyKb).kb
        assert(ask(q.$, kb2).result.value)
    }
})

Deno.test({
    name: 'test30',
    fn: () => {
        const q = $('cat#1').isa('feline')
        const results0 = evaluate(q.ask.$, kb)
        assert(!results0.result.value)
        const results1 = evaluate(q.tell.$, kb)
        const results2 = evaluate(q.ask.$, results1.kb)
        assert(results2.result.value)
    }
})

Deno.test({
    name: 'test31',
    fn: () => {
        // transitivity of inheritance relationships

        const kb = $({ subject: 'capra', verb: 'extend', object: 'mammal' })
            .and($({ subject: 'mammal', verb: 'extend', object: 'animal' }))
            .dump(derivationClauses).kb

        assert(ask($({ subject: 'capra', verb: 'extend', object: 'animal' }).$, kb).result.value)
    }
})

Deno.test({
    name: 'test32',
    fn: () => {
        // recomputeKb with negation
        const q = $('cat#1').has('red').as('color')
        const kb1 = q.dump().kb
        assert(ask(q.$, kb1))
        const result = tell(q.isNotTheCase.$, kb1)
        const kb2 = result.kb
        assert(ask(q.isNotTheCase.$, kb2).result.value)
    }
})

Deno.test({
    name: 'test33',
    fn: () => {
        // string literals
        const x = $('"ciao mondo"')
        assertEquals(x.$.type, 'string')
        assert(ask(x.equals('"ciao mondo"').$, kb).result.value)
        assert(ask(x.equals('"ciaomondo"').isNotTheCase.$, kb).result.value)
    }
})

Deno.test({
    name: 'test34',
    fn: () => {
        const result = evaluate($('x:thing').exists.tell.$, kb)
        const check = evaluate($('x:thing').exists.where($('x:thing').has(100).as('x-coordinate')).ask.$, result.kb)
        assert(check)
    }
})

Deno.test({
    name: 'test35',
    fn: () => {
        // better anaphora test
        const kb0: KnowledgeBase = { ...kb, deicticDict: {} }
        const { result: result0, kb: kb1 } = ask($.the('agent').$, kb0)
        assertEquals(Object.values(kb1.deicticDict).length, 1)
        const { result: result1, kb: kb2 } = ask($.the('agent').$, kb1)
        assertEquals(result1, result0)
        const { result: result2, kb: kb3 } = ask($.the('thing').$, kb2)
        assertEquals(result2, result1)
        const { result: result3, kb: kb4 } = ask($.the('door').$, kb3)
        assertEquals(Object.values(kb4.deicticDict).length, 2)
        const { result: result4, kb: _ } = ask($.the('thing').$, kb4)
        assertEquals(result3, result4)
    }
})


Deno.test({
    name: 'test36',
    fn: () => {
        // where should override defaults
        const result = evaluate($('x:thing').exists.where($('x:thing').has(200).as('x-coordinate')).tell.$, kb)
        const result1 = findAll($('x:thing').has('n:number').as('x-coordinate').$, [$('x:thing').$, $('n:number').$], result.kb)
        assert(result1.length === 1)
        assertEquals(result1[0].get($('n:number').$), $(200).$)
    }
})

Deno.test({
    name: 'test37',
    fn: () => {
        // anaphora with freshly calculated numbers
        const results = evaluate($(1).plus(1).$, kb)
        assertEquals(evaluate($.the('number').ask.$, results.kb).result, $(2).$)
    }
})

Deno.test({
    name: 'test38',
    fn: () => {
        // mutex concepts test
        const kb0 = tell($('mammal#1').isa('cat').$, kb).kb
        const kb1 = tell($('mammal#1').isa('dog').$, kb0).kb
        assert(ask($('mammal#1').isa('cat').isNotTheCase.$, kb1))
        assert(ask($('mammal#1').isa('dog').$, kb1))
        const kb2 = tell($('mammal#1').isa('cat').$, kb0).kb
        assert(ask($('mammal#1').isa('dog').isNotTheCase.$, kb2))
        assert(ask($('mammal#1').isa('cat').$, kb2))
    }
})

Deno.test({
    name: 'test39',
    fn: () => {
        // linear equations solver
        assertEquals(solve($('x:number').times(2).plus(1).equals(2).$), $(1 / 2).$)
        assertEquals(solve($('x:number').over(2).equals(100).$), $(200).$)
        assertEquals(solve($('x:number').over(2).plus(1).equals(3).$), $(4).$)
        assertEquals(solve($('x:number').minus(2).equals(3).$), $(5).$)
    }
})

Deno.test({
    name: 'test40',
    fn: () => {
        // linear equations solver
        const x = ask($.the('number').which($._.over(2).equals(100)).$, kb).result
        assertEquals(x, $(200).$)
    }
})


Deno.test({
    name: 'test41',
    fn: () => {
        // syntactic de/compression
        const r1 = ask($('person#1').and('person#3').isa('person').$, kb)
        assert(r1.result.value)
        const r2 = ask($('person#1').and('door#1').isa('person').$, kb)
        assert(!r2.result.value)
        // const r3 = tell($('cat#1').and('cat#2').isa('cat').$, kb).additions
        // console.log(r3)
        const r4 = ask($('person#1').isa($('person').and('agent').$).$, kb).result
        assert(r4.value)
        const r5 = ask($('door#1').isa($('thing').and('agent').$).$, kb).result
        assert(!r5.value)
        const r6 = ask($('person#1').and('person#2').and('person#3').isa('agent').$, kb).result
        assert(r6.value)
        const r7 = ask($('person#1').or('door#1').isa('agent').$, kb).result
        assert(r7.value)
        const r8 = ask($('boston').or('door#1').isa('agent').$, kb).result
        assert(!r8.value)
        const r9 = ask($('door#1').isa($('door').or('agent')).$, kb).result
        assert(r9.value)

    }
})

Deno.test({
    name: 'test43',
    fn: () => {
        // has-formula query without specifying as-clause

        const x = $('capra#1').has('fur#1').as('fur')
            .and($('capra#1').has('hoof#1').as('hoof'))
            .and($('capra#2').has('fur#2').as('fur'))
            .dump().kb

        assert(ask($('capra#1').has('fur#1').$, x).result.value)
        assert(!ask($('capra#1').has('fur#2').$, x).result.value)
        assert(ask($('capra#2').has('fur#2').$, x).result.value)
    }
})


Deno.test({
    name: 'test44',
    fn: () => {
        // whose-clause in anaphor
        const kb0 = $('house#1').isa('house')
            .and($('house#2').isa('house'))
            .and($('house#1').has('window#1').as('window'))
            .and($('window#1').isa('window'))
            .and($('window#1').has('open').as('state'))
            .and($('house#2').has('window#2').as('window'))
            .and($('window#2').isa('window'))
            .and($('window#2').has('closed').as('state'))
            .dump().kb

        const q = $.the('house').whose($('window').has('open').as('state')).$
        const result = ask(q, kb0).result
        assertEquals(result, $('house#1').$)

        const q2 = $.the('house').whose($('window').has('closed').as('state')).$
        const result2 = ask(q2, kb0).result
        assertEquals(result2, $('house#2').$)

    }
})

Deno.test({
    name: 'test45',
    fn: () => {
        // which-clause in anaphor
        const kb0 = $('cat#1').isa('cat')
            .and($('cat#2').isa('cat'))
            .and($('cat#1').has('red').as('color'))
            .and($('cat#2').has('black').as('color'))
            .dump().kb

        const q = $.the('cat').which($._.has('red').as('color')).$
        const result = ask(q, kb0).result
        assertEquals(result, $('cat#1').$)
    }
})

Deno.test({
    name: 'test46',
    fn: () => {
        const x = $.the('cat').isa('feline').$
        const y = subst(x, [$.the('cat').$, $('x:cat').$])

        assertEquals(y, $('x:cat').isa('feline').$)
    }
})

Deno.test({
    name: 'test47',
    fn: () => {
        // creation of new thing via existquant+ANAPHOR
        const kb0 = $.emptyKb
        const kb1 = tell($.a('cat').whose($('fur').has('red').as('color')).exists.$, kb0).kb
        const result = ask($.a('cat').whose($('fur').has('red').as('color')).exists.$, kb1).result.value
        assert(result)
    }
})

Deno.test({
    name: 'test48',
    fn: () => {

        const kb0 = $.a('cat').whose($('fur').has('red').as('color')).exists
            .and($.a('cat').whose($('fur').has('black').as('color')).exists)
            .dump().kb

        const kb1 = tell($.the('cat').whose($('fur').has('red').as('color')).has(1).as('hunger')
            .and($.the('cat').whose($('fur').has('black').as('color')).has(1).as('hunger')).$, kb0).kb

        const dc =
            $({ subject: $.a('cat').whose($('fur').has('red').as('color')).$, verb: 'be', object: 'hungry' })
                .when($.the('cat').has(1).as('hunger')).$

        const kb2 = tell(dc, kb1).kb

        const statement1 = $({ subject: $.a('cat').whose($('fur').has('red').as('color')).$, verb: 'be', object: 'hungry' }).$
        const statement2 = $({ subject: $.a('cat').whose($('fur').has('black').as('color')).$, verb: 'be', object: 'hungry' }).$

        const result1 = ask(statement1, kb2).result.value
        const result2 = ask(statement2, kb2).result.value
        assert(result1)
        assert(!result2)

    }
})

Deno.test({
    name: 'test49',
    fn: () => {

        const dc = $('p:panel').has('n:number').as('max-x').when(
            $('n:number')
                .equals($('y:number').suchThat($('p:panel').has('y:number').as('width'))
                    .plus($('z:number').suchThat($('p:panel').has('z:number').as('x-coord'))))
        )

        const kb = $.the('panel').which($._.has(30).as('x-coord')).exists.dump().kb
        const kb2 = tell($.the('panel').has(100).as('width').$, kb).kb
        const kb3 = tell(dc.$, kb2).kb

        const q = $('p:panel').suchThat().has(130).as('max-x').$
        const result = ask(q, kb3).result
        assert(result.value)

        const q2 = $('n:number').suchThat($('p:panel').suchThat().has('n:number').as('max-x')).$
        const result2 = ask(q2, kb3).result
        assertEquals(result2, $(130).$)

    }
})

Deno.test({
    name: 'test19',
    fn: () => {
        const goal = $('door#1').has('open').as('state')
        const agent = 'person#1'
        const seq: `${string}:${string}`[] = ['e1:event', 'e2:event']
        const q = $({ subject: seq, verb: 'be', object: 'possible-sequence', beneficiary: agent }).and(goal.after(seq))
        const seqVars = seq.map(x => $(x).$)
        const result = findAll(q.$, seqVars, kb)
        assertEquals(result[0].get($('e1:event').$)?.value, 'move-event#1')
        assertEquals(result[0].get($('e2:event').$)?.value, 'door-opening-event#1')
    }
})