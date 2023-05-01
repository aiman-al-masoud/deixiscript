import { LexemeType } from "../config/LexemeType"
import { ElementType } from "../utils/ElementType"
import { stringLiterals } from "../utils/stringLiterals"

export type Syntax = Member[] // CstModel

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | 'all-but-last'
    | number // currently only supports =1

export const roles = stringLiterals(
    'id',
    'digits',
    'chars',
    'pluralizer',
    'anaphoraOperator',
    'newOperator',
    'modifiers',
    'head',
    'limitKeyword',
    'limitNumber',
    'leftOperand',
    'rightOperand',
    'operator',
    'owner',
    'object',
    'receiver',
    'instrument',
    'subject',
    'verb',
    'negation',
    'condition',
    'consequence',
    'subordinating-conjunction', // BAD
)

export type Role = ElementType<typeof roles>



export type Member = {
    readonly or: string[]
    readonly exceptFor?: string[]
    readonly number?: Cardinality // no number --> 1
    readonly role?: Role // no role, no ast
    readonly expand?: boolean
    readonly sep?: string
}

export type AstType = ElementType<typeof astTypes>

export const astTypes = stringLiterals(
    'space',
    'identifier',
    'string-literal',
    'number-literal',
    'expression', // and-expression
    'math-expression',
    'noun-phrase',
    'limit-phrase',
    'math-expression',
    'complex-sentence',
    'simple-sentence',
    'genitive',
    'dative',
    'instrumental',
    'accusative',
    'verb',
    'copula',
    'do-verb',
    'complement',
    'complex-sentence-one',
    'complex-sentence-two',
)


export const syntaxes: { [x in AstType]: Syntax } = {
    space: [
        { number: '+', or: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', or: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
    ],
    'number-literal': [
        { number: '+', role: 'digits', or: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'string-literal': [
        { or: ['"'] },
        { or: ['any-symbol'], exceptFor: ['"'], role: 'chars' },
        { or: ['"'] },
    ],
    'noun-phrase': [
        { or: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        { or: ['space'] },
        { or: ['the', 'old'], role: 'anaphoraOperator', number: '1|0' },
        { or: ['space'] },
        { or: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        { or: ['space'] },
        { or: ['limit-phrase'], expand: true, number: '1|0' },
        { or: ['space'] },
        { or: ['identifier'], role: 'modifiers', sep: 'space', number: 'all-but-last' },
        { or: ['space'] },
        { or: ['identifier', 'string', 'number'], role: 'head', number: 1 },
        { or: ['s'], role: 'pluralizer', number: '1|0' },
        { or: ['space'] },
        { or: ['genitive'], expand: true, number: '1|0' },
    ],
    'limit-phrase': [
        { or: ['first', 'last'], role: 'limitKeyword', number: 1 },
        { or: ['space'] },
        { or: ['number-literal'], role: 'limitNumber', number: '1|0' },
    ],
    'math-expression': [
        { or: ['noun-phrase'], role: 'leftOperand' },
        { or: ['space'], number: '*' },
        { or: ['+', '-', '*', '/'], role: 'operator', number: '1|0' },
        { or: ['space'], number: '*' },
        { or: ['noun-phrase'], role: 'rightOperand', number: '1|0' }
    ],
    "expression": [
        { or: ['math-expression'], role: 'leftOperand' },
        { or: ['space'] },
        { or: ['and'], number: '1|0' },
        { or: ['space'] },
        { or: ['math-expression'], role: 'rightOperand', number: '1|0' }
    ],

    'genitive': [
        { or: ['of'] },
        { or: ['space'] },
        { or: ['noun-phrase'], role: 'owner', number: 1 },
    ],

    'accusative': [
        { or: ['noun-phrase'], role: 'object', number: 1 },
    ],

    'dative': [
        { or: ['to'] },
        { or: ['space'] },
        { or: ['noun-phrase'], role: 'receiver', number: 1 },
    ],

    'instrumental': [
        { or: ['by'] },
        { or: ['space'] },
        { or: ['noun-phrase'], role: 'instrument', number: 1 },
    ],

    'complement': [
        { or: ['accusative', 'dative', 'instrumental'], expand: true, number: '*' }
    ],

    'simple-sentence': [
        { or: ['expression'], role: 'subject', number: '1|0' },
        { or: ['verb'], expand: true },
        { or: ['complement'], number: '*', expand: true },
    ],

    verb: [
        { or: ['copula', 'do-verb'], expand: true }
    ],

    'do-verb': [
        { or: ['do', 'does'] },
        { or: ['not'], role: 'negation', number: '1|0' },
        { or: ['identifier'], role: 'verb' }
    ],

    copula: [
        { or: ['is', 'be', 'are'], role: 'verb' },
        { or: ['not'], role: 'negation', number: '1|0' },
    ],

    'complex-sentence': [
        { or: ['complex-sentence-one', 'complex-sentence-two'], expand: true }
    ],

    'complex-sentence-one': [
        { or: ['if', 'when'], role: 'subordinating-conjunction' },
        { or: ['simple-sentence'], role: 'condition' },
        { or: ['then', ','] },
        { or: ['simple-sentence'], role: 'consequence' },
    ],

    'complex-sentence-two': [
        { or: ['simple-sentence'], role: 'consequence' },
        { or: ['if', 'when'], role: 'subordinating-conjunction' },
        { or: ['simple-sentence'], role: 'condition' },
    ],
}