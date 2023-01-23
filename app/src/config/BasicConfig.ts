import { Lexeme } from "../lexer/Lexeme"
import { CompositeNode } from "../parser/interfaces/AstNode"
import { LexemeType } from "./LexemeType"
import { CompositeType } from "./syntaxes"
import { Config } from "./Config"
import { macroToSyntax } from "../parser/macroToSyntax"
import { maxPrecedence } from "../parser/maxPrecedence"
import { SyntaxMap, AstType } from "../parser/interfaces/Syntax"

export class BasicConfig implements Config {

    constructor(
        readonly lexemeTypes: LexemeType[],
        protected _syntaxList: CompositeType[],
        protected _lexemes: Lexeme[],
        readonly syntaxMap: SyntaxMap,
        readonly startupCommands: string[],
        readonly staticAscendingPrecedence: CompositeType[]) {
    }

    get syntaxList() {
        return this._syntaxList
            .slice()
            .sort((a, b) => maxPrecedence(b, a, this.syntaxMap, this.staticAscendingPrecedence))
    }

    get lexemes() {
        return this._lexemes
    }

    setSyntax = (macro: CompositeNode<"macro">) => {

        const syntax = macroToSyntax(macro)
        this.setLexeme({ type: 'grammar', root: syntax.name })
        this._syntaxList.push(syntax.name as CompositeType) //TODO: check duplicates?
        this.syntaxMap[syntax.name as CompositeType] = syntax.syntax

    }

    getSyntax = (name: AstType) => {
        return this.syntaxMap[name as CompositeType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

    setLexeme(lexeme: Lexeme) {
        this._lexemes = this._lexemes.filter(x => x.root !== lexeme.root)
        this._lexemes.push(lexeme)
    }

}