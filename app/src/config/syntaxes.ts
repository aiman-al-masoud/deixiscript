import { Role } from "../parser/interfaces/AstNode";
import { SyntaxMap } from "../parser/interfaces/Syntax";
import { ElementType, stringLiterals } from "./utils";


export type CompositeType = ElementType<typeof constituentTypes>;

export const constituentTypes = stringLiterals(

    // permanent
    'taggedunion',
    'array', // consecutive asts
    'macropart',
    'macro',

    // extendible
    'copula sentence',
    'noun phrase',
    'complement',
    'subclause',
    'and sentence',
)

export const staticAscendingPrecedence: CompositeType[] = [
    'taggedunion',
    'array',
    'macropart',
    'macro']

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
    'array': [

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
        { type: ['copula sentence', 'noun phrase'], number: 1, role: 'one' as Role },
        { type: ['nonsubconj'], number: 1 },
        { type: ['and sentence', 'copula sentence', 'noun phrase'], number: '+', role: 'two' as Role }
    ],
}

