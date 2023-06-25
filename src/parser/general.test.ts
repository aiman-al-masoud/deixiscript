// import { assertObjectMatch } from 'https://deno.land/std@0.186.0/testing/asserts.ts';
// import { getParser } from './parser.ts';
// import { SyntaxMap } from "./types.ts";


// export const syntaxes: SyntaxMap<
//     'id' | 'digits' | 'subject' | 'object' | 'head' | 'owner' | 'modifiers' | 'condition' | 'consequence' | 'negation',
//     'copula-sentence' | 'noun-phrase' | 'space' | 'identifier' | 'number-literal' | 'genitive' | 'if-sentence' | 'sentence' | 'saxon'>
//     = {

//     space: [
//         { number: '+', literals: [' ', '\n', '\t'] }
//     ],
//     identifier: [
//         { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ':'], notEndWith: 's' }
//     ],
//     'number-literal': [
//         { number: '+', role: 'digits', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
//     ],
//     'noun-phrase': [
//         { literals: ['the', 'a', 'an'], number: '1|0' },
//         { types: ['space'], number: '1|0' },
//         { types: ['identifier'], role: 'modifiers', number: 'all-but-last', sep: 'space' },
//         { types: ['space'], number: '1|0' },
//         { types: ['saxon'], number: '1|0', expand: true },
//         { types: ['space'], number: '1|0' },
//         { types: ['identifier'], role: 'head' },
//         { types: ['space'], number: '1|0' },
//         { types: ['genitive'], number: '1|0', expand: true },
//     ],
//     'genitive': [
//         { literals: ['of'] },
//         { types: ['space'] },
//         { types: ['noun-phrase'], role: 'owner' },
//     ],

//     'saxon': [
//         { types: ['identifier'], role: 'owner' },
//         { literals: ["'s"] },
//     ],

//     'copula-sentence': [
//         { types: ['noun-phrase'], role: 'subject' },
//         { types: ['space'], number: '1|0' },
//         { literals: ['is', 'are', 'be'] },
//         { types: ['space'], number: '1|0' },
//         { literals: ['not'], role: 'negation', number: '1|0' },
//         { types: ['space'], number: '1|0' },
//         { types: ['noun-phrase'], role: 'object' },
//     ],
//     'if-sentence': [
//         { literals: ['if'] },
//         { types: ['space'], number: '1|0' },
//         { types: ['sentence'], role: 'condition' },
//         { types: ['space'], number: '1|0' },
//         { literals: ['then'] },
//         { types: ['space'], number: '1|0' },
//         { types: ['sentence'], role: 'consequence' },
//     ],
//     'sentence': [
//         { types: ['copula-sentence', 'if-sentence'], expand: 'keep-specific-type' }
//     ]
// }



// const $ = (sourceCode: string) => getParser(sourceCode, syntaxes)

// Deno.test({
//     name: 'test1',
//     fn: () => {
//         const r = $('the best buruf of calabria').parse()
//         console.log(r)
//         assertObjectMatch(r as object, {
//             head: 'buruf',
//             modifiers: ['best'],
//             owner: {
//                 head: 'calabria',
//                 type: 'noun-phrase',
//             },
//             type: 'noun-phrase',
//         })
//     }
// })

// Deno.test({
//     name: 'test2',
//     fn: () => {
//         const r = $('x of matrix is red').parse()
//         console.log(r)

//         assertObjectMatch(r as object, {
//             subject: {
//                 head: 'x',
//                 owner: {
//                     head: 'matrix',
//                 }
//             },
//             object: {
//                 head: 'red',
//             }
//         })

//     }
// })


// Deno.test({
//     name: 'test3',
//     fn: () => {
//         const r = $('if x is big then y is small').parse()
//         console.log(r)

//         assertObjectMatch(r as object, {
//             condition: {
//                 subject: { head: 'x' },
//                 object: { head: 'big' },
//                 type: 'copula-sentence',
//             },
//             consequence: {
//                 subject: { head: 'y' },
//                 object: { head: 'small' },
//                 type: 'copula-sentence',
//             },
//             type: 'if-sentence',
//         })
//     }
// })


// Deno.test({
//     name: 'test4',
//     fn: () => {
//         const r = $('x is not red').parse()
//         console.log(r)
//         assertObjectMatch(r as object, {
//             subject: { head: "x", type: "noun-phrase" },
//             negation: "not",
//             object: { head: "red", type: "noun-phrase" },
//             type: "copula-sentence"
//         })
//     }
// })

// Deno.test({
//     name: 'test5',
//     fn: () => {
//         const r = $("the car's door").parse()
//         console.log(r)
//         assertObjectMatch(r as object, {
//             owner: 'car',
//             head: 'door',
//         })
//     }
// })