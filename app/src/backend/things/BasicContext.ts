import { getConfig } from "../../config/Config"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"
import { Lexeme, extrapolate, makeLexeme } from "../../frontend/lexer/Lexeme"
import { AstType, Syntax } from "../../frontend/parser/interfaces/Syntax"
import { maxPrecedence } from "../../frontend/parser/maxPrecedence"
import { Id } from "../../middle/id/Id"
import { BaseThing } from "./BaseThing"
import { Context } from "./Context"
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

    setSyntax = (name: string, syntax: Syntax) => {
        this.setLexeme(makeLexeme({ type: 'noun', root: name, referents: [] }))
        this.syntaxMap[name as CompositeType] = syntax
        this.syntaxList = this.refreshSyntaxList()
    }

    getSyntax = (name: AstType) => {
        return this.syntaxMap[name as CompositeType]
    }

    get astTypes(): AstType[] {
        const res: AstType[] = this.config.lexemeTypes.slice() //copy!
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
