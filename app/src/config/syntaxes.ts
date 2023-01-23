import { SyntaxMap, Role } from "../parser/ast-types";
import { ElementType, stringLiterals } from "./utils";

export type CompositeType = ElementType<typeof constituentTypes>;

export const constituentTypes = stringLiterals(

    // permanent
    'taggedunion',
    'array', // consecutive asts
    'macropart',
    'macro',

    // extendible
    'copulasentence',
    'nounphrase',
    'complement',
    'subclause',

)

export const syntaxes: SyntaxMap = {

    // permanent
    'macro': [
        { type: ['noun', 'grammar'], number: 1, role: 'noun' as Role },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' }
    ],
    'macropart': [
        { type: ['adj'], number: '*' },
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
    'nounphrase': [

    ],
    'complement': [

    ],

    'copulasentence': [

    ],
}

