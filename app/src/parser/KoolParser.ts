import { AstNode, Role } from "./interfaces/AstNode"
import { CompositeType } from "../config/syntaxes"
import { getLexer } from "../lexer/Lexer"
import { LexemeType } from "../config/LexemeType"
import { Parser } from "./interfaces/Parser"
import { isNecessary, isRepeatable } from "./interfaces/Cardinality"
import { AstType, Member } from "./interfaces/Syntax"
import { Context } from "../brain/Context"


export class KoolParser implements Parser {

    constructor(
        protected readonly sourceCode: string,
        protected readonly context: Context,
        protected readonly lexer = getLexer(sourceCode, context)) {

    }

    parseAll() {

        const results: AstNode[] = []

        while (!this.lexer.isEnd) {

            const ast = this.tryParse(this.context.config.syntaxList)

            if (!ast) {
                break
            }

            results.push(this.simplify(ast))

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

    protected knownParse = (name: AstType, role?: Role): AstNode | undefined => {

        const members = this.context.config.getSyntax(name)

        if (members.length === 1 && members[0].type.every(t => this.isLeaf(t))) {
            return this.parseLeaf(members[0])
        } else {
            return this.parseComposite(name as CompositeType, role)
        }

    }

    protected parseLeaf = (m: Member): AstNode | undefined => {

        if (m.type.includes(this.lexer.peek.type)) {
            const x = this.lexer.peek
            this.lexer.next()
            return { type: x.type, lexeme: x }
        }

    }

    protected parseComposite = (name: CompositeType, role?: Role): AstNode | undefined => {

        const links: any = {}

        for (const m of this.context.config.getSyntax(name)) {

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

    protected parseMember = (m: Member, role?: Role): AstNode | undefined => {

        const list: AstNode[] = []

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
        return this.context.config.lexemeTypes.includes(t as LexemeType)
    }

    protected simplify(ast: AstNode) {

        const syntax = this.context.config.getSyntax(ast.type)

        const vals = Object.values(ast.links ?? {})

        if (syntax.length === 1 && vals.length === 1) {
            return vals[0]
        }

        return ast
    }

}
