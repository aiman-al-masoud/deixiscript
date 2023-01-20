import Lexer, { getLexer } from "../lexer/Lexer"
import { LexemeType } from "../ast/interfaces/LexemeType"
import { Lexeme } from "../lexer/Lexeme"

type AstType = LexemeType | ConstituentType

type ConstituentType = 'nounphrase'
    | 'complement'
    | 'copulasubclause'
    | 'complexsentence1'
    | 'complexsentence2'
    | 'copulasentence'
    | 'iverbsentence'
    | 'mverbsentence'
// | 'iverbsubclause'
// | 'mverbsubclause1'
// | 'mverbsubclause2'
// | 'conjsentece'
// | 'copulaquestion'

type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | number

type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'

type Member = {
    type: AstType[]
    number?: Cardinality
    role?: Role
}

const blueprints: { [name in ConstituentType]: Member[] } = {

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
    ]

}

interface AstNode<T extends AstType> {
    type: T
    name?: string
}

interface AtomNode extends AstNode<LexemeType> {
    lexeme: Lexeme<LexemeType>
}

interface CompositeNode extends AstNode<ConstituentType> {
    links: (AstNode<AstType> | undefined)[]
}

function getBlueprint(name: AstType): Member[] {
    return blueprints[name as ConstituentType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
}

function isAtom(name: AstType) {
    const lexemeTypes: LexemeType[] = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj']
    return lexemeTypes.includes(name as LexemeType)
}

export function parse(name: AstType, lexer: Lexer, number?: Cardinality): AstNode<AstType> | undefined {

    const members = getBlueprint(name)

    if (members.length === 1 && members[0].type.every(t => isAtom(t))) {
        return parseAtom(members[0], lexer, number)
    } else {
        return parseComposite(name as ConstituentType, lexer, number)
    }

}

function parseAtom(m: Member, lexer: Lexer, number?: Cardinality): AtomNode | AstNode<AstType> | undefined {

    const atoms: AtomNode[] = []

    while (!lexer.isEnd && m.type.includes(lexer.peek.type)) {

        if (number !== '*' && atoms.length >= 1) {
            break
        }

        const x = lexer.peek
        lexer.next()
        atoms.push({ type: x.type, lexeme: x })
    }

    switch (atoms.length) {
        case 0:
            return undefined
        case 1:
            return atoms[0]
        default:

            const x: any = {
                links: atoms
            }
            return x as AstNode<AstType>
    }

}

function isNecessary(m: Member) {
    return m.number === 1
}

function parseComposite(name: ConstituentType, lexer: Lexer, number?: Cardinality): CompositeNode | undefined {

    const links: (AstNode<AstType> | undefined)[] = []

    for (const m of getBlueprint(name)) {

        const ast = parseMember(m, lexer)

        if (!ast && isNecessary(m)) {
            return undefined
        }

        links.push(ast)
    }

    return {
        type: name,
        links: links
    }
}

function parseMember(m: Member, lexer: Lexer): AstNode<AstType> | undefined {

    let x
    const memento = lexer.pos

    for (const t of m.type) {

        x = parse(t, lexer, m.number)

        if (x) {
            break
        } else {
            lexer.backTo(memento)
        }

    }

    return x
}















//////////////////////////////////////

export default function testNewXParser() {

    const x = parse('copulasentence', getLexer('the black red cat is green'))
    // const x = parse('copulasentence', getLexer('the cat that is black is red'))
    // const x = parse('complexsentence1', getLexer('if the cat is red then the cat is black'))
    console.log(x)

}