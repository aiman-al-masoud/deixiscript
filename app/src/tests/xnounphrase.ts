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


class KoolParser {

    constructor(readonly sourceCode: string, readonly lexer = getLexer(sourceCode)) {

    }

    protected try(method: (args: any) => AstNode<AstType> | undefined, ...args: AstType[]) {

        const memento = this.lexer.pos
        const x = method(args)

        if (!x) {
            this.lexer.backTo(memento)
        }

        return x
    }

    parseAll() {

        const results: (AstNode<AstType> | undefined)[] = []

        while (!this.lexer.isEnd) {
            results.push(this.parse())
            this.lexer.assert('fullstop', { errorOut: false })
        }

        return results
    }

    parse() {

        return this.try(this.topParse, 'complexsentence1')
            ?? this.try(this.topParse, 'complexsentence2')
            ?? this.try(this.topParse, 'copulasentence')
            ?? this.try(this.topParse, 'iverbsentence')
            ?? this.try(this.topParse, 'mverbsentence')
            ?? this.try(this.topParse, 'nounphrase')
    }

    protected topParse = (name: AstType, number?: Cardinality): AstNode<AstType> | undefined => {

        const members = getBlueprint(name)

        if (members.length === 1 && members[0].type.every(t => this.isAtom(t))) {
            return this.parseAtom(members[0], number)
        } else {
            return this.parseComposite(name as ConstituentType, number)
        }

    }

    protected parseAtom = (m: Member, number?: Cardinality): AtomNode | AstNode<AstType> | undefined => {

        const atoms: AtomNode[] = []

        while (!this.lexer.isEnd && m.type.includes(this.lexer.peek.type)) {

            if (number !== '*' && atoms.length >= 1) {
                break
            }

            const x = this.lexer.peek
            this.lexer.next()
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

    protected isNecessary = (m: Member) => {
        return m.number === 1
    }

    protected isAtom = (name: AstType) => {
        const lexemeTypes: LexemeType[] = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj']
        return lexemeTypes.includes(name as LexemeType)
    }

    protected parseComposite = (name: ConstituentType, number?: Cardinality): CompositeNode | undefined => {

        const links: (AstNode<AstType> | undefined)[] = []

        for (const m of getBlueprint(name)) {

            const ast = this.parseMember(m)

            if (!ast && this.isNecessary(m)) {
                return undefined
            }

            links.push(ast)
        }

        return {
            type: name,
            links: links
        }
    }

    protected parseMember = (m: Member): AstNode<AstType> | undefined => {

        let x

        for (const t of m.type) {

            x = this.topParse(t, m.number)

            if (x) {
                break
            }

        }

        return x
    }


}




//////////////////////////////////////

export default function testNewXParser() {


    const x = new KoolParser('the cat that is black is red. cat is red if cat is green').parseAll()
    // const x = parse('copulasentence', getLexer('the cat that is black is red'))
    // const x = parse('complexsentence1', getLexer('if the cat is red then the cat is black'))
    console.log(x)

}