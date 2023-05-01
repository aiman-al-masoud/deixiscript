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


type BaseMember = {
    readonly exceptForLiterals?: string[]
    readonly number?: Cardinality // no number ---> 1
    readonly role?: Role // no role --> exclude from ast
    readonly expand?: boolean
    readonly sep?: string
}

export type Member = BaseMember & {
    readonly types: AstType[]
    readonly literals?: undefined
} | BaseMember & {
    readonly literals: string[]
    readonly types?: undefined
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
    'any-symbol',
)


export const syntaxes: { [x in AstType]: Syntax } = {

    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
    ],
    'number-literal': [
        { number: '+', role: 'digits', literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'string-literal': [
        { literals: ['"'] },
        { types: ['any-symbol'], exceptForLiterals: ['"'], role: 'chars' },
        { literals: ['"'] },
    ],
    'noun-phrase': [
        { literals: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        { types: ['space'] },
        { literals: ['the', 'old'], role: 'anaphoraOperator', number: '1|0' },
        { types: ['space'] },
        { literals: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        { types: ['space'] },
        { types: ['limit-phrase'], expand: true, number: '1|0' },
        { types: ['space'] },
        { types: ['identifier'], role: 'modifiers', sep: 'space', number: 'all-but-last' },
        { types: ['space'] },
        { types: ['identifier', 'string-literal', 'number-literal'], role: 'head', number: 1 },
        { literals: ['s'], role: 'pluralizer', number: '1|0' },
        { types: ['space'] },
        { types: ['genitive'], expand: true, number: '1|0' },
    ],
    'limit-phrase': [
        { literals: ['first', 'last'], role: 'limitKeyword', number: 1 },
        { types: ['space'] },
        { types: ['number-literal'], role: 'limitNumber', number: '1|0' },
    ],
    'math-expression': [
        { types: ['noun-phrase'], role: 'leftOperand' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/'], role: 'operator', number: '1|0' },
        { types: ['space'], number: '*' },
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
        { types: ['noun-phrase'], role: 'owner', number: 1 },
    ],

    'accusative': [
        { types: ['noun-phrase'], role: 'object', number: 1 },
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
        { types: ['accusative', 'dative', 'instrumental'], expand: true, number: '*' }
    ],

    'simple-sentence': [
        { types: ['expression'], role: 'subject', number: '1|0' },
        { types: ['verb'], expand: true },
        { types: ['complement'], number: '*', expand: true },
    ],

    verb: [
        { types: ['copula', 'do-verb'], expand: true }
    ],

    'do-verb': [
        { literals: ['do', 'does'] },
        { literals: ['not'], role: 'negation', number: '1|0' },
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
    ],

    'any-symbol': [],

}