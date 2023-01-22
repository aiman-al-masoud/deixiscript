import { AstNode, AstType, Role, Member, AtomNode, CompositeNode, isNecessary, isRepeatable } from "./ast-types"
import { ConstituentType, maxPrecedence } from "../config/syntaxes"
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

        // const sortedConstituentTypes = this.config.constituentTypes.sort((a, b) => maxPrecedence(a, b) == b ? -1 : 1)
        const sortedConstituentTypes = this.config.constituentTypes

        for (const t of sortedConstituentTypes) {

            const x = this.try(this.topParse, t)

            if (x) {
                return x
            }
        }

    }

    protected topParse = (name: AstType, role?: Role): AstNode<AstType> | undefined => {

        const members = this.config.getSyntax(name)

        if (members.length === 1 && members[0].type.every(t => this.isAtom(t))) {
            return this.parseAtom(members[0])
        } else {
            return this.parseComposite(name as ConstituentType, role)
        }

    }

    protected parseAtom = (m: Member): AtomNode<LexemeType> | undefined => {

        if (m.type.includes(this.lexer.peek.type)) {
            const x = this.lexer.peek
            this.lexer.next()
            return { type: x.type, lexeme: x }
        }

    }

    protected parseComposite = (name: ConstituentType, role?: Role): CompositeNode<ConstituentType> | undefined => {

        const links: any = {}

        for (const m of this.config.getSyntax(name)) {

            const ast = this.parseMember(m)

            if (!ast && isNecessary(m.number)) {
                return undefined
            }

            if (ast) {
                const astType = ast.type != 'array' ? ast.type : Object.values((ast as CompositeNode<'array'>).links).at(0)?.type ?? 'array';
                links[m.role ?? astType] = ast
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

            if (!isRepeatable(m.number) && list.length >= 1) {
                break
            }

            // const x = this.try(this.parseOneMember, m.type, m.number, m.role) // --------
            const memento = this.lexer.pos
            const x = this.parseOneMember(m.type, m.role)
            if (!x) { this.lexer.backTo(memento) }
            // ----------

            if (!x) {
                break
            }

            list.push(x)
        }

        if (list.length === 0 && isNecessary(m.number)) {
            return undefined
        }

        return isRepeatable(m.number) ? ({
            type: 'array',
            links: (list as any) //TODO!!!!
        }) : list[0]

    }

    protected parseOneMember = (types: AstType[], role?: Role) => {

        for (const t of types) {

            const x = this.topParse(t, role)

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
