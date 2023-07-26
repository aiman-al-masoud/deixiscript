import { assert, assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { tell } from "./tell.ts";
import { ask } from "./ask.ts";
import { DerivationClause, KnowledgeBase } from "./types.ts";
import { WorldModel } from "./types.ts";
import { getStandardKb } from "./prelude.ts";
import { evaluate } from "./evaluate.ts";
import { solve } from "./solve.ts";
import { subst } from "./subst.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { match } from "./match.ts";
import { deepMapOf } from "../utils/DeepMap.ts";

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

    $({ subject: 'x:thing', isSmallerThan: 'y:thing' }).when(
        $('y:thing').isGreaterThan('x:thing')
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
        .and($('person#3').isa('person'))
        .and($('person#3').has(5).as('position'))
        .and($('door#1').has(5).as('position'))

        /* Conceptual Model */
        .and($({ annotation: 'vr#1', subject: 'mother', owner: 'birth-event', verb: 'be', object: 'woman' }))
        .and($({ annotation: 'nr#1', subject: 'mother', owner: 'birth-event', verb: 'amount', recipient: 1 }))
        .and($({ annotation: 'nr#2', subject: 'baby', owner: 'birth-event', verb: 'amount', recipient: 1 }))
        .and($({ annotation: 'vr#2', subject: 'birth', owner: 'person', verb: 'be', object: 'birth-event' }))
        .and($({ annotation: 'ann#41', subject: 'nr#2', verb: 'be', object: 'cancelled', ablative: 'multiple-birth-event' }))
        .and($({ annotation: 'vr#43', subject: 'movement', owner: 'agent', verb: 'be', object: 'move-event' }))
        .and($({ annotation: 'vr#21', subject: 'opening', owner: 'door', verb: 'be', object: 'door-opening-event' }))
        .and($({ annotation: 'ann#24', subject: 'open', verb: 'exclude', object: 'closed', location: 'state', owner: 'door' }))
        .and($({ ann: 'ann#4923', onlyHaveOneOf: 'position', onConcept: 'thing' }))
        .and($({ ann: 'ann#9126', concept: 'cat', excludes: 'dog' }))

        .and($('birth-event').has('thing').as('mother'))
        .and($('birth-event').has('thing').as('baby'))
        .and($('birth-event').has('thing').as('time'))
        .and($('birth-event').has('thing').as('location'))
        .and($('person').has('thing').as('birth'))
        .and($('event').has('thing').as('duration'))
        .and($('agent').has('thing').as('movement'))
        .and($('door-opening-event').has('thing').as('object'))
        .and($('move-event').has('thing').as('destination'))
        .and($('door').has('thing').as('opening'))


        .and($('state').isa('thing'))
        .and($('agent').isa('thing'))
        .and($('event').isa('thing'))
        .and($('time-instant').isa('thing'))
        .and($('point-in-space').isa('thing'))
        .and($('city').isa('thing'))
        .and($('door').isa('thing'))
        .and($('open').isa('state'))
        .and($('closed').isa('state'))
        .and($('person').isa('agent'))
        .and($('woman').isa('person'))
        .and($('door-opening-event').isa('event'))
        .and($('door-closing-event').isa('event'))
        .and($('birth-event').isa('event'))
        .and($('multiple-birth-event').isa('birth-event'))
        .and($('move-event').isa('event'))
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
        const no = $('person#2').isa('somestuffidk').isNotTheCase.$

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
    name: 'test04',
    fn: () => {
        const query = $('person#1').has('boston').as('birth-city').$
        assert(ask(query, kb).result.value)
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

        // console.log(kb.wm.filter(isIsASentence).filter(x=>x[1]==='mutex-annotation'))

        const x = ask($('x:thing').exists.where(
            $({ annotation: 'x:thing', subject: 'open', verb: 'exclude', object: 'closed', location: 'state', owner: 'door' })
        ).$, kb)

        assert(x.result.value)

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
            .dump().kb

        const q = $('x:number').plus('y:number').equals(3).$

        const res = findAll(q, [$('x:number').$, $('y:number').$], kb)
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
        const kb = $('capra').isa('mammal').and($('mammal').isa('animal')).dump().kb
        assert(ask($('capra').isa('animal').$, kb).result.value)
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
        // defaults
        const kb =
            $('point').has(100).as('x-coordinate')
                .dump(derivationClauses)
                .kb

        const result = tell($.a('point').exists.$, kb)

        const check = ask(
            $.the('point').which($._.has(100).as('x-coordinate')).exists.$,
            result.kb,
        ).result.value

        assert(check)
    }
})

