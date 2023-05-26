import { assertObjectMatch } from 'https://deno.land/std@0.186.0/testing/asserts.ts';
import { getParser } from '../parser/parser.ts';
import { syntaxes } from './grammar.ts';

const $ = (sourceCode: string) => getParser(sourceCode, syntaxes)

Deno.test({
    name: 'test1',
    fn: () => {
        const r = $('the best buruf of calabria').parse()
        console.log(r)
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
        const r = $('x of matrix is red').parse()
        console.log(r)

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
        const r = $('if x is big then y is small').parse()
        console.log(r)

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
        const r = $('x is not red').parse()
        console.log(r)
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
        const r = $("the car's door").parse()
        console.log(r)
        assertObjectMatch(r as object, {
            owner: 'car',
            head: 'door',
        })
    }
})

Deno.test({
    name: 'test6',
    fn: () => {
        const r = $('the cat does eat the rat').parse()
        console.log(r)
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
        const r = $('x is more stupid than y').parse()
        console.log(r)
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
        const r = $('a counter has a number as a value').parse()
        console.log(r)
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
        const r = $('the cat does eat the mouse and the cat does enjoy it').parse()
        console.log(r)
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
        const r = $('a button where it is green').parse()
        console.log(r)
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
        const r = $('you do give a five to me').parse()
        console.log(r)
        assertObjectMatch(r as object, {
            subject: { head: "you", type: "noun-phrase" },
            verb: "give",
            object: { head: "five", type: "noun-phrase" },
            receiver: { head: "me", type: "noun-phrase" },
            type: "verb-sentence"
        })
    }
})