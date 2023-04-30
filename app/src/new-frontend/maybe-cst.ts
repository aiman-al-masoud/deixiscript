const SPACE = { or: [' '], excludeFromAst: true, number: '+' }


type StringLiteral = {
    stringChars: string[]
}

const stringLiteral = {

    astType: 'string-literal',

    and: [
        { or: ['"'], number: 1, excludeFromAst: true },
        { or: ['any-symbol'], role: 'stringChars', exceptFor: ['"'], number: '*', },
        { or: ['"'], number: 1, excludeFromAst: true },
    ]
}

type NumberLiteral = {
    numberChars: string[]
}

const numberLiteral = {

    astType: 'number-literal',

    and: [
        { or: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], role: 'numberChars', number: '+' },
    ]
}

type NounPhrase = {
    pluralizer?: boolean
    anaphoraOperator?: boolean
    newOperator?: boolean
    limitKeyword?: string
    limitNumber?: number
    modifiers?: string[]
    head: string
    owner?: NounPhrase
}

const nounPhrase = {

    astType: 'noun-phrase',

    and: [
        { or: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        SPACE,
        { or: ['the', 'old'], role: ' anaphoraOperator', number: '1|0' },
        SPACE,
        { or: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        SPACE,
        {
            expand: true,
            number: '1|0',
            and: [
                { or: ['first', 'last'], role: 'limitKeyword', number: 1 },
                { or: ['number-literal'], role: 'limitNumber', number: '1|0' },
            ]
        },
        SPACE,
        { or: ['noun'], role: 'modifier', number: 'all-but-last' },
        SPACE,
        { or: ['noun', 'string', 'number'], role: 'head', number: 1 },
        { or: ['s'], role: 'pluralizer', number: '1|0' },
        SPACE,
        {
            expand: true,
            number: '1|0',
            and: [
                { or: ['of'], excludeFromAst: true },
                { or: ['noun-phrase'], role: 'owner', number: 1 },
            ]
        },

    ]

}

type MulExpression = {
    leftOperand: NounPhrase
    operator: string
    rightOperand?: NounPhrase
}

const mulExpression = {

    astType: 'mul-expression',

    and: [
        { or: ['noun-phrase'], role: 'leftOperand', number: 1 },
        SPACE,
        { or: ['*', '/'], role: 'operator', number: 1 },
        SPACE,
        { or: ['noun-phrase'], role: 'rightOperand', number: '1|0' },
    ]

}


const sumExpression = {

    astType: 'sum-expression',

    and: [
        { or: ['mul-expression'], role: 'leftOperand', number: 1 },
        SPACE,
        { or: ['+', '-'], role: 'operator', number: 1 },
        SPACE,
        { or: ['mul-expression'], role: 'rightOperand', number: '1|0' },
    ]

}


const andExpression = {

    astType: 'and-expression',

    and: [
        { or: ['sum-expression'], role: 'left-operand', number: 1 },
        SPACE,
        { or: ['and'], number: 1 },
        SPACE,
        { or: ['sum-expression'], role: 'right-operand', number: '1|0' },
    ]

}

const expression = {
    astType: 'expression',
    and: [
        { or: ['and-expression'], number: 1, expand: true }
    ]
}

const simpleSentence = {

    astType: 'simple-sentence',

    and: [
        { or: ['noun-phrase'], role: 'subject', number: '1|0' },
        SPACE,
        { or: ['do', 'does'], number: '1|0', excludeFromAst: true },
        SPACE,
        { or: ['not'], role: 'negation', number: '1|0' },
        SPACE,
        {
            exor: [
                { or: ['verb', 'copula'], role: 'verb-or-copula', number: 1 }
            ]
        },
        { or: ['not'], role: 'negation', number: '1|0' },
        SPACE,
        { or: ['noun-phrase'], role: 'object', number: '1|0' },
        SPACE,
        {
            number: '*',
            expand: true,
            or: [
                {
                    and: [
                        { or: ['to'], number: 1, excludeFromAst: true },
                        { or: ['noun-phrase'], role: 'recipient' },
                    ]
                },
                //other complements...
            ]
        }
    ]

}


const complexSentence1 = {

    astType: 'complex-sentence',
    and: [
        { or: ['simple-sentence'], role: 'condition', number: 1 },
        SPACE,
        { or: ['if', 'when'], role: 'subordinating-conjunction', number: 1 },
        SPACE,
        { or: ['simple-sentence'], role: 'consequence', number: 1 },
    ]

}

const complexSentence2 = {

    astType: 'complex-sentence',
    and: [
        { or: ['if', 'when'], role: 'subordinating-conjunction', number: 1 },
        SPACE,
        { or: ['simple-sentence'], role: 'condition', number: 1 },
        SPACE,
        { or: ['then'], number: 1, excludeFromAst: true },
        SPACE,
        { or: ['simple-sentence'], role: 'consequence', number: 1 },
    ]

}




