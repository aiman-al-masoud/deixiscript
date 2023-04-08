import { AstNode, Role } from "./interfaces/AstNode"
import { Parser } from "./interfaces/Parser"
import { isNecessary, isRepeatable } from "./interfaces/Cardinality"
import { AstType, Member } from "./interfaces/Syntax"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"
import { getLexer } from "../lexer/Lexer"
import { Context } from "../../backend/Context"


export class KoolParser implements Parser {

    constructor(
        protected readonly sourceCode: string,
        protected readonly context: Context,
        protected readonly lexer = getLexer(sourceCode, context)) {

    }

    parseAll() {

        const results: AstNode[] = []

        while (!this.lexer.isEnd) {

            const ast = this.tryParse(this.context.getSyntaxList())

            if (!ast) {
                break
            }

            const simpleAst = this.simplify(ast)
            results.push(simpleAst)

            if (simpleAst.type === 'macro') {
                this.context.setSyntax(ast)
            }

            if (this.lexer.peek?.type === 'fullstop') {
                this.lexer.next()
            }

        }

        return results
    }


    protected tryParse(types: AstType[], role?: Role) { //problematic
        
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

        const members = this.context.getSyntax(name)

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

        for (const m of this.context.getSyntax(name)) {

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
        return this.context.getLexemeTypes().includes(t as LexemeType)
    }

    protected simplify(ast: AstNode): AstNode {

        if (!ast.links) {
            return ast
        }

        const syntax = this.context.getSyntax(ast.type)

        if (syntax.length === 1 && Object.values(ast.links).length === 1) {
            return this.simplify(Object.values(ast.links)[0])
        }

        const simpleLinks = Object
            .entries(ast.links)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => ({ ...a, ...b }))

        return { ...ast, links: simpleLinks }

    }

}
