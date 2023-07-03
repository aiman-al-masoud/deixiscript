import { assertEquals, assertObjectMatch } from "https://deno.land/std@0.186.0/testing/asserts.ts"
import { getParser } from "../parser/parser.ts"
import { syntaxes } from "./grammar.ts"
import { $ } from "../core/exp-builder.ts"

const parser = getParser({ syntaxes })


Deno.test({
    name: 'test-2',
    fn: () => {
        assertEquals(parser.parse('[]'), $([]).$)
    }
})

Deno.test({
    name: 'test-1',
    fn: () => {
        const ast = parser.parse('false') as unknown
        assertEquals(ast, $(false).$)
    }
})

Deno.test({
    name: 'test0',
    fn: () => {
        const ast = parser.parse('true') as unknown
        assertEquals(ast, $(true).$)
    }
})

Deno.test({
    name: 'test1',
    fn: () => {
        const ast = parser.parse('10')
        assertEquals(ast, $(10).$)
    }
})

Deno.test({
    name: 'test2',
    fn: () => {
        const ast = parser.parse('capra')
        assertEquals(ast, $('capra').$)
    }
})

Deno.test({
    name: 'test3',
    fn: () => {
        const ast = parser.parse('x:capra')
        assertEquals(ast, $('x:capra').$)
    }
})

Deno.test({
    name: 'test4',
    fn: () => {
        const ast = parser.parse('[x:capra y:capra capra ] ') as unknown
        assertEquals(ast, $(['x:capra', 'y:capra', 'capra']).$);
    }
})

Deno.test({
    name: 'test5',
    fn: () => {
        const ast = parser.parse('x:seq|e:event') as unknown
        assertEquals(ast, $('x:seq|e:event').$)
    }
})

Deno.test({
    name: 'test6',
    fn: () => {
        const ast = parser.parse('capra equals capra') as unknown
        assertEquals(ast, $('capra').equals('capra').$)
    }
})

Deno.test({
    name: 'test7',
    fn: () => {
        const ast = parser.parse('x:capra is a capra')
        assertEquals(ast, $('x:capra').isa('capra').$)
    }
})


Deno.test({
    name: 'test8',
    fn: () => {
        const ast = parser.parse('x:capra has 0 as intelligence after [eventxy]') as unknown
        assertEquals(ast, $('x:capra').has(0).as('intelligence').after(['eventxy']).$)
    }
})

Deno.test({
    name: 'test9',
    fn: () => {
        const ast =
            parser.parse('x equals capra and y equals buruf and z equals scemo')

        assertEquals(ast,
            $('x').equals('capra').and($('y').equals('buruf').and($('z').equals('scemo'))).$)


    }
})

Deno.test({
    name: 'test10',
    fn: () => {
        const ast = parser.parse('it is not the case that x equals y')
        assertEquals(ast, $('x').equals('y').isNotTheCase.$)
    }
})

Deno.test({
    name: 'test11',
    fn: () => {
        const ast = parser.parse('there exists a x:cat where x:cat has red as color ')

        assertEquals(ast,
            $('x:cat').exists.where($('x:cat').has('red').as('color')).$)

    }
})

Deno.test({
    name: 'test12',
    fn: () => {
        const ast = parser.parse('x:cat does be red when x:cat has red as color') as any
        assertObjectMatch(ast,
            $({ subject: 'x:cat', verb: 'be', object: 'red' }).when($('x:cat').has('red').as('color')).$)
    }

})

Deno.test({
    name: 'test13',
    fn: () => {
        const ast = parser.parse('if x equals capra then x equals stupid else x equals smart')
        assertEquals(ast, $('x').equals('stupid').if($('x').equals('capra')).else($('x').equals('smart')).$)
    }
})

Deno.test({
    name: 'test14',
    fn: () => {
        const ast = parser.parse('1 + x:capra') as unknown
        assertEquals(ast, $(1).plus('x:capra').$)
    }
})

Deno.test({
    name: 'test15',
    fn: () => {
        const ast = parser.parse('eventxy happens')
        assertEquals(ast, $('eventxy').happens.$)
    }
})

Deno.test({
    name: 'test16',
    fn: () => {
        const ast = parser.parse('2 > 1')
        assertEquals(ast, $(2).isGreaterThan(1).$)
    }
})

Deno.test({
    name: 'test17',
    fn: () => {
        const ast = parser.parse('x:capra does climb the x:mount such that x:mount has green as color ') as any
        assertObjectMatch(ast, $({ subject: 'x:capra', verb: 'climb', object: $('x:mount').suchThat($('x:mount').has('green').as('color')).$ as any }).$)
    }
})

Deno.test({
    name: 'test18',
    fn: () => {
        const ast = parser.parse('capra equals scema!')
        assertEquals(ast, $('capra').equals('scema').tell.$)
    }
})

Deno.test({
    name: 'test19',
    fn: () => {
        const ast = parser.parse('capra equals scema?')
        assertEquals(ast, $('capra').equals('scema').ask.$)
    }
})


Deno.test({
    name: 'test20',
    fn: () => {
        const ast = parser.parse('annotx: capra equals stupid') as any
        assertObjectMatch(ast, $({ annotation: 'annotx', t1: 'capra', t2: 'stupid' }).$)
    }
})


Deno.test({
    name: 'test21',
    fn: () => {
        const ast = parser.parse('x does eat capra in y to z') as any
        assertObjectMatch(ast, $({ subject: 'x', verb: 'eat', object: 'capra', location: 'y', recipient: 'z' }).$)
    }
})

Deno.test({
    name: 'test22',
    fn: () => {
        const ast = parser.parse('the x:cat')
        assertEquals(ast, $('x:cat').suchThat().$)
    }
})

Deno.test({
    name: 'test23',
    fn: () => {
        const ast = parser.parse('"ciao mondo!"')
        assertEquals(ast, $('"ciao mondo!"').$)
    }
})

Deno.test({
    name: 'test24',
    fn: () => {
        const ast = parser.parse('capra does extend mammal')
        console.log(ast)// remove type:'verb-sentence'
    }
})