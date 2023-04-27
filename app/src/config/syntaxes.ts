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

    'subordinate-clause',

    'string',
    'number-literal',
)

export const staticDescPrecedence: CompositeType[] = ['macro']

export const syntaxes: SyntaxMap = {
    'macro': [
        { types: ['makro-keyword'], number: 1 },
        { types: ['noun'], number: 1, role: 'subject' },
        { types: ['copula'], number: 1 },
        { types: ['macropart'], number: '+' },
        { types: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { types: ['cardinality'], number: '1|0' },
        { types: ['grammar-role'], number: '1|0' },
        { types: ['taggedunion'], number: '+' },
        { types: ['exceptunion'], number: '1|0' },
        { types: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { types: ['noun'], number: 1 },
        { types: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { types: ['except-keyword'], number: 1 },
        { types: ['taggedunion'], number: '+' },
    ],
    'number-literal': [
        { types: ['digit'], number: 1, role: 'first-digit' },
        { types: ['digit'], number: '*' },
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
    'subordinate-clause': [],
}