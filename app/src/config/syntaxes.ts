import { Member, AstType, Role } from "../parser/ast-types";
import { ElementType, stringLiterals } from "./utils";


export const constituentTypes = stringLiterals(
    'macro',
    'macropart',
    'copulasentence',
    'nounphrase',
    'complement',
    'copulasubclause',
    'array', // an array of consecutive asts (tied to '*')
    'taggedunion',
    'subclause', //subordinate clause
)

export type ConstituentType = ElementType<typeof constituentTypes>;

const syntaxes: { [name in ConstituentType]: Member[] } = {

    'subclause': [
        { type: ['copulasubclause'], number: 1 }
    ],
    'nounphrase': [

    ],
    'complement': [

    ],
    'copulasubclause': [

    ],
    'copulasentence': [

    ],

    'array': [

    ],
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
    ]
}

export const getSyntax = (name: AstType): Member[] => {
    return syntaxes[name as ConstituentType] ?? [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
}

export const setSyntax = (name: string, members: Member[]) => {
    syntaxes[name as ConstituentType] = members
}

export function dependencies(a: AstType): AstType[] {
    return getSyntax(a).flatMap(m => m.type)
}

export function maxPrecedence(a: AstType, b: AstType) {

    const aDependsOnB = dependencies(a).includes(b)
    const bDependsOnA = dependencies(b).includes(a)

    if (aDependsOnB && bDependsOnA) {
        const aLength = getSyntax(a).length
        const bLength = getSyntax(b).length
        return aLength > bLength ? a : b // TODO: what if also same legth here?
    }

    return bDependsOnA ? a : b
}