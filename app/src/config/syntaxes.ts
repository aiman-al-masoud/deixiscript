import { Role } from "../frontend/parser/interfaces/AstNode"
import { SyntaxMap } from "../frontend/parser/interfaces/Syntax"
import { ElementType } from "../utils/ElementType"
import { stringLiterals } from "../utils/stringLiterals"

export type CompositeType = ElementType<typeof constituentTypes>

export const constituentTypes = stringLiterals(
    'macro',
    'macropart',
    'taggedunion',
    'exceptunion',

    'noun-phrase',
    'and-phrase',
    'limit-phrase',
    'math-expression',
    'copula-sentence',
    'verb-sentence',
    'complex-sentence',

    'genitive-complement',
    'dative-complement',
    'ablative-complement',
    'locative-complement',
    'instrumental-complement',
    'comitative-complement',
    'copula-subordinate-clause',

    'string',
    'number-literal',
)

export const staticDescPrecedence: CompositeType[] = ['macro']

export const syntaxes: SyntaxMap = {
    'macro': [
        { type: ['makro-keyword'], number: 1 },
        { type: ['noun'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' },
        { type: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['exceptunion'], number: '1|0' },
        { type: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { type: ['noun'], number: 1 },
        { type: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { type: ['except-keyword'], number: 1 },
        { type: ['taggedunion'], number: '+' },
    ],
    'number-literal': [
        { type: ['digit'], number: 1, role: 'first-digit' as Role },
        { type: ['digit'], number: '*' },
    ],
    'noun-phrase': [],
    'and-phrase': [],
    'limit-phrase': [],
    'math-expression': [],
    'genitive-complement': [],
    'copula-sentence': [],
    'verb-sentence': [],
    'string': [],
    'complex-sentence': [],
    "dative-complement": [],
    "ablative-complement": [],
    "locative-complement": [],
    "instrumental-complement": [],
    "comitative-complement": [],
    'copula-subordinate-clause': [],
}