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

const syntaxes: { [name in ConstituentType]: Member[] } = {

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

export const getSyntax = (name: AstType): Member[] => {
    return syntaxes[name as ConstituentType] ?? [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
}

export const setSyntax = (name: string, members: Member[]) => {
    syntaxes[name as ConstituentType] = members
}

export function dependencies(a: AstType): AstType[] {
    return (syntaxes[a as ConstituentType] ?? []).flatMap(m => m.type)
}

function staticPrecedence(a: AstType, b: AstType) {

    const ascendingPrecedence = constituentTypes.slice(0, 4) as any

    const pa = ascendingPrecedence.indexOf(a)
    const pb = ascendingPrecedence.indexOf(b)

    if (pa === -1 || pb === -1) { // either one is custom
        return 0
    }

    return pa - pb
}

function lenCompare(a: AstType, b: AstType) {

    const aLength = dependencies(a).length
    const bLength = dependencies(b).length

    if (aLength === bLength) {
        return 0
    }

    return aLength > bLength ? 1 : -1
}

export function maxPrecedence(a: AstType, b: AstType) {

    const sp = staticPrecedence(a, b)

    if (sp !== 0) {
        return sp
    }

    const aDependsOnB = dependencies(a).includes(b)
    const bDependsOnA = dependencies(b).includes(a)

    if (aDependsOnB === bDependsOnA) {
        return lenCompare(a, b)
    }

    return aDependsOnB ? 1 : -1
}