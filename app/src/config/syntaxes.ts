import { Role } from "../parser/interfaces/AstNode";
import { SyntaxMap } from "../parser/interfaces/Syntax";
import { ElementType, stringLiterals } from "./utils";

export type CompositeType = ElementType<typeof constituentTypes>;

export const constituentTypes = stringLiterals(

    // permanent
    'macro',
    'macropart',
    'taggedunion',

    // extendible
    'copula sentence',
    'noun phrase',
    'complement',
    'subclause',
    'and sentence',
)

export const staticDescPrecedence: CompositeType[] = [
    'macro',
    'macropart',
    'taggedunion',
]

export const syntaxes: SyntaxMap = {

    // permanent
    'macro': [
        { type: ['noun', 'grammar'], number: 1, role: 'noun' as Role },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' }
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['then'], number: '1|0' }
    ],
    'taggedunion': [
        { type: ['grammar'], number: 1 },
        { type: ['disjunc'], number: '1|0' }
    ],

    // extendible
    'subclause': [

    ],

    'noun phrase': [

    ],

    'complement': [

    ],

    'copula sentence': [

    ],

    'and sentence': [
        { type: ['copula sentence', 'noun phrase'], number: 1, role: 'left' },
        { type: ['nonsubconj'], number: 1 },
        { type: ['and sentence', 'copula sentence', 'noun phrase'], number: '+', role: 'right' }
    ],
}

