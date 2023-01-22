import { Member, AstType, Role } from "../parser/ast-types";
import { ElementType, stringLiterals } from "./utils";


export const constituentTypes = stringLiterals(
    'macro',
    'macropart',
    // 'complexsentence1',
    // 'complexsentence2',
    'copulasentence',
    // 'iverbsentence',
    // 'mverbsentence',
    'nounphrase',
    'complement',
    'copulasubclause',
    'array', // an array of consecutive asts (tied to '*')
    // 'quantifier',
    // 'article',
    'taggedunion',
    'subclause', //subordinate clause
)
// | 'iverbsubclause'
// | 'mverbsubclause1'
// | 'mverbsubclause2'
// | 'conjsentece'
// | 'copulaquestion'

export type ConstituentType = ElementType<typeof constituentTypes>;

const syntaxes: { [name in ConstituentType]: Member[] } = {

    'subclause': [
        { type: ['copulasubclause', /*'iverbsubclause', 'mverbsubclause1', 'mverbsubclause2'*/], number: 1 }
    ],
    'nounphrase': [
        // { type: ['quantifier'], number: '1|0' },
        // { type: ['article'], number: '1|0' },
        // { type: ['adj'], number: '*' },
        // { type: ['noun'], number: '1|0' },
        // { type: ['subclause'], number: '1|0' },
        // { type: ['complement'], number: '*' },
    ],
    'complement': [
        // { type: ['preposition'], number: 1 },
        // { type: ['nounphrase'], number: 1 }
    ],
    'copulasubclause': [
        // { type: ['relpron'], number: 1 },
        // { type: ['copula'], number: 1 },
        // { type: ['nounphrase'], number: 1 }
    ],
    'copulasentence': [
        //     { type: ['nounphrase'], number: 1, role: 'subject' },
        //     { type: ['copula'], number: 1 },
        //     { type: ['negation'], number: '1|0' },
        //     { type: ['nounphrase'], number: 1, role: 'predicate' }
    ],
    // 'iverbsentence': [
    //     { type: ['nounphrase'], number: 1, role: 'subject' },
    //     { type: ['negation'], number: '1|0' },
    //     { type: ['iverb'], number: 1 },
    //     { type: ['complement'], number: '*' }
    // ],
    // 'complexsentence1': [
    //     { type: ['subconj'], number: 1 },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' },
    //     { type: ['then'], number: '1|0' },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' }
    // ],
    // 'complexsentence2': [
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' },
    //     { type: ['subconj'], number: 1 },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' }
    // ],
    // 'mverbsentence': [
    //     { type: ['nounphrase'], number: 1, role: 'subject' },
    //     { type: ['negation'], number: '1|0' },
    //     { type: ['mverb'], number: 1 },
    //     { type: ['complement'], number: '*' },
    //     { type: ['nounphrase'], number: 1, role: 'object' },
    //     { type: ['complement'], number: '*' },
    // ],
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