import { AstNode, CompositeNode } from "./interfaces/AstNode"
import { Parser } from "./interfaces/Parser"
import { isNecessary, isRepeatable } from "./interfaces/Cardinality"
import { AstType, Member, Syntax } from "./interfaces/Syntax"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"
import { getLexer } from "../lexer/Lexer"
import { Context } from "../../backend/things/Context"


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

            const cst = this.tryParse(this.context.getSyntaxList())

            if (!cst) {
                break
            }

            const ast = this.simplify(cst)
            results.push(ast)

            if (this.lexer.peek?.type === 'fullstop') {
                this.lexer.next()
            }

        }

        return results
    }


    protected tryParse(types: AstType[], exceptTypes?: AstType[]) { //problematic

        for (const t of types) {

            const memento = this.lexer.pos
            const x = this.knownParse(t)

            if (x && !exceptTypes?.includes(x.type)) {
                return x
            }

            this.lexer.backTo(memento)
        }

    }

    protected knownParse = (name: AstType): Cst | undefined => {

        const syntax = this.context.getSyntax(name)
        // if the syntax is an "unofficial" AST, aka a CST, get the name of the 
        // actual AST and pass it down to parse composite

        if (this.isLeaf(name)) {
            return this.parseLeaf(name)
        } else {
            return this.parseComposite(name as CompositeType, syntax)
        }

    }

    protected parseLeaf = (name: AstType): Cst | undefined => {

        if (name === this.lexer.peek.type || name === 'any-lexeme') {
            const x = this.lexer.peek
            this.lexer.next()
            return x
        }

    }

    protected parseComposite = (name: CompositeType, syntax: Syntax): Cst | undefined => {

        const links: { [x: string]: Cst } = {}

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
            ...links
        } as any // TODO!
    }

    protected parseMember = (m: Member): Cst | undefined => {

        const list: any[] = [] // TODO!

        while (!this.lexer.isEnd) {

            if (!isRepeatable(m.number) && list.length >= 1) {
                break
            }

            const x = this.tryParse(m.types, m.exceptTypes)

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
            list: list,
            notAst: m.notAst,
            expand: m.expand,
        }) : {
            ...list[0],
            notAst: m.notAst,
            expand: m.expand,
        }

    }

    protected isLeaf = (t: AstType) => {
        return this.context.getLexemeTypes().includes(t as LexemeType)
    }

    protected simplify(cst: Cst): AstNode {

        if (cst.type === 'macro') {
            return cst
        }

        if (this.isLeaf(cst.type)) {
            return cst
        }

        const type = cst.type
        const links = linksOf(cst)
        // console.log(type, 'links=', links)
        const expanded = links.flatMap(e => e[1].expand ? linksOf(e[1]) : [e])
        // console.log(type, 'expanded=', expanded)
        const simplified = expanded.map(e => [e[0], this.simplify(e[1]) as Cst] as const)
        // console.log(type, 'simplified=', simplified)
        const astLinks = simplified.filter(e => !e[1].notAst)
        // console.log(type, 'astLinks=', astLinks)
        const ast: AstNode = Object.fromEntries(astLinks) as any
        // console.log(type, 'ast=', ast)
        const astWithType = { ...ast, type } as AstNode
        // console.log(type, 'astWithType=', astWithType)

        return astWithType
    }

}

function linksOf(cst: Cst): [string, Cst][] {

    const list = (cst as CompositeNode).list as Cst[] | undefined

    if (list) {
        const flattened = list.flatMap(x => linksOf(x))
        // console.log('trying to expand list!', list, flattened)
        return flattened
    }

    return Object.entries(cst).filter(e => e[1] && e[1].type)
}


type Cst = AstNode & { notAst?: boolean, expand?: boolean }
