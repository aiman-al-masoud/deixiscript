import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts"
import { getParser } from "../parser/parser.ts"
import { syntaxes } from "./grammar.ts"
import { $ } from "../core/exp-builder.ts"
import { linearize } from "../parser/linearize.ts"


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
        const ast = parser.parse('false')
        assertEquals(ast, $(false).$)
    }
})

Deno.test({
    name: 'test0',
    fn: () => {
        const ast = parser.parse('true')
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
        const ast = parser.parse('[x:capra y:capra capra ] ')
        assertEquals(ast, $(['x:capra', 'y:capra', 'capra']).$);
    }
})

Deno.test({
    name: 'test5',
    fn: () => {
        const ast = parser.parse('x:seq|e:event')
        assertEquals(ast, $('x:seq|e:event').$)
    }
})

Deno.test({
    name: 'test6',
    fn: () => {
        const ast = parser.parse('capra equals capra')
        assertEquals(ast, $('capra').equals('capra').$)
    }
})

Deno.test({
    name: 'test7',
    fn: () => {
        const ast = parser.parse('x:capra is a capra')
        assertEquals(ast, $('x:capra').isa('capra').$)
        const ast2 = parser.parse('x:capra is an entity')
        assertEquals(ast2, $('x:capra').isa('entity').$)
    }
})

Deno.test({
    name: 'test8',
    fn: () => {
        const dc = $.the('screen').has('red').as('color').after($('x:button').has('down').as('state')).$
        const ast = parser.parse('the screen has red as color after x:button has down as state')
        assertEquals(dc, ast)
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

// Deno.test({
//     name: 'test11',
//     fn: () => {
//         const ast = parser.parse('there exists a x:cat where x:cat has red as color ')

//         assertEquals(ast,
//             $('x:cat').exists.where($('x:cat').has('red').as('color')).$)

//     }
// })

// Deno.test({
//     name: 'test12',
//     fn: () => {
//         const ast = parser.parse('x:cat does be red when x:cat has red as color')
//         assertEquals(ast,
//             $({ subject: 'x:cat', verb: 'be', object: 'red' }).when($('x:cat').has('red').as('color')).$)
//     }

// })

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
        const ast = parser.parse('1 + x:capra')
        assertEquals(ast, $(1).plus('x:capra').$)
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
        // const ast = parser.parse('x:capra does climb the x:mount such that x:mount has green as color ') 
        // assertObjectMatch(ast, $({ subject: 'x:capra', verb: 'climb', object: $('x:mount').suchThat($('x:mount').has('green').as('color')).$ }).$)
    }
})

Deno.test({
    name: 'test18',
    fn: () => {
        const ast = parser.parse('capra is scema!')
        assertEquals(ast, $('capra').is('scema').tell.$)
    }
})

Deno.test({
    name: 'test19',
    fn: () => {
        const ast = parser.parse('capra is scema?')
        assertEquals(ast, $('capra').is('scema').ask.$)
    }
})


Deno.test({
    name: 'test20',
    fn: () => {
        const ast = parser.parse('annotx: capra equals stupid')
        assertEquals(ast, $({ annotation: 'annotx', subject: 'capra', object: 'stupid' }).$)
    }
})


Deno.test({
    name: 'test21',
    fn: () => {
        const ast = parser.parse('x does eat capra in y to z')
        assertEquals(ast, $({ subject: 'x', verb: 'eat', object: 'capra', location: 'y', recipient: 'z' }).$)
    }
})

