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
        readonly staticDescPrecedence: CompositeType[]) {
    }

    get syntaxList(): CompositeType[] {

        const sy1 =
            this._syntaxList.filter(x => !this.staticDescPrecedence.includes(x))
                .sort((a, b) => maxPrecedence(b, a, this.syntaxMap))

        const sy2 = [...new Set(sy1)]

        return this.staticDescPrecedence.slice().concat(sy2)

        return [
            'macro',
            'macropart',
            'taggedunion',
            'and sentence',
            'copula sentence',
            'complement',
            'subclause',
            'noun phrase']
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