import { BaseThing } from "./BaseThing"
import { getConfig } from "../config/Config"
import { CompositeType } from "../config/syntaxes"
import { extrapolate, Lexeme, makeLexeme } from "../frontend/lexer/Lexeme"
import { Macro } from "../frontend/parser/interfaces/AstNode"
import { AstType } from "../frontend/parser/interfaces/Syntax"
import { macroToSyntax } from "../frontend/parser/macroToSyntax"
import { maxPrecedence } from "../frontend/parser/maxPrecedence"
import { Id } from "../middle/id/Id"
import { Context } from "./Context"
import { LexemeType } from "../config/LexemeType"
import { Thing } from "./Thing"

export class BasicContext extends BaseThing implements Context {

    protected syntaxList: CompositeType[] = this.refreshSyntaxList()

    constructor(
        readonly id: Id,
        protected readonly config = getConfig(),
        protected readonly staticDescPrecedence = config.staticDescPrecedence,
        protected readonly syntaxMap = config.syntaxes,
        protected lexemes: Lexeme[] = config.lexemes.flatMap(l => [l, ...extrapolate(l)]),
        protected bases: Thing[] = [],
        protected children: { [id: Id]: Thing } = {},
    ) {
        super(id, bases, children, lexemes)

        this.astTypes.forEach(g => { //TODO!
            this.setLexeme(makeLexeme({
                root: g,
                type: 'noun',
                referents: [],
            }))
        })

    }

    getLexemeTypes(): LexemeType[] {
        return this.config.lexemeTypes
    }

    getPrelude(): string {
        return this.config.prelude
    }

    protected refreshSyntaxList() {
        const x = Object.keys(this.syntaxMap) as CompositeType[]
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e))
        const z = y.sort((a, b) => maxPrecedence(b, a, this.syntaxMap))
        return this.config.staticDescPrecedence.concat(z)
    }

    getSyntaxList(): CompositeType[] {
        return this.syntaxList
    }

    setSyntax = (macro: Macro) => {
        const syntax = macroToSyntax(macro)
        this.setLexeme(makeLexeme({ type: 'noun', root: syntax.name, referents: [] }))
        this.syntaxMap[syntax.name as CompositeType] = syntax.syntax
        this.syntaxList = this.refreshSyntaxList()
    }

    getSyntax = (name: AstType) => {
        return this.syntaxMap[name as CompositeType] ?? [{ types: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

    get astTypes(): AstType[] {
        const res: AstType[] = this.config.lexemeTypes
        res.push(...this.staticDescPrecedence)
        return res
    }

    override clone(): Context {
        return new BasicContext(
            this.id,
            this.config,
            this.staticDescPrecedence,
            this.syntaxMap,
            this.lexemes,
            this.bases,
            this.children, //shallow or deep?
        )
    }

}