Deno.test({
    name: 'test22',
    fn: () => {
        // const ast = parser.parse('the x:cat')
        // assertEquals(ast, $('x:cat').suchThat().$)
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
    name: 'test25',
    fn: () => {
        const ast = parser.parse('does jump in the car')
        assertEquals(ast, $({ subject: $._.$, verb: 'jump', object: $._.$, location: $.the('car').$ }).$)
        const ast2 = parser.parse('has red as color')
        assertEquals(ast2, $._.has('red').as('color').$)
        const ast3 = parser.parse('the cat')
        assertEquals(ast3, $.the('cat').$)
        const ast4 = parser.parse('the cat whose fur has red as color')
        assertEquals(ast4, $.the('cat').whose($('fur').has('red').as('color')).$)
        const ast5 = parser.parse('a cat which has red as color')
        assertEquals(ast5, $.the('cat').which($._.has('red').as('color')).$)
        const ast6 = parser.parse('the cat which has red as color does eat the mouse')
        assertEquals(ast6, $({ subject: $.the('cat').which($._.has('red').as('color')).$, verb: 'eat', object: $.the('mouse').$ }).$)
        const ast7 = parser.parse('the mouse which the cat does eat')
        assertEquals(ast7, $.the('mouse').which($({ subject: $.the('cat').$, verb: 'eat', object: $._.$ })).$)
    }
})

Deno.test({
    name: 'test26',
    fn: () => {
        const ast1 = parser.parse('the cat does eat (the mouse) in the house')
        const ast2 = parser.parse('the cat does eat (the mouse in the house)')

        const x = $.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$
        const y = $.the('cat').does('eat')._($.the('mouse').in($.the('house').$)).$

        assertEquals(ast1, x)
        assertEquals(ast2, y)
    }
})



Deno.test({
    name: 'test27',
    fn: () => {
        const ast1 = parser.parse('1* 1 + 2')
        const ast2 = parser.parse('(2*3)+2')
        const ast3 = parser.parse('2*(3+2)')
        const ast4 = parser.parse('1*(1+ (2/3))')
        const ast5 = parser.parse('1*( the number + (2/3))')
        const ast6 = parser.parse('(1 * 1 + 2)')

        assertEquals(ast1, $(1).times($(1).plus(2).$).$)
        assertEquals(ast2, $(2).times(3).plus(2).$)
        assertEquals(ast3, $(2).times($(3).plus(2).$).$)
        assertEquals(ast4, $(1).times($(1).plus($(2).over(3).$).$).$)
        assertEquals(ast5, $(1).times($.the('number').plus($(2).over(3).$).$).$)
        assertEquals(ast6, $(1).times($(1).plus(2).$).$)

    }
})


Deno.test({
    name: 'test28',
    fn: () => {
        const ast1 = parser.parse('the button is red')
        assertEquals(ast1, $.the('button').is('red').$)

        const ast2 = parser.parse('the button which is in the div is red')
        assertEquals(ast2, $({ subject: $.the('button').which($({ subject: $._.$, verb: 'be', object: $._.$, location: $.the('div').$ })).$, verb: 'be', object: 'red' }).$)
    }
})


Deno.test({
    name: 'test29',
    fn: () => {
        const ast1 = parser.parse('there is a cat')
        assertEquals(ast1, $.a('cat').exists.$)

        const ast2 = parser.parse('there is the goat which has white as color')
        assertEquals(ast2, $.the('goat').which($._.has('white').as('color')).exists.$)
    }
})



Deno.test({
    name: 'test30',
    fn: () => {

        const ast1 = $.the('capra').which($._.has('black').as('color')).has('scemo').as('friend').$
        const x = linearize(ast1, syntaxes)

        const ast2 = $.the('capra').whose($('tail').has('black').as('color')).has('scemo').as('friend').$
        const y = linearize(ast2, syntaxes)

        const ast3 = $.the('cat').does('eat')._($.a('mouse')).when($(true).equals(true)).$
        const z = linearize(ast3, syntaxes)

        assertEquals(parser.parse(x), ast1)
        assertEquals(parser.parse(y), ast2)
        assertEquals(parser.parse(z), ast3)

    }
})

Deno.test({
    name: 'test31',
    fn: () => {
        const ast = parser.parse('the gift for you')
        const check = $.the('gift').for('you').$
        assertEquals(ast, check)

        const ast2 = parser.parse('you do work for the cat')
        const check2 = $('you').does('work').for($.the('cat')).$
        assertEquals(ast2, check2)

    }
})

Deno.test({
    name: 'test32',
    fn: () => {
        //kebab case
        assertEquals(
            parser.parse('press-state'),
            $('press-state').$
        )
    }
})