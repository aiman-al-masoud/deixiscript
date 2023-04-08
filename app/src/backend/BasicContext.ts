import { BaseThing } from "./BaseThing"
import { getConfig } from "../config/Config"
import { CompositeType } from "../config/syntaxes"
import { extrapolate, Lexeme, makeLexeme } from "../frontend/lexer/Lexeme"
import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { AstType } from "../frontend/parser/interfaces/Syntax"
import { macroToSyntax } from "../frontend/parser/macroToSyntax"
import { maxPrecedence } from "../frontend/parser/maxPrecedence"
import { Id } from "../middle/id/Id"
import { Context } from "./Context"
import { LexemeType } from "../config/LexemeType"

export class BasicContext extends BaseThing implements Context {

    protected readonly config = getConfig()
    protected readonly staticDescPrecedence = this.config.staticDescPrecedence
    protected readonly syntaxMap = this.config.syntaxes
    protected syntaxList: CompositeType[] = this.refreshSyntaxList()
    protected lexemes: Lexeme[] = this.config.lexemes.flatMap(l => [l, ...extrapolate(l, this)])

    constructor(
        readonly id: Id
    ) {
        super(id)

        this.astTypes.forEach(g => { //TODO!
            this.setLexeme(makeLexeme({
                root: g,
                type: 'grammar'
            }))
        })
    }

    getLexemeTypes(): LexemeType[] {
        return this.config.lexemeTypes
    }

    getPrelude(): string[] {
        return this.config.prelude
    }

    getLexeme = (rootOrToken: string): Lexeme | undefined => {
        return this.lexemes
            .filter(x => rootOrToken === x.token || rootOrToken === x.root)
            .at(0)
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

    setSyntax = (macro: AstNode) => {
        const syntax = macroToSyntax(macro)
        this.setLexeme(makeLexeme({ type: 'grammar', root: syntax.name }))
        this.syntaxMap[syntax.name as CompositeType] = syntax.syntax
        this.syntaxList = this.refreshSyntaxList()
    }

    getSyntax = (name: AstType) => {
        return this.syntaxMap[name as CompositeType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

    setLexeme = (lexeme: Lexeme) => {

        if (lexeme.root && !lexeme.token && this.lexemes.some(x => x.root === lexeme.root)) {
            this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root)
        }

        this.lexemes.push(lexeme)
        this.lexemes.push(...extrapolate(lexeme, this))
    }

    get astTypes(): AstType[] {
        const res: AstType[] = this.config.lexemeTypes
        res.push(...this.staticDescPrecedence)
        return res
    }

}
