import { Member, AstType, Role } from "../parser/ast-types";
import { ElementType, stringLiterals } from "./utils";


export const constituentTypes = stringLiterals(

    // permanent
    'taggedunion',
    'array', // an array of consecutive asts (tied to '*')
    'macropart',
    'macro',

    // to be removed
    'copulasentence',
    'nounphrase',
    'complement',
    'copulasubclause',
    'subclause',

)

export type ConstituentType = ElementType<typeof constituentTypes>;

export const syntaxes: { [name in ConstituentType]: Member[] } = {

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

    // to be removed
    'subclause': [

    ],
    'nounphrase': [

    ],
    'complement': [

    ],
    'copulasubclause': [

    ],
    'copulasentence': [

    ],
}

