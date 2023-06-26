import { assertEquals, assertObjectMatch } from 'https://deno.land/std@0.186.0/testing/asserts.ts';
import { getParser } from '../parser/parser.ts';
import { syntaxes } from './grammar.ts';

const parse = (sourceCode: string) => getParser({ syntaxes, log: false }).parse(sourceCode)

Deno.test({
    name: 'test1',
    fn: () => {
        const r = parse('the best buruf of calabria')
        // console.log(r)
        assertObjectMatch(r as object, {
            head: 'buruf',
            modifiers: ['best'],
            owner: {
                head: 'calabria',
                type: 'noun-phrase',
            },
            type: 'noun-phrase',
        })
    }
})

Deno.test({
    name: 'test2',
    fn: () => {
        const r = parse('x of matrix is red')
        // console.log(r)

        assertObjectMatch(r as object, {
            subject: {
                head: 'x',
                owner: {
                    head: 'matrix',
                }
            },
            object: {
                head: 'red',
            }
        })

    }
})


Deno.test({
    name: 'test3',
    fn: () => {
        const r = parse('if x is big then y is small')
        // console.log(r)

        assertObjectMatch(r as object, {
            condition: {
                subject: { head: 'x' },
                object: { head: 'big' },
                type: 'copula-sentence',
            },
            consequence: {
                subject: { head: 'y' },
                object: { head: 'small' },
                type: 'copula-sentence',
            },
            type: 'if-sentence',
        })
    }
})


Deno.test({
    name: 'test4',
    fn: () => {
        const r = parse('x is not red')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "x", type: "noun-phrase" },
            negation: "not",
            object: { head: "red", type: "noun-phrase" },
            type: "copula-sentence"
        })
    }
})

Deno.test({
    name: 'test5',
    fn: () => {
        const r = parse("the car's door")
        // console.log(r)
        assertObjectMatch(r as object, {
            owner: 'car',
            head: 'door',
        })
    }
})

Deno.test({
    name: 'test6',
    fn: () => {
        const r = parse('the cat does eat the rat')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "cat", type: "noun-phrase" },
            verb: "eat",
            object: { head: "rat", type: "noun-phrase" },
            type: "verb-sentence"
        })
    }
})


Deno.test({
    name: 'test7',
    fn: () => {
        const r = parse('x is more stupid than y')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "x", type: "noun-phrase" },
            comparison: "stupid",
            object: { head: "y", type: "noun-phrase" },
            type: "comparative-sentence"
        })
    }
})


Deno.test({
    name: 'test8',
    fn: () => {
        const r = parse('a counter has a number as a value')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "counter", type: "noun-phrase" },
            object: { head: "number", type: "noun-phrase" },
            role: { head: "value", type: "noun-phrase" },
            type: "has-sentence"
        })
    }
})


Deno.test({
    name: 'test9',
    fn: () => {
        const r = parse('the cat does eat the mouse and the cat does enjoy it')
        // console.log(r)
        assertObjectMatch(r as object, {
            first: {
                subject: { head: "cat", type: "noun-phrase" },
                verb: "eat",
                object: { head: "mouse", type: "noun-phrase" },
                type: "verb-sentence"
            },
            second: {
                subject: { head: "cat", type: "noun-phrase" },
                verb: "enjoy",
                object: { head: "it", type: "noun-phrase" },
                type: "verb-sentence"
            },
            type: "and-sentence"
        })
    }
})

Deno.test({
    name: 'test10',
    fn: () => {
        const r = parse('a button where it is green')
        // console.log(r)
        assertObjectMatch(r as object, {
            head: "button",
            suchThat: {
                subject: { head: "it", type: "noun-phrase" },
                object: { head: "green", type: "noun-phrase" },
                type: "copula-sentence"
            },
            type: "noun-phrase"
        })
    }
})

Deno.test({
    name: 'test11',
    fn: () => {
        const r = parse('you do give a five to me in the car')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "you", type: "noun-phrase" },
            verb: "give",
            object: { head: "five", type: "noun-phrase" },
            receiver: { head: "me", type: "noun-phrase" },
            location: { head: "car", type: "noun-phrase" },
            type: "verb-sentence"
        })
    }
})

Deno.test({
    name: 'test12',
    fn: () => {
        const r = parse('there is a red cat')
        // console.log(r)
        assertObjectMatch(r as object, {
            subject: { modifiers: ["red"], head: "cat", type: "noun-phrase" },
            type: "there-is-sentence"
        })
    }
})


Deno.test({
    name: 'test13',
    fn: () => {
        const r = parse('')
        assertEquals(r as object, undefined)
    }
})