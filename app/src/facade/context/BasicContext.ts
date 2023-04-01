import { Enviro } from "../../backend/enviro/Enviro"
import { CompositeType } from "../../config/syntaxes"
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme"
import { AstNode } from "../../frontend/parser/interfaces/AstNode"
import { AstType } from "../../frontend/parser/interfaces/Syntax"
import { macroToSyntax } from "../../frontend/parser/macroToSyntax"
import { maxPrecedence } from "../../frontend/parser/maxPrecedence"
import { Config } from "./Config"
import { Context } from "./Context"

export default class BasicContext implements Context {

    protected readonly staticDescPrecedence = this.config.staticDescPrecedence
    protected readonly syntaxMap = this.config.syntaxes
    protected _syntaxList: CompositeType[] = this.getSyntaxList()
    protected _lexemes = this.config.lexemes
    readonly prelude = this.config.prelude
    readonly lexemeTypes = this.config.lexemeTypes
    readonly set = this.enviro.set
    readonly query = this.enviro.query
    readonly root = this.enviro.root

    constructor(readonly enviro: Enviro, readonly config: Config) {

        this.astTypes.forEach(g => {

            this.setLexeme(makeLexeme({
                root: g,
                type: 'grammar'
            }))

        })

    }

    get values() {
        return this.enviro.values
    }

    getLexeme = (rootOrToken: string): Lexeme | undefined => {
        return this._lexemes
            .filter(x => rootOrToken === x.token || rootOrToken === x.root)
            .at(0)
    }

    protected getSyntaxList() {
        const x = Object.keys(this.syntaxMap) as CompositeType[]
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e))
        const z = y.sort((a, b) => maxPrecedence(b, a, this.syntaxMap))
        return this.config.staticDescPrecedence.concat(z)
    }

    get syntaxList(): CompositeType[] {
        return this._syntaxList
    }

    get lexemes() {
        return this._lexemes
    }

    setSyntax = (macro: AstNode) => {
        const syntax = macroToSyntax(macro)
        this.setLexeme(makeLexeme({ type: 'grammar', root: syntax.name }))
        this.syntaxMap[syntax.name as CompositeType] = syntax.syntax
        this._syntaxList = this.getSyntaxList()
    }

    getSyntax = (name: AstType) => {
        return this.syntaxMap[name as CompositeType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

    setLexeme = (lexeme: Lexeme) => {

        if (lexeme.root && !lexeme.token && this._lexemes.some(x => x.root === lexeme.root)) {
            this._lexemes = this._lexemes.filter(x => x.root !== lexeme.root)
        }

        this._lexemes.push(lexeme)
        this._lexemes.push(...lexeme.extrapolate(this))
    }

    get astTypes(): AstType[] {
        const res: AstType[] = this.config.lexemeTypes
        res.push(...this.staticDescPrecedence)
        return res
    }

}
