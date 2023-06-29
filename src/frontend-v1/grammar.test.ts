import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts"
import { getParser } from "../parser/parser.ts"
import { syntaxes } from "./grammar.ts"
import { $ } from "../core/exp-builder.ts"

const parser = getParser({ syntaxes })


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
        assertEquals(ast, {
            t1: { name: "x", varType: "capra", type: "variable" },
            t2: { value: "capra", type: "entity" },
            type: "is-a-formula"
        })
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
        const ast = parser.parse('x equals capra and y equals buruf and z equals scemo')
        assertEquals(ast, {
            f1: {
                t1: { value: "x", type: "entity" },
                t2: { value: "capra", type: "entity" },
                type: "equality"
            },
            f2: {
                f1: {
                    t1: { value: "y", type: "entity" },
                    t2: { value: "buruf", type: "entity" },
                    type: "equality"
                },
                f2: {
                    t1: { value: "z", type: "entity" },
                    t2: { value: "scemo", type: "entity" },
                    type: "equality"
                },
                type: "conjunction"
            },
            type: "conjunction"
        })
    }
})

Deno.test({
    name: 'test10',
    fn: () => {
        const ast = parser.parse('it is not the case that x equals y')
        assertEquals(ast, {
            f1: {
                t1: { value: "x", type: "entity" },
                t2: { value: "y", type: "entity" },
                type: "equality"
            },
            type: "negation"
        })
    }
})

Deno.test({
    name: 'test11',
    fn: () => {
        const ast = parser.parse('there exists a x:cat where x:cat has red as color ')
        assertEquals(ast, {
            variable: { name: "x", varType: "cat", type: "variable" },
            where: {
                t1: { name: "x", varType: "cat", type: "variable" },
                t2: { value: "red", type: "entity" },
                as: { value: "color", type: "entity" },
                type: "has-formula"
            },
            type: "existquant"
        })
    }
})


Deno.test({
    name: 'test12',
    fn: () => {
        const ast = parser.parse('x:cat equals red when x:cat has red as color')
        assertEquals(ast, {
            conseq: {
                t1: { name: "x", varType: "cat", type: "variable" },
                t2: { value: "red", type: "entity" },
                type: "equality"
            },
            when: {
                t1: { name: "x", varType: "cat", type: "variable" },
                t2: { value: "red", type: "entity" },
                as: { value: "color", type: "entity" },
                type: "has-formula"
            },
            type: "derived-prop"
        })
    }
})



Deno.test({
    name: 'test13',
    fn: () => {
        const ast = parser.parse('if x equals capra then x equals stupid else x equals smart')
        assertEquals(ast, {
            condition: {
                t1: { value: "x", type: "entity" },
                t2: { value: "capra", type: "entity" },
                type: "equality"
            },
            then: {
                t1: { value: "x", type: "entity" },
                t2: { value: "stupid", type: "entity" },
                type: "equality"
            },
            otherwise: {
                t1: { value: "x", type: "entity" },
                t2: { value: "smart", type: "entity" },
                type: "equality"
            },
            type: "if-else"
        })
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
        assertEquals(ast, {
            event: { value: "eventxy", type: "entity" },
            type: "happen-sentence"
        })
    }
})


Deno.test({
    name: 'test16',
    fn: () => {
        const ast = parser.parse('2 > 1')
        assertEquals(ast, {
            left: { value: 2, type: "number" },
            operator: ">",
            right: { value: 1, type: 'number' },
            type: "math-expression"
        })
    }
})


Deno.test({
    name: 'test17',
    fn: () => {
        const ast = parser.parse('x:capra does climb the x:mount such that x:mount has green as color ')
        assertEquals(ast, {
            keys: {
                subject: { name: "x", varType: "capra", type: "variable" },
                verb: { value: "climb", type: "entity" },
                object: {
                    head: { name: "x", varType: "mount", type: "variable" },
                    description: {
                        t1: { name: "x", varType: "mount", type: "variable" },
                        t2: { value: "green", type: "entity" },
                        as: { value: "color", type: "entity" },
                        type: "has-formula"
                    },
                    type: "anaphor"
                },
                type: "verb-sentence"
            },
            type: "generalized"
        })
    }
})

Deno.test({
    name: 'test18',
    fn: () => {
        const ast = parser.parse('capra equals scema!')

        assertEquals(ast, {
            f1: {
                t1: { value: "capra", type: "entity" },
                t2: { value: "scema", type: "entity" },
                type: "equality"
            },
            type: "command"
        })
    }
})

Deno.test({
    name: 'test19',
    fn: () => {
        const ast = parser.parse('capra equals scema?')

        assertEquals(ast, {
            f1: {
                t1: { value: "capra", type: "entity" },
                t2: { value: "scema", type: "entity" },
                type: "equality"
            },
            type: "question"
        })
    }
})



Deno.test({
    name: 'test20',
    fn: () => {
        const ast = parser.parse('annotx: capra equals stupid')
        assertEquals(ast, {
            keys: {
                annotation: { value: "annotx", type: "entity" },
                t1: { value: "capra", type: "entity" },
                t2: { value: "stupid", type: "entity" },
                type: "annotation"
            },
            type: "generalized"
        })
    }
})


Deno.test({
    name: 'test21',
    fn: () => {
        const ast = parser.parse('x does eat capra in y to z!')

        assertEquals(ast, {
            f1: {
                keys: {
                    subject: { value: "x", type: "entity" },
                    verb: { value: "eat", type: "entity" },
                    object: { value: "capra", type: "entity" },
                    location: { value: "y", type: "entity" },
                    recipient: { value: "z", type: "entity" },
                    type: "verb-sentence"
                },
                type: "generalized"
            },
            type: "command"
        })
    }
})

Deno.test({
    name: 'test22',
    fn: () => {
        const ast = parser.parse('the x:cat')
        assertEquals(ast, {
            head: { name: "x", varType: "cat", type: "variable" },
            type: "anaphor"
        })
    }
})


Deno.test({
    name: 'test23',
    fn: () => {
        const ast = parser.parse('"ciao mondo!"')
        assertEquals(ast, $('"ciao mondo!"').$)
    }
})