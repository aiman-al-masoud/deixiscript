import { assertEquals, assertObjectMatch } from 'https://deno.land/std@0.186.0/testing/asserts.ts';
import { getParser } from '../parser/parser.ts';
// import { syntaxes } from './grammar.ts';

import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'
import { generateTypes } from '../parser/generate-types.ts'

const astTypes = stringLiterals('copula-sentence', 'noun-phrase', 'number-literal', 'verb-sentence', 'if-sentence', 'comparative-sentence', 'has-sentence', 'and-sentence', 'there-is-sentence')
const cstTypes = stringLiterals('saxon-genitive', 'of-genitive', 'sentence', 'space', 'identifier', 'such-that-phrase', 'to-dative', 'in-locative', 'complement',)
const roles = stringLiterals('id', 'digits', 'subject', 'object', 'head', 'owner', 'modifiers', 'condition', 'consequence', 'negation', 'verb', 'comparison', 'role', 'pluralizer', 'first', 'second', 'suchThat', 'receiver', 'location',)

type StType = ElementType<typeof astTypes> | ElementType<typeof cstTypes>
type Role = ElementType<typeof roles>

export const syntaxes: SyntaxMap<
    Role,
    StType
> = {
    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ':'], notEndWith: 's' }
    ],
    'number-literal': [
        { number: '+', role: 'digits', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'noun-phrase': [
        { literals: ['the', 'an', 'a',], number: '1|0' }, // an comes first! very important!
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'modifiers', number: 'all-but-last', sep: 'space' },
        { types: ['space'], number: '1|0' },
        { types: ['saxon-genitive'], number: '1|0', expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'head' },
        { literals: ['s'], number: '1|0', role: 'pluralizer' },
        { types: ['space'], number: '1|0' },
        { types: ['of-genitive'], number: '1|0', expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['such-that-phrase'], number: '1|0', expand: true }
    ],
    'such-that-phrase': [
        { literals: ['where'] },
        { types: ['sentence'], role: 'suchThat' },
    ],
    'of-genitive': [
        { literals: ['of'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'owner' },
    ],
    'saxon-genitive': [
        { types: ['identifier'], role: 'owner' },
        { literals: ["'s"] },
    ],
    'copula-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['is', 'are', 'be'] },
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
        { types: ['space'], number: '1|0' },
        { types: ['complement'], expand: true, number: '*' },
    ],
    'verb-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['does', 'do'] },
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'verb' },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['complement'], expand: true, number: '*' },
    ],
    'if-sentence': [
        { literals: ['if'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence'], role: 'condition' },
        { types: ['space'], number: '1|0' },
        { literals: ['then'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence'], role: 'consequence' },
    ],
    'sentence': [
        { types: ['copula-sentence', 'if-sentence', 'verb-sentence', 'comparative-sentence', 'has-sentence'], expand: 'keep-specific-type' }
    ],
    'comparative-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['is', 'are', 'be'] },
        { types: ['space'], number: '1|0' },
        { literals: ['more'] },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'comparison' },
        { types: ['space'], number: '1|0' },
        { literals: ['than'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
    ],
    'has-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['has', 'have'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
        { types: ['space'], number: '1|0' },
        { literals: ['as'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'role' },
    ],
    'and-sentence': [
        { types: ['sentence'], role: 'first' },
        { types: ['space'], number: '1|0' },
        { literals: ['and'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence', 'and-sentence'], role: 'second' },
    ],
    'to-dative': [
        { literals: ['to'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'receiver' },
    ],
    'in-locative': [
        { literals: ['in'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'location' },
    ],
    'complement': [
        { types: ['to-dative', 'in-locative'], expand: true, sep: 'space' }
    ],
    'there-is-sentence': [
        { literals: ['there is'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'subject' },
    ]

}


/**
 * REMEMBER to re-run this file whenever you edit the syntaxes, so as 
 * to update the typescript AST types.
 */
if (import.meta.main) {
    console.log(generateTypes([...astTypes, 'sentence'], syntaxes))
}

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

Deno.test({
    name: 'test14',
    fn: () => {
        const parser = getParser({ syntaxes })
        const x = parser.parse('1 2 3')
        const y = parser.parse()
        const z = parser.parse()
        const w = parser.parse()
        const k = parser.parse()
        assertEquals(x, '1')
        assertEquals(y, { type: "space" })
        assertEquals(z, '2')
        assertEquals(w, { type: "space" })
        assertEquals(k, '3')
    }
})