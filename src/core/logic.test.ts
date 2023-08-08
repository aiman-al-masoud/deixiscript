import { assert, assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { tell } from "./tell.ts";
import { ask } from "./ask.ts";
import { KnowledgeBase, LLangAst, isTruthy } from "./types.ts";
import { getStandardKb } from "./prelude.ts";
import { evaluate } from "./evaluate.ts";
import { solve } from "./solve.ts";
import { subst } from "./subst.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { match } from "./match.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { compareSpecificities } from "./compareSpecificities.ts";
import { sorted } from "../utils/sorted.ts";


function dassert(x: LLangAst) {
    return assert(isTruthy(x))
}

Deno.test({
    name: 'test1',
    fn: () => {
        // is-a test
        const kb = $('person#2').isa('person')
            .and($('person#1').isa('person'))
            .and($('cat#1').isa('cat'))
            .dump()

        const f = $('person#2').isa('person').$
        dassert(ask(f, kb).result)
    }
})

// Deno.test({
//     name: 'test02',
//     fn: () => {

//         // const kb = $('x:dude').isa('dude').when($('x:dude').isa('person'))
//         //         .dump()

//         const kb = $('x:thing').isa('dude').when($('x:thing').has(1).as('tjing') )
//         .dump()

//         // const yes = $('person#2').isa('dude').$
//         const no = $('person#2').isa('somestuffidk').isNotTheCase.$

//         // dassert(ask(yes, kb).result)
//         dassert(ask(no, kb).result)
//     }
// })

Deno.test({
    name: 'test3',
    fn: () => {
        // find all test
        const kb = $('person#2').isa('person')
            .and($('person#1').isa('person'))
            .and($('cat#1').isa('cat'))
            .dump()

        const f = $('x:person').isa('person').$
        const v = $('x:person').$
        const results = findAll(f, [v], kb)
        assertEquals(results.length, 2)
    }
})

Deno.test({
    name: 'test04',
    fn: () => {
        // has-sentence based derivation clause, ask() and tell() test
        const dc = $('x:person').has('c:city').as('birth-city').when(

            $.thereIs($('e:event').suchThat($.thereIs($('y:space-point').suchThat(
                $('y:space-point').has('c:city').as('enclosing-city')
                    .and($('e:event').has('y:space-point').as('location'))
                    .and($('x:person').has('e:event').as('birth'))
            ))))

        ).$

        const kb = $('person#1').has('event#1').as('birth')
            .and($('person#1').isa('person'))
            .and($('person#2').isa('person'))
            .and($('event#1').isa('event'))
            .and($('pt#1').isa('space-point'))
            .and($('event#1').has('pt#1').as('location'))
            .and($('pt#1').has('boston').as('enclosing-city'))
            .and($('event#2').has('pt#2').as('location'))
            .and($('boston').isa('city'))
            .and(dc)
            .dump()

        const query = $('person#1').has('boston').as('birth-city').$
        dassert(ask(query, kb).result)

        const q2 = $('person#2').has('boston').as('birth-city').$
        const kb1 = tell(q2, kb).kb //auto-creates new event & new spacepoint
        dassert(ask(q2, kb1).result)
    }
})


Deno.test({
    name: 'test8',
    fn: () => {

        const dc = $({ subject: 'x:thing', isSmallerThan: 'y:thing' }).when(
            $('y:thing').isGreaterThan('x:thing')
        ).$

        const kb = $(dc).dump()

        dassert(ask($({ subject: 1, isSmallerThan: 2 }).$, kb).result)
    }
})

Deno.test({
    name: 'test9',
    fn: () => {

        const dc = [
            $({ subject: 'x:thing', isLargerThan: 'y:thing' }).when(

                $.thereIs($('v1:number').suchThat($.thereIs($('v2:number').suchThat(
                    $('x:thing').has('v1:number').as('volume')
                        .and($('y:thing').has('v2:number').as('volume'))
                        .and($('v1:number').isGreaterThan('v2:number'))
                ))))

            ).$
        ]

        const wm = $('bucket#1').isa('bucket')
            .and($('apple#1').isa('apple'))
            .and($('bucket#1').has(2).as('volume'))
            .and($('apple#1').has(1).as('volume'))
            .dump().wm

        const test1 = $({ subject: 'bucket#1', isLargerThan: 'apple#1' }).$
        const test2 = $({ subject: 'apple#1', isLargerThan: 'bucket#1' }).isNotTheCase.$

        dassert(ask(test1, { wm: wm, derivClauses: dc, deicticDict: {}, }).result)
        dassert(ask(test2, { wm: wm, derivClauses: dc, deicticDict: {}, }).result)

    }
})

Deno.test({
    name: 'test23',
    fn: () => {
        const kb2 = $('cat#1').has(3).as('weight')
            .and($('dog#1').has(4).as('weight'))
            .and($('cat#1').isa('cat'))
            .and($('dog#1').isa('dog'))
            .dump()

        const x = $.the('number').which($('cat#1').has($._).as('weight')).equals(3).$

        dassert(ask(x, kb2).result)
    }
})


Deno.test({
    name: 'test24',
    fn: () => {
        const q = $(1).plus(2).$
        assertEquals(ask(q, $.emptyKb).result, $(3).$)
    }
})

Deno.test({
    name: 'test25',
    fn: () => {

        const kb = $(1).isa('number')
            .and($(2).isa('number'))
            .dump()

        const q = $('x:number').plus('y:number').equals(3).$

        const res = findAll(q, [$('x:number').$, $('y:number').$], kb)
        assertEquals(res[0].get($('x:number').$), $(1).$)
        assertEquals(res[0].get($('y:number').$), $(2).$)

    }
})

Deno.test({
    name: 'test26',
    fn: () => {
        // basic arithmetic
        assertEquals(ask($(3).plus(3).$, $.emptyKb).result, $(6).$)
        assertEquals(ask($(3).minus(3).$, $.emptyKb).result, $(0).$)
        assertEquals(ask($(3).times(3).$, $.emptyKb).result, $(9).$)
        assertEquals(ask($(3).over(3).$, $.emptyKb).result, $(1).$)
        dassert(ask($(2).isGreaterThan(1).$, $.emptyKb).result)
    }
})

Deno.test({
    name: 'test27',
    fn: () => {

        const kb = getStandardKb()

        const kb2 =
            $({ limitedNumOf: 'last-thought-of', onConcept: 'thing', max: 1 })
                .and($('capra#1').has(1).as('last-thought-of'))
                .dump(kb)

        const kb3 = tell($('capra#1').has(2).as('last-thought-of').$, kb2).kb
        assertEquals(findAll($('capra#1').has('x:thing').as('last-thought-of').$, [$('x:thing').$], kb3).length, 1)
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
                .dump()

        const command = $.the('cat').has('black').as('color').if($('cat#1').has('big').as('size'))
        const kb2 = tell(command.$, kb).kb
        dassert(ask($.the('cat').has('black').as('color').$, kb2).result)
    }
})

Deno.test({
    name: 'test29',
    fn: () => {
        const q = $.thereIs($('x:cat').suchThat($('x:cat').has('red').as('color')))
        const kb2 = tell(q.$, $.emptyKb).kb
        dassert(ask(q.$, kb2).result)
    }
})

Deno.test({
    name: 'test30',
    fn: () => {
        const kb = getStandardKb()
        const q = $('cat#1').isa('feline')
        const results0 = evaluate(q.isNotTheCase.ask.$, kb)
        dassert(results0.result)
        const results1 = evaluate(q.tell.$, kb)
        const results2 = evaluate(q.ask.$, results1.kb)
        dassert(results2.result)
    }
})

Deno.test({
    name: 'test31',
    fn: () => {
        // transitivity of inheritance relationships
        const kb = $('capra').isa('mammal').and($('mammal').isa('animal')).dump()
        dassert(ask($('capra').isa('animal').$, kb).result)
    }
})

Deno.test({
    name: 'test32',
    fn: () => {
        // recomputeKb with negation
        const q = $('cat#1').has('red').as('color')
        const kb1 = q.dump()
        dassert(ask(q.$, kb1).result)
        const result = tell(q.isNotTheCase.$, kb1)
        const kb2 = result.kb
        dassert(ask(q.isNotTheCase.$, kb2).result)
    }
})

Deno.test({
    name: 'test33',
    fn: () => {
        // string literals
        const x = $('"ciao mondo"')
        // assertEquals(x.$.type, 'string')
        dassert(ask(x.equals('"ciao mondo"').$, $.emptyKb).result)
        dassert(ask(x.equals('"ciaomondo"').isNotTheCase.$, $.emptyKb).result)
    }
})

Deno.test({
    name: 'test34',
    fn: () => {
        // defaults
        const kb =
            $('point').has(100).as('x-coordinate').dump()

        const result = tell($.thereIs($.a('point')).$, kb)

        const check = ask(
            $.thereIs($.the('point').which($._.has(100).as('x-coordinate'))).$,
            result.kb,
        ).result

        dassert(check)
    }
})

Deno.test({
    name: 'test36',
    fn: () => {
        // "where" should override defaults
        const kb =
            $('point').has(100).as('x-coordinate').dump()

        const result = evaluate($.thereIs($('x:point').suchThat($('x:point').has(200).as('x-coordinate'))).tell.$, kb)

        dassert(ask($.the('point').has(200).as('x-coordinate').$, result.kb).result)
        dassert(ask($.the('point').has(100).as('x-coordinate').isNotTheCase.$, result.kb).result)

    }
})

Deno.test({
    name: 'test35',
    fn: () => {
        // better anaphora test
        const kb = $('person#1').isa('agent')
            .and($('door#1').isa('door'))
            .dump()

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
        const { kb: kb1 } = evaluate($(1).plus(1).$, $.emptyKb)
        assertEquals(evaluate($.the('number').ask.$, kb1).result, $(2).$)
    }
})

Deno.test({
    name: 'test38',
    fn: () => {
        // mutex concepts test
        const kbmin2 = getStandardKb()
        const { kb: kbmin1 } = tell($({ concept: 'cat', excludes: 'dog' }).$, kbmin2)
        const kb0 = tell($('mammal#1').isa('cat').$, kbmin1).kb
        const kb1 = tell($('mammal#1').isa('dog').$, kb0).kb
        dassert(ask($('mammal#1').isa('cat').isNotTheCase.$, kb1).result)
        dassert(ask($('mammal#1').isa('dog').$, kb1).result)
        const kb2 = tell($('mammal#1').isa('cat').$, kb0).kb
        dassert(ask($('mammal#1').isa('dog').isNotTheCase.$, kb2).result)
        dassert(ask($('mammal#1').isa('cat').$, kb2).result)
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
        const x = ask($.the('number').which($._.over(2).equals(100)).$, $.emptyKb).result
        assertEquals(x, $(200).$)
    }
})


Deno.test({
    name: 'test41',
    fn: () => {

        // syntactic de/compression
        const kb = $('person#1').and('person#2').and('person#3').isa('person')
            .and($('door#1').isa('door'))
            .and($('person').isa('agent'))
            .dump()

        const r1 = ask($('person#1').and('person#3').isa('person').$, kb)
        dassert(r1.result)
        const r2 = ask($('person#1').and('door#1').isa('person').isNotTheCase.$, kb)
        dassert(r2.result)
        const r4 = ask($('person#1').isa($('person').and('agent').$).$, kb).result
        dassert(r4)
        const r5 = ask($('door#1').isa($('thing').and('agent').$).isNotTheCase.$, kb).result
        dassert(r5)
        const r6 = ask($('person#1').and('person#2').and('person#3').isa('agent').$, kb).result
        dassert(r6)
        const r7 = ask($('person#1').or('door#1').isa('agent').$, kb).result
        dassert(r7)
        const r8 = ask($('boston').or('door#1').isa('agent').isNotTheCase.$, kb).result
        dassert(r8)
        const r9 = ask($('door#1').isa($('door').or('agent')).$, kb).result
        dassert(r9)
    }
})

Deno.test({
    name: 'test43',
    fn: () => {
        // has-formula query without specifying as-clause

        const x = $('capra#1').has('fur#1').as('fur')
            .and($('capra#1').has('hoof#1').as('hoof'))
            .and($('capra#2').has('fur#2').as('fur'))
            .dump()

        dassert(ask($('capra#1').has('fur#1').$, x).result)
        dassert(ask($('capra#1').has('fur#2').isNotTheCase.$, x).result)
        dassert(ask($('capra#2').has('fur#2').$, x).result)
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
            .dump()

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
    name: 'test48',
    fn: () => {

        const kb0 = $.thereIs($.a('cat').which($._.has('red').as('color')))
            .and($.thereIs($.a('cat').which($._.has('black').as('color'))))
            .dump()

        const kb1 = tell($.the('cat').which($._.has('red').as('color')).has(1).as('hunger')
            .and($.the('cat').which($._.has('black').as('color')).has(1).as('hunger')).$, kb0).kb

        const dc =
            $.a('cat').which($._.has('red').as('color').is('hungry')).when($.the('cat').has(1).as('hunger')).$

        const kb2 = tell(dc, kb1).kb

        const statement1 = $.the('cat').which($._.has('red').as('color').is('hungry')).$
        const statement2 = $.the('cat').which($._.has('black').as('color').is('hungry')).isNotTheCase.$

        const result1 = ask(statement1, kb2).result
        const result2 = ask(statement2, kb2).result
        dassert(result1)
        dassert(result2)
    }
})

Deno.test({
    name: 'test50',
    fn: () => {
        // of-anaphor test
        const kb = $.thereIs($.a('cat').which($._.has(3).as('position'))).dump()
        const q = $.the('position').of($.the('cat').$).$
        const result = ask(q, kb).result
        assertEquals(result, $(3).$)
    }
})

// Deno.test({
//     name: 'test54',
//     fn: () => {

//         const maxX = $.the('panel').has($.the('number')).as('max-x').when(
//             $.the('number').equals($.the('width').of($.the('panel').$).plus($.the('x-coord').of($.the('panel').$)))
//         ).$

//         const maxY = $.the('panel').has($.the('number')).as('max-y').when(
//             $.the('number').equals($.the('height').of($.the('panel').$).plus($.the('y-coord').of($.the('panel').$)))
//         ).$

//         const parent = $('p1:panel').has('p2:panel').as('parent').when(
//             $.the('x-coord').of('p1:panel').isLessThanOrEqual($.the('max-x').of('p2:panel').$)
//                 .and($.the('x-coord').of('p1:panel').isGreaterThanOrEqual($.the('x-coord').of('p2:panel').$))
//                 .and($.the('y-coord').of('p1:panel').isLessThanOrEqual($.the('max-y').of('p2:panel').$))
//                 .and($.the('y-coord').of('p1:panel').isGreaterThanOrEqual($.the('y-coord').of('p2:panel').$))
//                 .and($.the('z-index').of('p1:panel').isGreaterThan($.the('z-index').of('p2:panel')))
//         ).$

//         const kb = $('panel#1').isa('panel')
//             .and($('panel#1').has(20).as('x-coord'))
//             .and($('panel#1').has(10).as('y-coord'))
//             .and($('panel#1').has(1).as('z-index'))
//             .and($('panel#1').has(5).as('width'))
//             .and($('panel#1').has(4).as('height'))
//             .and($('panel#2').isa('panel'))
//             .and($('panel#2').has(10).as('x-coord'))
//             .and($('panel#2').has(5).as('y-coord'))
//             .and($('panel#2').has(0).as('z-index'))
//             .and($('panel#2').has(10).as('width'))
//             .and($('panel#2').has(10).as('height'))
//             .and(maxX)
//             .and(maxY)
//             .and(parent)
//             .dump()

//         assertEquals(ask($.the('max-x').of('panel#2').$, kb).result, $(20).$)
//         assertEquals(ask($.the('max-x').of('panel#1').$, kb).result, $(25).$)

//         assertEquals(ask($.the('max-y').of('panel#2').$, kb).result, $(15).$)
//         assertEquals(ask($.the('max-y').of('panel#1').$, kb).result, $(14).$)

//         dassert(ask($('panel#1').has('panel#2').as('parent').$, kb).result)
//         dassert(ask($('panel#2').has('panel#1').as('parent').isNotTheCase.$, kb).result)

//     }
// })

Deno.test({
    name: 'test55',
    fn: () => {
        // very basic superlative
        const kb = $(1).isa('number')
            .and($(2).isa('number'))
            .and($(5).isa('number'))
            .and($(3).isa('number'))
            .and($(4).isa('number'))
            .dump()

        const xs = findAll($.thereIs($('m:number').suchThat($('m:number').isGreaterThan('n:number'))).isNotTheCase.$, [$('n:number').$], kb)
        assertEquals(xs[0].get($('n:number').$), $(5).$)
    }
})

Deno.test({
    name: 'test56',
    fn: () => {
        const kb = getStandardKb()
        const result1 = ask($({ subject: 1, verb: 'be', object: 1 }).$, kb).result
        dassert(result1)
        const result2 = ask($({ subject: 2, verb: 'be', object: 1 }).isNotTheCase.$, kb).result
        dassert(result2)
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
        const result0 = ask($('thing#1').has('red').as('color').$, kb2).result
        const result1 = ask($('thing#1').is('red').$, kb2).result
        const result2 = ask($('thing#1').has('black').as('color').isNotTheCase.$, kb2).result

        dassert(result0)
        dassert(result1)
        dassert(result2)
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
                .dump()

        dassert(ask($.the('capra').does('like')._('food#1').$, kb).result)
        dassert(ask($.the('capra').does('like')._('food#2').isNotTheCase.$, kb).result)

    }
})

Deno.test({
    name: 'test59',
    fn: () => {
        const x = $.thereIs($.a('mouse').in('house#1')).$
        tell(x, $.emptyKb).kb

        const alt = $.thereIs($.a('mouse').which($._.has('house#1').as('location'))).$
        assertNotEquals(match(removeImplicit(x), removeImplicit(alt), $.emptyKb), undefined)

    }
})

Deno.test({
    name: 'test60',
    fn: () => {
        // a variable is just a "special case" of arbitrary type
        const kb = $('cat#1').isa('cat').dump()
        assertEquals(ask($('x:cat').$, kb).result, $('cat#1').$)
    }
})

Deno.test({
    name: 'test62',
    fn: () => {
        // simple-sentence template can match compound formula (special case of
        // a template can match a more-specific-than-itself formula ).
        const template = $('x:cat').has('red').as('color').$
        const kb = $('cat#1').isa('cat').dump()
        const f = $('y:dog').is('stupid').and($('cat#1').has('red').as('color')).$
        const map = match(template, f, kb)
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
                .and($('he').when('x:male').$)
                .and($('she').when('x:female').$)
                .dump()

        assertEquals(ask($('she').$, kb).result, $('alice#1').$)
        assertEquals(ask($('he').$, kb).result, $('bob#1').$)
    }
})

Deno.test({
    name: 'test64',
    fn: () => {
        // fibonacci test + automatic derivation clause sorting by specificity test
        const kb1 = $({ fibOf: 1 }).when(1)
            .and($({ fibOf: 'x:number' }).when($({ fibOf: $('x:number').minus(1).$ }).plus($({ fibOf: $('x:number').minus(2).$ }))))
            .and($({ fibOf: 2 }).when(1)) // gets hoisted up (more specific than x:number)
            .dump()

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
            .dump()

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
            .and($('capra').has('stupid').as('brother'))
            .and($('capra').has('stupid').as('sidekick'))
            .and($('capra').has('scemo').as('brother'))
            .and($('capra').has('cretino').as('friend'))

            .dump()

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
            .dump()

        const result = findAll(
            $('capra').has('x:thing').as('brother').or($('capra').has('x:thing').as('friend')).$,
            [$('x:thing').$],
            kb,
        )

        assertEquals(result.length, 3)
        assertNotEquals(result[0].get($('x:thing').$), result[1].get($('x:thing').$))
        assertNotEquals(result[1].get($('x:thing').$), result[2].get($('x:thing').$))

    }
})

Deno.test({
    name: 'test68',
    fn: () => {
        const kb0 = getStandardKb()
        const kb = $({ limitedNumOf: 'x-coord', onConcept: 'point', max: 1 }).dump(kb0)
        const kb1 = tell($('pt#1').isa('point').$, kb).kb
        const kb2 = tell($('pt#1').has(1).as('x-coord').$, kb1).kb
        const kb3 = tell($('pt#1').has(2).as('x-coord').$, kb2).kb
        const kb4 = tell($('pt#1').has(3).as('x-coord').$, kb3).kb
        const x = findAll($('pt#1').has('x:thing').as('x-coord').$, [$('x:thing').$], kb4)
        assertEquals(x.length, 1)
        assertEquals(ask($.the('number').which($('pt#1').has($._).as('x-coord')).$, kb4).result, $(3).$)
    }
})

Deno.test({
    name: 'test69',
    fn: () => {
        const kb0 = getStandardKb()
        const kb = $({ limitedNumOf: 'state', onConcept: 'thing', max: 1 }).dump(kb0)
        const kb1 = tell($('door#1').isa('door').$, kb).kb
        const kb2 = tell($('door#1').has('open').as('state').$, kb1).kb
        const kb3 = tell($('door#1').has('closed').as('state').$, kb2).kb
        const kb4 = tell($('door#1').has('open').as('state').$, kb3).kb
        dassert(ask($('door#1').has('closed').as('state').$, kb3).result)
        dassert(ask($('door#1').has('open').as('state').isNotTheCase.$, kb3).result)
        dassert(ask($('door#1').has('open').as('state').$, kb4).result)
    }
})

Deno.test({
    name: 'test70',
    fn: () => {
        // plural implicit references

        const kb = $('capra#1').isa('capra')
            .and($('capra#2').isa('capra'))
            .and($('capra').isa('mammal'))
            .dump()

        assertEquals(ask($.every('capra').$, kb).result, $('capra#1').and('capra#2').$)
        dassert(ask($.every('capra').isa('mammal').$, kb).result)

    }
})


Deno.test({
    name: 'test71',
    fn: () => {
        const kb = $.the('double').of('n:number').when($('n:number').times(2)).dump()
        const r = ask($.the('double').of(22).plus(1).$, kb).result
        assertEquals(r, $(45).$)
    }
})

Deno.test({
    name: 'test72',
    fn: () => {
        const kb = $.the('sum').of($('x:number').and('y:number')).when($('x:number').plus('y:number')).dump()
        assertEquals(ask($.the('sum').of($(1).and(5)).$, kb).result, $(6).$)
        assertEquals(ask($.the('sum').of($(30).minus(2).and(1)).$, kb).result, $(29).$)
    }
})



Deno.test({
    name: 'test77',
    fn: () => {
        // a general template can match a specific formula
        // ...a specific template cannot match a general formula!
        const kb = $('cat').isa('mammal').dump()
        const general = $('mammal').is('hungry').$
        const specific = $('cat').is('hungry').$

        assertNotEquals(match(general, specific, kb), undefined)
        assertEquals(match(specific, general, kb), undefined)
    }
})

Deno.test({
    name: 'test78',
    fn: () => {
        // sorting by specificity
        const dcs = [
            $.the('cat').which($._.has('red').as('color')).does('eat')._($.the('mouse')).$,
            $.the('cat').does('eat')._($.the('mouse')).$,
            $.the('cat').which($._.has('red').as('color')).does('eat')._($.the('mouse').which($._.is('black'))).$,
            $.the('dog').is('stupid').$,
            $.the('dog').which($._.has('white').as('color')).is('stupid').$,
        ]

        const oracle = [
            dcs[2],
            dcs[0],
            dcs[1],
            dcs[4],
            dcs[3],
        ]

        const sortedDcs = sorted(dcs, (a, b) => compareSpecificities(b, a, $.emptyKb))
        assertEquals(sortedDcs, oracle)
    }
})

Deno.test({
    name: 'test79',
    fn: () => {
        // after clause test 1
        const dc = $('screen#1').has('red').as('color').after($('x:button').has('down').as('state')).$

        const kb = $(dc)
            .and($('button#1').isa('button'))
            .dump()

        const a = $('button#1').has('down').as('state').$

        const { kb: kb2 } = tell(a, kb)
        dassert(ask($('screen#1').has('red').as('color').$, kb2).result)
    }
})

Deno.test({
    name: 'test80',
    fn: () => {
        // after clause test 2, with derived prop as "efficient cause"
        const dc = $('screen#1').has('red').as('color')
            .after($('x:button').has('down').as('state')).$

        const kb = $(dc)
            .and($('button#1').isa('button'))
            .and($('x:button').is('down').when($('x:button').has('down').as('state')))
            .dump()

        const a = $('button#1').is('down').$

        const { kb: kb2 } = tell(a, kb)
        dassert(ask($('screen#1').has('red').as('color').$, kb2).result)
    }
})

Deno.test({
    name: 'test81',
    fn: () => {
        // after clause test 3, with simple clause as "efficient cause"
        // but derived prop as delclared efficient cause

        const dc = $('screen#1').has('red').as('color')
            .after($('x:button').is('down')).$

        const kb = $(dc)
            .and($('button#1').isa('button'))
            .and($('x:button').is('down').when($('x:button').has('down').as('state')))
            .dump()

        const a = $('button#1').has('down').as('state').$

        const { kb: kb2 } = tell(a, kb)
        dassert(ask($('screen#1').has('red').as('color').$, kb2).result)
    }
})

Deno.test({
    name: 'test82',
    fn: () => {
        // number restriction max=2 annotation test
        const kb = getStandardKb()

        const kb2 =
            $({ limitedNumOf: 'eye', onConcept: 'thing', max: 2 })
                .and($('capra#1').has(1).as('eye'))
                .and($('capra#2').has(1).as('eye'))
                .dump(kb)

        const kb3 = tell($('capra#1').has(2).as('eye').$, kb2).kb
        const kb4 = tell($('capra#1').has(3).as('eye').$, kb3).kb
        const kb5 = tell($('capra#1').has(4).as('eye').$, kb4).kb

        assertEquals(findAll($('capra#1').has('x:thing').as('eye').$, [$('x:thing').$], kb5).map(x => x.get($('x:thing').$)), [$(3).$, $(4).$])

        assertEquals(findAll($('capra#2').has('x:thing').as('eye').$, [$('x:thing').$], kb5).map(x => x.get($('x:thing').$)), [$(1).$])
    }
})

Deno.test({
    name: 'test83',
    fn: () => {
        // number restriction max=0 annotation test
        const kb = getStandardKb()

        const kb2 =
            $({ limitedNumOf: 'buruf', onConcept: 'thing', max: 0 })
                .dump(kb)

        const kb3 = tell($('capra#1').has(2).as('buruf').$, kb2).kb

        assertEquals(findAll($('capra#1').has('x:thing').as('buruf').$, [$('x:thing').$], kb3).map(x => x.get($('x:thing').$)).length, 0)

    }
})

Deno.test({
    name: 'test84',
    fn: () => {
        // equality as an alias for derivation clause declaration in tell()
        const kb = evaluate($('it').equals('x:thing').tell.$, $.emptyKb).kb
        assertEquals(kb.derivClauses[0], $('it').when('x:thing').$)
    }
})


Deno.test({
    name: 'test85',
    fn: () => {
        // problem: "it" doesn't work
        // problem: a vs the        
        const kb = $.the('f').of($.the('number')).equals($.the('number').plus(1)).dump()
        assertEquals(ask($.the('f').of(2).$, kb).result, $(3).$)
    }
})



// Deno.test({
//     name: 'test86',
//     fn: () => {
//         // const x  = match($.the('thing').$, $.the('number').$, $.emptyKb)
//         const x  = match( $.the('number').$, $.the('thing').$, $.emptyKb)

//         console.log(x)
//     }
// })

// Deno.test({
//     name : 'test82',
//     fn : ()=>{
//         const kb = $('x:thing').has('y:thing').as('owner').when($('y:thing').has('x:thing') )
//                     .and($('cat#1').has('claws#1'))
//                     .dump()

//         dassert(ask($('claws#1').has('cat#1').as('owner').$, kb).result)
//         dassert(ask($('claws#1').has('ca#1').as('owner').isNotTheCase.$, kb).result)


//         // const kb1 = $('x:thing').has('y:thing').as('owner').when($('y:thing').has('z:thing').as('x:thing') )
//         //             .and($('cat#1').has('claws#1'))
//         //             .dump()

//     }
// })


// Deno.test({
//     name: 'test79',
//     fn: () => {
//         const x  = $.the('cat').complement($.the('house').$, )
//         console.log(x)
//     }
// })


// Deno.test({
//     name: 'test73',
//     fn: () => {
//         const kb =
//             $.the('fib').of(1).when(1)
//                 .and($.the('fib').of(2).when(1))
//                 .and($.the('fib').of('n:number').when(    $.the('fib').of($('n:number').minus(2)).plus($.the('fib').of($('n:number').minus(1)))    ))
//                 .dump()
//         const r = ask($.the('fib').of(3).$, kb).result
//         console.log(r)
//     }
// })


