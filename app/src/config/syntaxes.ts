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
    'copulasentence',
    'nounphrase',
    'complement',
    'subclause',
    'andsentence',
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

    'andsentence': [
        { type: ['copulasentence', 'nounphrase'], number: 1, role: 'one' as Role },
        { type: ['nonsubconj'], number: 1 },
        { type: ['andsentence', 'copulasentence', 'nounphrase'], number: '+', role: 'two' as Role }
    ],
}

