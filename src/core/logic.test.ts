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
import { parse } from "./parse.ts";
import { compareSpecificities } from "./specificity.ts";
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
        // has-sentence based derivation clause
        const dc = $('x:person').has('c:city').as('birth-city').when(
            $('e:event').exists.where($('y:space-point').exists.where(
                $('y:space-point').has('c:city').as('enclosing-city')
                    .and($('e:event').has('y:space-point').as('location'))
                    .and($('x:person').has('e:event').as('birth'))
            ))
        ).$

        const kb = $('person#1').has('event#1').as('birth')
            .and($('person#1').isa('person'))
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
            .dump().wm

        const test1 = $({ subject: 'bucket#1', isLargerThan: 'apple#1' }).$
        const test2 = $({ subject: 'apple#1', isLargerThan: 'bucket#1' }).isNotTheCase.$

        dassert(ask(test1, { wm: wm, derivClauses: dc, deicticDict: {}, }).result)
        dassert(ask(test2, { wm: wm, derivClauses: dc, deicticDict: {}, }).result)

    }
})

// Deno.test({
//     name: 'test10',
//     fn: () => {

//         const x = ask($('x:thing').exists.where(
//             $({ annotation: 'x:thing', subject: 'open', verb: 'exclude', object: 'closed', location: 'state', owner: 'door' })
//         ).$, kb)

//         dassert(x.result)

//     }
// })

Deno.test({
    name: 'test23',
    fn: () => {
        const kb2 = $('cat#1').has(3).as('weight')
            .and($('dog#1').has(4).as('weight'))
            .and($('cat#1').isa('cat'))
            .and($('dog#1').isa('dog'))
            .dump()

        // ((the number such that (the cat has the number as weight)) is (3))
        const x = $('x:number').suchThat($('c:cat').suchThat().has('x:number').as('weight')).equals(3).$
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
            $({ ann: 'ann#429', onlyHaveOneOf: 'last-thought-of', onConcept: 'thing' })
                .and($('capra#1').has(1).as('last-thought-of'))
                .dump(kb.derivClauses)

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

        const command = $('x:cat').suchThat().has('black').as('color').if($('cat#1').has('big').as('size'))

        const kb2 = tell(command.$, kb).kb

        dassert(ask($('x:cat').suchThat().has('black').as('color').$, kb2).result)

    }
})

