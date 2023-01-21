import { AstNode, AstType, Cardinality, Role, Member, AtomNode, CompositeNode, isNecessary, isRepeatable } from "./ast-types"
import { ConstituentType } from "../config/syntaxes"
import { Parser } from "./Parser"
import { getLexer } from "../lexer/Lexer"
import { LexemeType } from "../config/LexemeType"
import { Config } from "../config/Config"


export class KoolParser implements Parser {

    constructor(readonly sourceCode: string, readonly config: Config, readonly lexer = getLexer(sourceCode, config)) {

    }

    parseAll() {

        const results: (AstNode<AstType> | undefined)[] = []

        while (!this.lexer.isEnd) {

            const ast = this.parse()
            results.push(ast)
            this.lexer.assert('fullstop', { errorOut: false })

        }

        return results
    }

    parse() {

        for (const t of this.config.constituentTypes) {

            const x = this.try(this.topParse, t)

            if (x) {
                return x
            }
        }

    }

    protected topParse = (name: AstType, number?: Cardinality, role?: Role): AstNode<AstType> | undefined => {

        const members = this.config.getSyntax(name)

        if (members.length === 1 && members[0].type.every(t => this.isAtom(t))) {
            return this.parseAtom(members[0], number)
        } else {
            return this.parseComposite(name as ConstituentType, number, role)
        }

    }

    protected parseAtom = (m: Member, number?: Cardinality): AtomNode<LexemeType> | undefined => {

        if (m.type.includes(this.lexer.peek.type)) {
            const x = this.lexer.peek
            this.lexer.next()
            return { type: x.type, lexeme: x }
        }

    }

    protected parseComposite = (name: ConstituentType, number?: Cardinality, role?: Role): CompositeNode<ConstituentType> | undefined => {

        const links: any = {}

        for (const m of this.config.getSyntax(name)) {

            const ast = this.parseMember(m)

            if (!ast && isNecessary(m)) {
                return undefined
            }

            if (ast) {
                links[m.role ?? ast.type] = ast
            }

        }

        return {
            type: name,
            role: role,
            links: links
        }
    }

    protected parseMember = (m: Member, role?: Role): AstNode<AstType> | undefined => {

        const list: any[] = []

        while (!this.lexer.isEnd) {

            if (!isRepeatable(m) && list.length >= 1) {
                break
            }

            // const x = this.try(this.parseOneMember, m.type, m.number, m.role) // --------
            const memento = this.lexer.pos
            const x = this.parseOneMember(m.type, m.number, m.role)
            if (!x) { this.lexer.backTo(memento) }
            // ----------

            if (!x) {
                break
            }

            list.push(x)
        }

        // const res = isRepeatable(m) ? ({
        //     type: 'lexemelist',
        //     links: (list as any) //TODO!!!!
        // }) : list[0]

        if (list.length === 0 && isNecessary(m)) {
            return undefined
        }

        const res = ['macropart', 'adj'].some(x => m.type.includes(x as AstType)) ?
            ({
                type: 'lexemelist',
                links: (list as any) //TODO!!!!
            }) : list[0]

        return res
    }

    protected parseOneMember = (types: AstType[], number?: Cardinality, role?: Role) => {

        for (const t of types) {

            const x = this.topParse(t, number, role)

            if (x) {
                return x
            }

        }
    }

    protected try = (method: (args: any) => AstNode<AstType> | undefined, ...args: any[]) => {

        const memento = this.lexer.pos
        const x = method(args)

        if (!x) {
            this.lexer.backTo(memento)
        }

        return x
    }

    protected isAtom = (t: AstType) => {
        return this.config.lexemeTypes.includes(t as LexemeType)
    }
}