Deno.test({
    name: 'test36',
    fn: () => {
        // "where" should override defaults
        const kb =
            $('point').has(100).as('x-coordinate')
                .dump(derivationClauses)
                .kb

        const result = evaluate($('x:point').exists.where($('x:point').has(200).as('x-coordinate')).tell.$, kb)

        assert(ask($.the('point').has(200).as('x-coordinate').$, result.kb).result.value)
        assert(!ask($.the('point').has(100).as('x-coordinate').$, result.kb).result.value)

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
        assert(ask($('mammal#1').isa('cat').isNotTheCase.$, kb1).result.value)
        assert(ask($('mammal#1').isa('dog').$, kb1).result.value)
        const kb2 = tell($('mammal#1').isa('cat').$, kb0).kb
        assert(ask($('mammal#1').isa('dog').isNotTheCase.$, kb2).result.value)
        assert(ask($('mammal#1').isa('cat').$, kb2).result.value)
    }
})

Deno.test({
    name: 'test39',
    fn: () => {
        // linear equation solver
        assertEquals(solve($('x:number').times(2).plus(1).equals(2).$, $.emptyKb), $(1 / 2).$)
        assertEquals(solve($('x:number').over(2).equals(100).$, $.emptyKb), $(200).$)
        assertEquals(solve($('x:number').over(2).plus(1).equals(3).$, $.emptyKb), $(4).$)
        assertEquals(solve($('x:number').minus(2).equals(3).$, $.emptyKb), $(5).$)
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

        // console.log('redcat=',ask($.a('cat').whose($('fur').has('red').as('color')).$, kb2).result)
        // console.log('blackcat=',ask($.a('cat').whose($('fur').has('black').as('color')).$, kb2).result)


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

        const q3 = $.the('number').which($('p:panel').suchThat().has($._.$).as('max-x')).$

        const result3 = ask(q3, kb3).result
        assertEquals(result3, $(130).$)

        const q4 = $.the('number').which($.the('panel').has($._.$).as('max-x')).$
        const result4 = ask(q4, kb3).result
        assertEquals(result4, $(130).$)

    }
})

Deno.test({
    name: 'test50',
    fn: () => {
        const kb = $.a('cat').which($._.has(3).as('position')).exists.dump().kb
        const q = $.the('position').of($.the('cat').$).$
        const result = ask(q, kb).result
        assertEquals(result, $(3).$)
    }
})

Deno.test({
    name: 'test52',
    fn: () => {

        const maxX = $.a('panel').has($.a('number')).as('max-x').when(
            $.the('number').equals($.the('width').of($.the('panel').$).plus($.the('x-coord').of($.the('panel').$)))
        ).$

        const maxY = $.a('panel').has($.a('number')).as('max-y').when(
            $.the('number').equals($.the('height').of($.the('panel').$).plus($.the('y-coord').of($.the('panel').$)))
        ).$

        const parent = $('p1:panel').has('p2:panel').as('parent').when(
            $.the('x-coord').of('p1:panel').isLessThanOrEqual($.the('x-coord').of('p2:panel').plus($.the('width').of('p2:panel')))
                .and($.the('x-coord').of('p1:panel').isGreaterThanOrEqual($.the('x-coord').of('p2:panel')))
                .and($.the('y-coord').of('p1:panel').isLessThanOrEqual($.the('y-coord').of('p2:panel').plus($.the('height').of('p2:panel'))))
                .and($.the('y-coord').of('p1:panel').isGreaterThanOrEqual($.the('y-coord').of('p2:panel').$))
                .and($.the('z-index').of('p1:panel').isGreaterThan($.the('z-index').of('p2:panel')))
        ).$

        const kb = $('panel#1').isa('panel')
            .and($('panel#1').has(20).as('x-coord'))
            .and($('panel#1').has(10).as('y-coord'))
            .and($('panel#1').has(1).as('z-index'))
            .and($('panel#1').has(5).as('width'))
            .and($('panel#1').has(4).as('height'))
            .and($('panel#2').isa('panel'))
            .and($('panel#2').has(10).as('x-coord'))
            .and($('panel#2').has(5).as('y-coord'))
            .and($('panel#2').has(0).as('z-index'))
            .and($('panel#2').has(10).as('width'))
            .and($('panel#2').has(10).as('height'))
            .and(maxX)
            .and(maxY)
            .and(parent)
            .dump().kb

        assertEquals(ask($.the('max-x').of('panel#2').$, kb).result, $(20).$)
        assertEquals(ask($.the('max-x').of('panel#1').$, kb).result, $(25).$)

        assertEquals(ask($.the('max-y').of('panel#2').$, kb).result, $(15).$)
        assertEquals(ask($.the('max-y').of('panel#1').$, kb).result, $(14).$)

    }
})


