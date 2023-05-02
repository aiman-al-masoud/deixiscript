import { ElementType } from "../utils/ElementType"
import { stringLiterals } from "../utils/stringLiterals"

export type Syntax = Member[] // CstModel


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


type BaseMember = {
    readonly number?: Cardinality // no number ---> 1
    readonly role?: Role // no role --> exclude from ast
    readonly sep?: AstType
    readonly expand?: boolean

    readonly reduce?: boolean
}

export type LiteralMember = BaseMember & {
    readonly literals: string[]
    readonly types?: undefined
    readonly anyCharExceptFor?: string[]
    readonly expand?: undefined
}

export type TypeMember = BaseMember & {
    readonly types: AstType[]
    readonly literals?: undefined
}

export type Member = LiteralMember | TypeMember

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
    'verb',
    'copula',
    'do-verb',
    'complement',
    'complex-sentence-one',
    'complex-sentence-two',


    // 'genitive-expression',
)

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | 'all-but-last'
    | number // currently only supports =1

export const isNecessary = (c?: Cardinality) =>
    c === undefined // necessary by default
    || c == '+'
    || +c >= 1

export const isRepeatable = (c?: Cardinality) =>
    c == '+'
    || c == '*'
    || c === 'all-but-last'

export const syntaxes: { [x in AstType]: Syntax } = {

    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
    ],
    'number-literal': [
        { number: '+', role: 'digits', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'string-literal': [
        { literals: ['"'] },
        { anyCharExceptFor: ['"'], literals: [], role: 'chars', number: '*' },
        { literals: ['"'] },
    ],
    'noun-phrase': [
        { literals: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { literals: ['the', 'old'], role: 'anaphoraOperator', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { literals: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['limit-phrase'], expand: true, number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'modifiers', sep: 'space', number: 'all-but-last' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier', 'string-literal', 'number-literal'], role: 'head', number: 1 },
        { literals: ['s'], role: 'pluralizer', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['genitive'], expand: true, number: '1|0' },
    ],
    'limit-phrase': [
        { literals: ['first', 'last'], role: 'limitKeyword', number: 1 },
        { types: ['space'] },
        { types: ['number-literal'], role: 'limitNumber', number: '1|0' },
    ],

    // 'genitive-expression' : [
    //     {types : ['noun-phrase'], role : 'id'},//TODOOOOO!
    //     { types: ['space'] },
    //     {literals : ['of'] },
    //     { types: ['space'] },
    //     {types : ['noun-phrase'], role : 'owner'},
    // ],

    'math-expression': [
        // { types: ['genitive-expression'], role: 'leftOperand' },
        { types: ['noun-phrase'], role: 'leftOperand' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/'], role: 'operator', number: 1 },
        { types: ['space'], number: '*' },
        // { types: ['genitive-expression'], role: 'rightOperand', number: '1|0' }
        { types: ['noun-phrase'], role: 'rightOperand', number: '1|0' }

    ],
    "expression": [
        { types: ['math-expression'], role: 'leftOperand' },
        { types: ['space'] },
        { literals: ['and'], number: '1|0' },
        { types: ['space'] },
        { types: ['math-expression'], role: 'rightOperand', number: '1|0' }
    ],

    'genitive': [
        { literals: ['of'] },
        { types: ['space'] },
        { types: ['expression'], role: 'owner', number: 1 },
    ],

    'dative': [
        { literals: ['to'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'receiver', number: 1 },
    ],

    'instrumental': [
        { literals: ['by'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'instrument', number: 1 },
    ],

    'complement': [
        { types: ['dative', 'instrumental'], expand: true, number: 1 }
    ],

    'simple-sentence': [
        { types: ['expression'], role: 'subject', number: '1|0' },
        { types: ['space'] },
        { types: ['verb'], expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['expression'], role: 'object', number: '1|0' },
        { types: ['complement'], number: '*', expand: true },
    ],

    verb: [
        { types: ['copula', 'do-verb'], expand: true }
    ],

    'do-verb': [
        { literals: ['does', 'do'] }, // order matters! superstring first!
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'verb' }
    ],

    copula: [
        { literals: ['is', 'be', 'are'], role: 'verb' },
        { literals: ['not'], role: 'negation', number: '1|0' },
    ],

    'complex-sentence': [
        { types: ['complex-sentence-one', 'complex-sentence-two'], expand: true }
    ],

    'complex-sentence-one': [
        { literals: ['if', 'when'], role: 'subordinating-conjunction' },
        { types: ['simple-sentence'], role: 'condition' },
        { literals: ['then', ','] },
        { types: ['simple-sentence'], role: 'consequence' },
    ],

    'complex-sentence-two': [
        { types: ['simple-sentence'], role: 'consequence' },
        { literals: ['if', 'when'], role: 'subordinating-conjunction' },
        { types: ['simple-sentence'], role: 'condition' },
    ]
}