Deno.test({
    name: 'test29',
    fn: () => {
        const q = $('x:cat').exists.where($('x:cat').has('red').as('color'))
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
        assertEquals(x.$.type, 'string')
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
        // .dump(derivationClauses)

        const result = tell($.a('point').exists.$, kb)

        const check = ask(
            $.the('point').which($._.has(100).as('x-coordinate')).exists.$,
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
        // .dump(derivationClauses)

        const result = evaluate($('x:point').exists.where($('x:point').has(200).as('x-coordinate')).tell.$, kb)

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
        const { kb: kbmin1 } = tell($({ ann: 'ann#9126', concept: 'cat', excludes: 'dog' }).$, kbmin2)
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
        // const r3 = tell($('cat#1').and('cat#2').isa('cat').$, kb).additions
        // console.log(r3)
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
            .dump()

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
    name: 'test47',
    fn: () => {
        // creation of new thing via existquant+ANAPHOR
        const kb0 = $.emptyKb
        const kb1 = tell($.a('cat').whose($('fur').has('red').as('color')).exists.$, kb0).kb
        const result = ask($.a('cat').whose($('fur').has('red').as('color')).exists.$, kb1).result
        dassert(result)
    }
})

Deno.test({
    name: 'test48',
    fn: () => {

        const kb0 = $.a('cat').whose($('fur').has('red').as('color')).exists
            .and($.a('cat').whose($('fur').has('black').as('color')).exists)
            .dump()

        const kb1 = tell($.the('cat').whose($('fur').has('red').as('color')).has(1).as('hunger')
            .and($.the('cat').whose($('fur').has('black').as('color')).has(1).as('hunger')).$, kb0).kb

        const dc =
            $({ subject: $.a('cat').whose($('fur').has('red').as('color')).$, verb: 'be', object: 'hungry' })
                .when($.the('cat').has(1).as('hunger')).$

        const kb2 = tell(dc, kb1).kb

        const statement1 = $({ subject: $.the('cat').whose($('fur').has('red').as('color')).$, verb: 'be', object: 'hungry' }).$
        const statement2 = $({ subject: $.the('cat').whose($('fur').has('black').as('color')).$, verb: 'be', object: 'hungry' }).isNotTheCase.$

        const result1 = ask(statement1, kb2).result
        const result2 = ask(statement2, kb2).result
        dassert(result1)
        dassert(result2)
    }
})

// Deno.test({
//     name: 'test49',
//     fn: () => {

//         const dc = $('p:panel').has('n:number').as('max-x').when(
//             $('n:number')
//                 .equals($('y:number').suchThat($('p:panel').has('y:number').as('width'))
//                     .plus($('z:number').suchThat($('p:panel').has('z:number').as('x-coord'))))
//         )

//         const kb = $.the('panel').which($._.has(30).as('x-coord')).exists.dump()
//         const kb2 = tell($.the('panel').has(100).as('width').$, kb).kb
//         const kb3 = tell(dc.$, kb2).kb

//         const q = $('p:panel').suchThat().has(130).as('max-x').$
//         const result = ask(q, kb3).result
//         dassert(result)

//         const q2 = $('n:number').suchThat($('p:panel').suchThat().has('n:number').as('max-x')).$
//         const result2 = ask(q2, kb3).result
//         assertEquals(result2, $(130).$)

//         const q3 = $.the('number').which($('p:panel').suchThat().has($._.$).as('max-x')).$

//         const result3 = ask(q3, kb3).result
//         assertEquals(result3, $(130).$)

//         const q4 = $.the('number').which($.the('panel').has($._.$).as('max-x')).$
//         const result4 = ask(q4, kb3).result
//         assertEquals(result4, $(130).$)

//     }
// })

Deno.test({
    name: 'test50',
    fn: () => {
        const kb = $.a('cat').which($._.has(3).as('position')).exists.dump()
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

        const q = $('n:number')
            .suchThat($('m:number').exists.where($('m:number').isGreaterThan('n:number')).isNotTheCase).$

        const result = ask(q, kb).result
        assertEquals(result, $(5).$)
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
        const x = $.the('mouse').in('house#1').exists.$
        tell(x, $.emptyKb).kb

        const alt = $.the('mouse').which($._.has('house#1').as('location')).exists.$
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
    name: 'test61',
    fn: () => {

        const dc = $('screen#1').has('red').as('color').after($('x:button').has('down').as('state')).$

        const kb = $(dc)
            .and($('button#1').isa('button'))
            .dump()

        const a = $('button#1').has('down').as('state').$

        const result = tell(a, kb)
        dassert(ask($('screen#1').has('red').as('color').$, result.kb).result)
    }
})

Deno.test({
    name: 'test62',
    fn: () => {
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
                // .and($('apple#1').isa('fruit'))
                // .and($('it').when('x:thing'))
                // .and($('it').when($('x:thing').suchThat($('x:thing').isa('male').isNotTheCase.and($('x:thing').isa('female').isNotTheCase))))
                .and($('he').when('x:male').$)
                .and($('she').when('x:female').$)
                .dump()

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
        const kb = $({ ann: 'ann#1928', onlyHaveOneOf: 'x-coord', onConcept: 'point' }).dump(kb0.derivClauses)
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
        const kb = $({ annotation: 'ann#3000', subject: 'closed', verb: 'exclude', object: 'open', location: 'state', owner: 'door' }).dump(kb0.derivClauses)
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
        const r = ask($.the('sum').of($(1).and(5)).$, kb).result
        assertEquals(r, $(6).$)
        // console.log(r)
        // console.log(ask($.the('sum').of($(30).minus(2).and(1)).$, kb).result)
    }
})


Deno.test({
    name: 'test73',
    fn: () => {
        // experiments w/ alternative parsing strategy (similar to DCGs)
        const kb = $({ parse: ['x:thing', 'is', 'y:thing'] }).when($('x:thing').is('y:thing')).dump()
        const code = 'cat is red'.split(' ')
        const r = parse($({ parse: code }).$, kb)
        assertEquals(r, $('cat').is('red').$)
    }
})

Deno.test({
    name: 'test74',
    fn: () => {
        // alt parser...
        const kb = $({ parse: ['(', 'x:thing|)'], returnMe: true }).when('x:thing').dump()
        const code = '( cat is a mammal )'.split(' ')
        const r = parse($({ parse: code, returnMe: true }).$, kb)
        assertEquals(r, $(['cat', 'is', 'a', 'mammal']).$)
    }
})


Deno.test({
    name: 'test75',
    fn: () => {
        // alt parser...
        const kb =
            $({ parse: ['(', 'x:thing|)'] }).when($({ parse: 'x:thing' }))
                .and($({ parse: ['x:thing', 'is', 'a', 'y:thing'] }).when($('x:thing').isa('y:thing')))
                .dump()

        const code = '( cat is a mammal )'.split(' ')
        const r = parse($({ parse: code }).$, kb)
        assertEquals(r, $('cat').isa('mammal').$)
    }
})


Deno.test({
    name: 'test76',
    fn: () => {


        // alt parser...
        const kb =
            $({ parse: ['x:thing|and', 'y:thing|'] }).when($({ parse: 'x:thing' }).and($({ parse: 'y:thing' })))
                .and($({ parse: ['if', 'x:thing|then', 'y:thing|'], }).when($({ parse: 'y:thing' }).if($({ parse: 'x:thing' }))))
                .and($({ parse: ['x:thing|when', 'y:thing|'], }).when($({ parse: 'x:thing' }).when($({ parse: 'y:thing' }))))
                .and($('in').isa('preposition')) // currently not being used fully because cannot subst name of complement because it's a POJO key
                .and($({ parse: ['the', 'x:thing|whose', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).whose($({ parse: 'y:thing' }))))
                .and($({ parse: ['x:thing|does', 'y:thing', 'z:thing|w:preposition', 'w:thing|'] }).when($({ parse: 'x:thing' }).does($({ parse: 'y:thing' }))._($({ parse: 'z:thing' })).in($({ parse: 'w:thing' }))))
                .and($({ parse: ['x:thing|does', 'y:thing', 'z:thing|'] }).when($({ parse: 'x:thing' }).does($({ parse: 'y:thing' }))._($({ parse: 'z:thing' }))))
                .and($({ parse: ['the', 'x:thing|which', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).which($({ parse: 'y:thing' }))))
                .and($({ parse: ['is', 'a', 'y:thing'], }).when($._.isa($({ parse: 'y:thing' }))))
                .and($({ parse: ['x:thing|is', 'a', 'y:thing'], }).when($({ parse: 'x:thing' }).isa($({ parse: 'y:thing' }))))
                .and($('has').and('have').isa('habere'))
                .and($({ parse: ['x:thing|x:habere', 'y:thing|as', 'z:thing|'] }).when($({ parse: 'x:thing' }).has($({ parse: 'y:thing' })).as($({ parse: 'z:thing' }))))
                .and($({ parse: ['the', 'x:thing|in', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).in($({ parse: 'y:thing' }))))
                .and($({ parse: ['the', 'x:thing'] }).when($.the($({ parse: 'x:thing' }))))
                .and($({ parse: ['[', 'x:thing|]'] }).when($('x:thing')))
                .and($({ parse: ['(', 'x:thing|)'] }).when($({ parse: 'x:thing' })))
                .and($({ parse: ['x:thing'] }).when('x:thing'))
                .and($({ parse: 'x:thing' }).when('x:thing'))
                .dump()

        // const xThingAnd = $('x:thing|and').suchThat($({parse:'x:thing'}).isa('thing')).$

        const code = '( if x is a cat then y is a dog )'.split(' ')
        const r = parse($({ parse: code, }).$, kb)
        assertEquals(r, $('y').isa('dog').if($('x').isa('cat')).$)
        assertEquals(parse($({ parse: '( if the cat is a feline then the dog is a canine )'.split(' ') }).$, kb), $.the('dog').isa('canine').if($.the('cat').isa('feline')).$)
        assertEquals(parse($({ parse: 'the cat whose x is a y'.split(' ') }).$, kb), $.the('cat').whose($('x').isa('y')).$)
        assertEquals(parse($({ parse: '[ capra x:ciao ]'.split(' ') }).$, kb), $(['capra', 'x:ciao']).$)
        assertEquals(parse($({ parse: 'the cat and the dog'.split(' ') }).$, kb), $.the('cat').and($.the('dog')).$)
        assertEquals(parse($({ parse: '( cat and dog ) and meerkat'.split(' ') }).$, kb), $('cat').and('dog').and('meerkat').$)
        assertEquals(parse($({ parse: 'cat and dog and meerkat'.split(' ') }).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($({ parse: 'cat and ( dog and meerkat )'.split(' ') }).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($({ parse: 'the animal which is a cat'.split(' ') }).$, kb), $.the('animal').which($._.isa('cat')).$)
        assertEquals(parse($({ parse: '( x and y and z ) is a mammal'.split(' ') }).$, kb), $('x').and($('y').and('z')).isa('mammal').$)
        assertEquals(parse($({ parse: 'the cat does eat the mouse'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse')).$)
        assertEquals(parse($({ parse: 'the cat does eat the mouse in the house'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$)
        assertEquals(parse($({ parse: 'the cat does eat ( the mouse in the house )'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse').in($.the('house'))).$)
        assertEquals(parse($({ parse: 'it when the thing'.split(' ') }).$, kb), $('it').when($.the('thing')).$)
        assertEquals(parse($({ parse: 'cat has high as hunger'.split(' ') }).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($({ parse: 'cat have high as hunger'.split(' ') }).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($({ parse: 'the cat is a feline when the sky has blue as color'.split(' ') }).$, kb), $.the('cat').isa('feline').when($.the('sky').has('blue').as('color')).$)

        // console.log(parse($({ parse: '[ la x:thing ] when the x:thing'.split(' ') }).$, kb))


        // console.log(parse($({ parse: 'is a cat'.split(' ') }).$, kb))
        // console.log(parse($({ parse: '[ la x:thing ] when the thing'.split(' ') }).$, kb))
        // console.log(parse($({ parse: '( x and y and z ) is a mammal'.split(' ') }).$, kb))
        // assertEquals( , $('cat').and('dog').and('meerkat').$)
        // console.log(parse($({ parse: '( cat and dog ) and meerkat'.split(' ') }).$, kb))
        // console.log(parse($({ parse: 'cat and ( dog and meerkat )'.split(' ') }).$, kb))
        // console.log('-----------')
        // console.log($('cat').and('dog').and('meerkat').$)
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
            $.the('cat').which($._.has('red').as('color')).does('eat')._($.the('mouse').whose($('color').is('black'))).$,
        ]

        const oracle = [
            dcs[2],
            dcs[0],
            dcs[1],
        ]

        const sortedDcs = sorted(dcs, (a, b) => compareSpecificities(b, a, $.emptyKb))
        assertEquals(sortedDcs, oracle)
    }
})



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


// Deno.test({
//     name: 'test77',
//     fn: () => {
//         // const x = ask($.a('cat').$, $.emptyKb).result
//         // console.log(x)
//         // console.log($('x:thing|').$)
//         const t = $.the('capra').$//.whose($('fur').is('yellow')).$
//         // const f = $.the('capra').whose($('fur').is('yellow')).$
//         const f = $.the('capra').whose($('fur').is('yellow')).$
//         console.log(match(t, f, $.emptyKb))
//     }
// })