Deno.test({
    name: 'test53',
    fn: () => {

        const parent = $('p1:panel').has('p2:panel').as('parent').when(
            $.the('x-coord').of('p1:panel').isLessThanOrEqual($.the('x-coord').of('p2:panel').plus($.the('width').of('p2:panel')))
                .and($.the('x-coord').of('p1:panel').isGreaterThanOrEqual($.the('x-coord').of('p2:panel')))
                .and($.the('y-coord').of('p1:panel').isLessThanOrEqual($.the('y-coord').of('p2:panel').plus($.the('height').of('p2:panel'))))
                .and($.the('y-coord').of('p1:panel').isGreaterThanOrEqual($.the('y-coord').of('p2:panel').$))
                .and($.the('z-index').of('p1:panel').isGreaterThan($.the('z-index').of('p2:panel')))
        ).$

        const kb = $('panel#1').isa('panel')
            .and($('panel#1').has(20).as('x-coord'))
            .and($('panel#1').has(10).as('y-coord'))
            .and($('panel#1').has(1).as('z-index'))
            .and($('panel#1').has(5).as('width'))
            .and($('panel#1').has(4).as('height'))
            .and($('panel#2').isa('panel'))
            .and($('panel#2').has(10).as('x-coord'))
            .and($('panel#2').has(5).as('y-coord'))
            .and($('panel#2').has(0).as('z-index'))
            .and($('panel#2').has(10).as('width'))
            .and($('panel#2').has(10).as('height'))
            .and(parent)
            .dump().kb

        assert(ask($('panel#1').has('panel#2').as('parent').$, kb).result.value)
        assert(!ask($('panel#2').has('panel#1').as('parent').$, kb).result.value)

    }
})










Deno.test({
    name: 'test54',
    fn: () => {

        const maxX = $.a('panel').has($.a('number')).as('max-x').when(
            $.the('number').equals($.the('width').of($.the('panel').$).plus($.the('x-coord').of($.the('panel').$)))
        ).$

        const maxY = $.a('panel').has($.a('number')).as('max-y').when(
            $.the('number').equals($.the('height').of($.the('panel').$).plus($.the('y-coord').of($.the('panel').$)))
        ).$

        const parent = $('p1:panel').has('p2:panel').as('parent').when(
            $.the('x-coord').of('p1:panel').isLessThanOrEqual($.the('max-x').of('p2:panel').$)
                .and($.the('x-coord').of('p1:panel').isGreaterThanOrEqual($.the('x-coord').of('p2:panel').$))
                .and($.the('y-coord').of('p1:panel').isLessThanOrEqual($.the('max-y').of('p2:panel').$))
                .and($.the('y-coord').of('p1:panel').isGreaterThanOrEqual($.the('y-coord').of('p2:panel').$))
                .and($.the('z-index').of('p1:panel').isGreaterThan($.the('z-index').of('p2:panel')))
        ).$

        const kb = $('panel#1').isa('panel')
            .and($('panel#1').has(20).as('x-coord'))
            .and($('panel#1').has(10).as('y-coord'))
            .and($('panel#1').has(1).as('z-index'))
            .and($('panel#1').has(5).as('width'))
            .and($('panel#1').has(4).as('height'))
            .and($('panel#2').isa('panel'))
            .and($('panel#2').has(10).as('x-coord'))
            .and($('panel#2').has(5).as('y-coord'))
            .and($('panel#2').has(0).as('z-index'))
            .and($('panel#2').has(10).as('width'))
            .and($('panel#2').has(10).as('height'))
            .and(maxX)
            .and(maxY)
            .and(parent)
            .dump().kb

        assertEquals(ask($.the('max-x').of('panel#2').$, kb).result, $(20).$)
        assertEquals(ask($.the('max-x').of('panel#1').$, kb).result, $(25).$)

        assertEquals(ask($.the('max-y').of('panel#2').$, kb).result, $(15).$)
        assertEquals(ask($.the('max-y').of('panel#1').$, kb).result, $(14).$)

        assert(ask($('panel#1').has('panel#2').as('parent').$, kb).result.value)
        assert(!ask($('panel#2').has('panel#1').as('parent').$, kb).result.value)

    }
})

