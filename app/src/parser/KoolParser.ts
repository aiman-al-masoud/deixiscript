import { AstNode, Role, LeafNode, CompositeNode } from "./interfaces/AstNode"
import { CompositeType } from "../config/syntaxes"
import { getLexer } from "../lexer/Lexer"
import { LexemeType } from "../config/LexemeType"
import { Config } from "../config/Config"
import { Parser } from "./interfaces/Parser"
import { isNecessary, isRepeatable } from "./interfaces/Cardinality"
import { AstType, Member } from "./interfaces/Syntax"


export class KoolParser implements Parser {

    constructor(
        protected readonly sourceCode: string,
        protected readonly config: Config,
        protected readonly lexer = getLexer(sourceCode, config)) {

    }

    parseAll() {

        const results: AstNode<AstType>[] = []

        while (!this.lexer.isEnd) {

            const ast = this.tryParse(this.config.syntaxList)

            if (!ast) {
                break
            }

            results.push(ast)

            if (this.lexer.peek?.type === 'fullstop') {
                this.lexer.next()
            }

        }

        return results
    }


    protected tryParse(types: AstType[], role?: Role) {

        for (const t of types) {

            const memento = this.lexer.pos
            const x = this.knownParse(t, role)

            if (x) {
                return x
            }

            this.lexer.backTo(memento)
        }

    }

    protected knownParse = (name: AstType, role?: Role): AstNode<AstType> | undefined => {

        const members = this.config.getSyntax(name)

        if (members.length === 1 && members[0].type.every(t => this.isLeaf(t))) {
            return this.parseLeaf(members[0])
        } else {
            return this.parseComposite(name as CompositeType, role)
        }

    }

    protected parseLeaf = (m: Member): LeafNode<LexemeType> | undefined => {

        if (m.type.includes(this.lexer.peek.type)) {
            const x = this.lexer.peek
            this.lexer.next()
            return { type: x.type, lexeme: x }
        }

    }

    protected parseComposite = (name: CompositeType, role?: Role): CompositeNode<CompositeType> | undefined => {

        const links: any = {}

        for (const m of this.config.getSyntax(name)) {

            const ast = this.parseMember(m)

            if (!ast && isNecessary(m.number)) {
                return undefined
            }

            if (!ast) {
                continue
            }

            links[m.role ?? ast.type] = ast

        }

        if (Object.keys(links).length <= 0) {
            return undefined
        }

        return {
            type: name,
            role: role,
            links: links
        }
    }

    protected parseMember = (m: Member, role?: Role): AstNode<AstType> | undefined => {

        const list: AstNode<AstType>[] = []

        while (!this.lexer.isEnd) {

            if (!isRepeatable(m.number) && list.length >= 1) {
                break
            }

            const x = this.tryParse(m.type, m.role)

            if (!x) {
                break
            }

            list.push(x)
        }

        if (list.length === 0) {
            return undefined
        }

        return isRepeatable(m.number) ? ({
            type: list[0].type,
            list: list
        }) : list[0]

    }

    protected isLeaf = (t: AstType) => {
        return this.config.lexemeTypes.includes(t as LexemeType)
    }

}
