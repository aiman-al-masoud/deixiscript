import { AstNode, Role } from "./interfaces/AstNode"
import { Parser } from "./interfaces/Parser"
import { isNecessary, isRepeatable } from "./interfaces/Cardinality"
import { AstType, Member, Syntax } from "./interfaces/Syntax"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"
import { getLexer } from "../lexer/Lexer"
import { Context } from "../../backend/Context"


export class KoolParser implements Parser {

    constructor(
        protected readonly sourceCode: string,
        protected readonly context: Context,
        protected readonly lexer = getLexer(sourceCode, context),
    ) {

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

            if (this.lexer.peek?.type === 'fullstop') {
                this.lexer.next()
            }

        }

        return results
    }


    protected tryParse(types: AstType[], role?: Role, exceptTypes?: AstType[]) { //problematic

        for (const t of types) {

            const memento = this.lexer.pos
            const x = this.knownParse(t, role)

            if (x && !exceptTypes?.includes(x.type)) {
                return x
            }

            this.lexer.backTo(memento)
        }

    }

    protected knownParse = (name: AstType, role?: Role): AstNode | undefined => {

        const syntax = this.context.getSyntax(name)
        // if the syntax is an "unofficial" AST, aka a CST, get the name of the 
        // actual AST and pass it down to parse composite

        if (this.isLeaf(name) /* syntax.length === 1 && syntax[0].types.every(t => this.isLeaf(t)) */) {
            return this.parseLeaf(syntax[0])
        } else {
            return this.parseComposite(name as CompositeType, syntax, role)
        }

    }

    protected parseLeaf = (m: Member): AstNode | undefined => {

        if (m.types.includes(this.lexer.peek.type) || m.types.includes('any-lexeme')) {
            const x = this.lexer.peek
            this.lexer.next()
            return { type: x.type, lexeme: x }
        }

    }

    protected parseComposite = (name: CompositeType, syntax: Syntax, role?: Role): AstNode | undefined => {

        const links: { [x: string]: AstNode } = {}

        for (const m of syntax) {

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
            ...links
        } as any // TODO!
    }

    protected parseMember = (m: Member, role?: Role): AstNode | undefined => {

        const list: any[] = [] // TODO!

        while (!this.lexer.isEnd) {

            if (!isRepeatable(m.number) && list.length >= 1) {
                break
            }

            const x = this.tryParse(m.types, m.role, m.exceptTypes)

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

        if (this.isLeaf(ast.type) || ast.list) { // if no links return ast
            return ast
        }

        // const astLinks = Object.values(ast).filter(x => x && x.type).filter(x => x)
        // astLinks.length === 1
        // return astLinks[0]

        const syntax = this.context.getSyntax(ast.type)

        if (syntax.length === 1) {
            const v = Object.values(ast).filter(x => x && x.type).filter(x => x)
            return v[0]
        }

        const simpleLinks = Object
            .entries(ast)
            .filter(x => (x as any).type)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return { ...ast, ...simpleLinks }

    }

}
