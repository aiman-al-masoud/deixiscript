import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts"
import { getParser } from "../parser/parser.ts"
import { syntaxes } from "./grammar.ts"


Deno.test({
    name: 'test0',
    fn: () => {
        const ast = getParser({ sourceCode: 'true', syntaxes }).parse()
        assertEquals(ast, {
            value: 'true',
            type: 'boolean',
        })
    }
})

Deno.test({
    name: 'test1',
    fn: () => {
        const ast = getParser({ sourceCode: '10', syntaxes }).parse()
        assertEquals(ast, {
            value: '10',
            type: 'number',
        })
    }
})

Deno.test({
    name: 'test2',
    fn: () => {
        const ast = getParser({ sourceCode: 'capra', syntaxes }).parse()
        assertEquals(ast, {
            value: 'capra',
            type: 'entity',
        })
    }
})

Deno.test({
    name: 'test3',
    fn: () => {
        const ast = getParser({ sourceCode: 'x:capra', syntaxes }).parse()
        assertEquals(ast, {
            name: 'x',
            type: 'variable',
            varType: 'capra',
        })
    }
})

Deno.test({
    name: 'test4',
    fn: () => {
        const ast = getParser({ sourceCode: '[x:capra y:capra capra ] ', syntaxes }).parse()
        assertEquals(ast, {
            list: [
                { name: "x", varType: "capra", type: "variable" },
                { name: "y", varType: "capra", type: "variable" },
                { value: "capra", type: "entity" }
            ],
            type: "list-literal"
        })
    }
})

Deno.test({
    name: 'test5',
    fn: () => {
        const ast = getParser({ sourceCode: 'x:seq|e:event', syntaxes }).parse()
        assertEquals(ast, {
            seq: { name: "x", varType: "seq", type: "variable" },
            tail: { name: "e", varType: "event", type: "variable" },
            type: "list-pattern"
        })
    }
})

Deno.test({
    name: 'test6',
    fn: () => {
        const ast = getParser({ sourceCode: 'capra is capra', syntaxes }).parse()
        assertEquals(ast, {
            t1: { value: "capra", type: "entity" },
            t2: { value: "capra", type: "entity" },
            type: "equality"
        })
    }
})

Deno.test({
    name: 'test7',
    fn: () => {
        const ast = getParser({ sourceCode: 'x:capra is  a capra', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'x:capra has 0 as intelligence after [eventxy]', syntaxes }).parse()
        assertEquals(ast, {
            t1: { name: "x", varType: "capra", type: "variable" },
            t2: { value: "0", type: "number" },
            as: { value: "intelligence", type: "entity" },
            after: {
                list: [{ value: "eventxy", type: "entity" }],
                type: "list-literal"
            },
            type: "has-formula"
        })
    }
})

Deno.test({
    name: 'test9',
    fn: () => {
        const ast = getParser({ sourceCode: 'x is capra and y is buruf and z is scemo', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'it is not the case that x is y', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'there exists a x:cat where x:cat has red as color ', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'x:cat is red when x:cat has red as color', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'if x is capra then x is stupid else x is smart', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: '1 + x:capra', syntaxes }).parse()
        assertEquals(ast, {
            left: { value: "1", type: "number" },
            operator: "+",
            right: { name: "x", varType: "capra", type: "variable" },
            type: "math-expression"
        })
    }
})

Deno.test({
    name: 'test15',
    fn: () => {
        const ast = getParser({ sourceCode: 'eventxy happens', syntaxes }).parse()
        assertEquals(ast, {
            event: { value: "eventxy", type: "entity" },
            type: "happen-sentence"
        })
    }
})


Deno.test({
    name: 'test16',
    fn: () => {
        const ast = getParser({ sourceCode: '2 > 1', syntaxes }).parse()
        assertEquals(ast, {
            left: { value: "2", type: "number" },
            operator: ">",
            right: { value: "1", type: 'number' },
            type: "math-expression"
        })
    }
})


Deno.test({
    name: 'test17',
    fn: () => {
        const ast = getParser({ sourceCode: 'x:capra does climb the x:mount such that x:mount has green as color ', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'capra is scema!', syntaxes }).parse()

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
        const ast = getParser({ sourceCode: 'capra is scema?', syntaxes }).parse()

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
        const ast = getParser({ sourceCode: 'annotx: capra is stupid', syntaxes }).parse()
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
        const ast = getParser({ sourceCode: 'x does eat capra in y to z!', syntaxes }).parse()

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