Deno.test({
    name: 'test55',
    fn: () => {
        // very basic superlative
        const kb = $(1).isa('number')
            .and($(2).isa('number'))
            .and($(5).isa('number'))
            .and($(3).isa('number'))
            .and($(4).isa('number'))
            .dump().kb

        const q = $('n:number')
            .suchThat($('m:number').exists.where($('m:number').isGreaterThan('n:number')).isNotTheCase).$

        const result = ask(q, kb).result
        assertEquals(result, $(5).$)
    }
})

Deno.test({
    name: 'test56',
    fn: () => {
        const result1 = ask($({ subject: 1, verb: 'be', object: 1 }).$, kb).result.value
        assert(result1)
        const result2 = ask($({ subject: 2, verb: 'be', object: 1 }).$, kb).result.value
        assert(!result2)
    }
})


Deno.test({
    name: 'test57',
    fn: () => {
        const dc = $('x:thing').is('c:color').when(
            $('x:thing').has('c:color').as('color')
        ).$

        const kb0 = tell(dc, $.emptyKb).kb
        const kb1 = tell($('red').and('green').isa('color').$, kb0).kb
        const kb2 = tell($('thing#1').is('red').$, kb1).kb
        const result0 = ask($('thing#1').has('red').as('color').$, kb2).result.value
        const result1 = ask($('thing#1').is('red').$, kb2).result.value
        const result2 = ask($('thing#1').has('black').as('color').isNotTheCase.$, kb2).result.value

        assert(result0)
        assert(result1)
        assert(result2)
    }
})

Deno.test({
    name: 'test58',
    fn: () => {

        const dc = $('x:capra').does('like')._('f:food').when(
            $('f:food').has('salt').as('condiment')
        ).$

        const kb =
            $('food#1').isa('food')
                .and($('food#2').isa('food'))
                .and($('capra#1').isa('capra'))
                .and($('food#1').has('salt').as('condiment'))
                .and(dc)
                .dump().kb

        assert(ask($.the('capra').does('like')._('food#1').$, kb).result.value)
        assert(!ask($.the('capra').does('like')._('food#2').$, kb).result.value)

    }
})

Deno.test({
    name: 'test59',
    fn: () => {
        const x = $.the('mouse').in('house#1').exists.$
        tell(x, $.emptyKb).kb

        const alt = $.the('mouse').which($._.has('house#1').as('location')).exists.$
        assertNotEquals(match(removeImplicit(x), removeImplicit(alt)), undefined)

    }
})

Deno.test({
    name: 'test60',
    fn: () => {
        // a variable is just a "special case" of arbitrary type
        const kb = $('cat#1').isa('cat').dump().kb
        assertEquals(ask($('x:cat').$, kb).result, $('cat#1').$)
    }
})

Deno.test({
    name: 'test61',
    fn: () => {

        const dc = $('screen#1').has('red').as('color').after($('x:button').has('down').as('state')).$

        const kb = $(dc)
            .and($('button#1').isa('button'))
            .dump().kb

        const a = $('button#1').has('down').as('state').$

        const result = tell(a, kb)
        assert(ask($('screen#1').has('red').as('color').$, result.kb).result.value)
    }
})

Deno.test({
    name: 'test62',
    fn: () => {

        const template = $('x:cat').has('red').as('color').$
        const f = $('y:dog').is('stupid').and($('cat#1').has('red').as('color')).$
        const map = match(template, f)
        assertEquals(map, deepMapOf([[$('x:cat').$, $('cat#1').$]]))
    }
})

