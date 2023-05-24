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
