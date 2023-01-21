import { Member, AstType } from "../parser/ast-types";
import { LexemeType } from "./LexemeType";

function stringLiterals<T extends string>(...args: T[]): T[] { return args; }
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export const constituentTypes = stringLiterals(
    'complexsentence1',
    'complexsentence2',
    'copulasentence',
    'macro',
    'iverbsentence',
    'mverbsentence',
    'nounphrase',
    'complement',
    'copulasubclause',
    'lexemelist',
)
// | 'iverbsubclause'
// | 'mverbsubclause1'
// | 'mverbsubclause2'
// | 'conjsentece'
// | 'copulaquestion'

export type ConstituentType = ElementType<typeof constituentTypes>;

const syntaxes: { [name in ConstituentType]: Member[] } = {
    'nounphrase': [
        { type: ['uniquant', 'existquant'], number: '1|0' },
        { type: ['indefart', 'defart'], number: '1|0' },
        { type: ['adj'], number: '*' },
        { type: ['noun'], number: '1|0' },
        { type: ['copulasubclause', /*'iverbsubclause', 'mverbsubclause1', 'mverbsubclause2'*/], number: '*' },
        { type: ['complement'], number: '*' },
    ],
    'complement': [
        { type: ['preposition'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasubclause': [
        { type: ['relpron'], number: 1 },
        { type: ['copula'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['negation'], number: '1|0' },
        { type: ['nounphrase'], number: 1, role: 'predicate' }
    ],
    'iverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['iverb'], number: 1 },
        { type: ['complement'], number: '*' }
    ],
    'complexsentence1': [
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' },
        { type: ['then'], number: '1|0' },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' }
    ],
    'complexsentence2': [
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' },
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' }
    ],
    'mverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['mverb'], number: 1 },
        { type: ['complement'], number: '*' },
        { type: ['nounphrase'], number: 1, role: 'object' },
        { type: ['complement'], number: '*' },
    ],
    'lexemelist': [
        { type: ['adj', 'noun'], number: '*' }
    ],
    'macro': [
        { type: ['noun'], number: 1 },
        { type: ['copula'], number: 1 },
        { type: ['adj'], number: '1|0' },
        { type: ['grammar'], number: 1 },
        { type: ['then'], number: 1 },
        { type: ['adj'], number: '1|0' },
        { type: ['grammar'], number: 1 },
        { type: ['adj'], number: '1|0' },
        { type: ['grammar'], number: 1 },
    ]
}

export const getSyntax = (name: AstType): Member[] => {
    return syntaxes[name as ConstituentType] ?? [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
}

export const isAtom = (name: AstType) => {
    const lexemeTypes: LexemeType[] = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj'];
    return lexemeTypes.includes(name as LexemeType);
}

export const isNecessary = (m: Member) => {
    return m.number === 1;
}