Deno.test({
    name: 'test63',
    fn: () => {
        // pronouns as derivation clauses
        const kb =
            $('alice#1').isa('female')
                .and($('bob#1').isa('male'))
                // .and($('apple#1').isa('fruit'))
                // .and($('it').when('x:thing'))
                // .and($('it').when($('x:thing').suchThat($('x:thing').isa('male').isNotTheCase.and($('x:thing').isa('female').isNotTheCase))))
                .and($('he').when('x:male').$)
                .and($('she').when('x:female').$)
                .dump().kb

        assertEquals(ask($('she').$, kb).result, $('alice#1').$)
        assertEquals(ask($('he').$, kb).result, $('bob#1').$)
        // assertEquals(ask($('it').$, kb).result, $('apple#1').$)
    }
})

Deno.test({
    name: 'test64',
    fn: () => {

        const kb1 = $({ fibOf: 1 }).when(1)
            .and($({ fibOf: 2 }).when(1))

            .and($({ fibOf: 'x:number' }).when($({ fibOf: $('x:number').minus(1).$ }).plus($({ fibOf: $('x:number').minus(2).$ }))))
            .dump().kb

        assertEquals(
            ask($({ fibOf: 6 }).$, kb1).result,
            $(8).$
        )

        assertEquals(
            ask($({ fibOf: 7 }).$, kb1).result,
            $(13).$
        )

    }
})


Deno.test({
    name: 'test65',
    fn: () => {

        const kb = $('capra').has('stupid').as('friend')
            .and($('capra').has('stupid').as('brother'))
            .and($('capra').has('scemo').as('brother'))
            .and($('capra').has('cretino').as('friend'))
            .dump().kb

        const result = findAll(
            $('capra').has('x:thing').as('brother').and($('capra').has('x:thing').as('friend')).$,
            [$('x:thing').$],
            kb,
        )

        assertEquals(result.length, 1)
        assertEquals(result[0].get($('x:thing').$), $('stupid').$)
    }
})




Deno.test({
    name: 'test66',
    fn: () => {

        const kb = $('capra').has('stupid').as('friend')

            // .and($('capra').has('f#1').as('friend'))
            // .and($('capra').has('f#2').as('friend'))
            // .and($('capra').has('f#3').as('friend'))
            // .and($('capra').has('f#4').as('friend'))
            // .and($('capra').has('f#5').as('friend'))
            // .and($('capra').has('f#6').as('friend'))
            // .and($('capra').has('f#7').as('friend'))
            // .and($('capra').has('f#8').as('friend'))
            // .and($('capra').has('f#9').as('friend'))

            .and($('capra').has('stupid').as('brother'))
            .and($('capra').has('stupid').as('sidekick'))
            .and($('capra').has('scemo').as('brother'))
            .and($('capra').has('cretino').as('friend'))

            .dump().kb

        const result = findAll(
            $('capra').has('x:thing').as('brother').and($('capra').has('x:thing').as('friend')).and($('capra').has('x:thing').as('sidekick')).$,
            [$('x:thing').$],
            kb,
        )

        assertEquals(result.length, 1)
        assertEquals(result[0].get($('x:thing').$), $('stupid').$)
    }
})



Deno.test({
    name: 'test67',
    fn: () => {

        const kb = $('capra').has('stupid').as('friend')
            .and($('capra').has('stupid').as('brother'))
            .and($('capra').has('scemo').as('brother'))
            .and($('capra').has('cretino').as('friend'))
            .dump().kb

        const result = findAll(
            $('capra').has('x:thing').as('brother').or($('capra').has('x:thing').as('friend')).$,
            [$('x:thing').$],
            kb,
        )

        assertEquals(result.length, 3)
        assertNotEquals(result[0].get($('x:thing').$), result[1].get($('x:thing').$))
        assertNotEquals(result[1].get($('x:thing').$), result[2].get($('x:thing').$))

        // console.log(result.length)
        // console.log(result.map(x=>x.helperMap))
        // assertEquals(result.length, 1)
        // assertEquals(result[0].get($('x:thing').$), $('stupid').$)
    }
})





// Deno.test({
//     name: 'test67',
//     fn: () => {

//     }
// })