import { Lexeme } from "../lexer/Lexeme"
import { CompositeNode } from "../parser/interfaces/AstNode"
import { LexemeType } from "./LexemeType"
import { CompositeType } from "./syntaxes"
import { Config } from "./Config"
import { macroToSyntax } from "../parser/macroToSyntax"
import { maxPrecedence } from "../parser/maxPrecedence"
import { SyntaxMap, AstType, Syntax } from "../parser/interfaces/Syntax"

export class BasicConfig implements Config {

    constructor(
        readonly lexemes: Lexeme[],
        readonly lexemeTypes: LexemeType[],
        readonly _syntaxList: CompositeType[],
        readonly syntaxMap: SyntaxMap,
        readonly startupCommands: string[]) {
    }

    get syntaxList() {
        return this._syntaxList.slice().sort((a, b) => maxPrecedence(b, a, this.syntaxMap, this._syntaxList.slice(0, 4)))
    }

    setSyntax = (macro: CompositeNode<"macro">): void => {

        const syntax = macroToSyntax(macro)
        this.lexemes.push({ type: 'grammar', root: syntax.name }) //TODO: may need to remove old if reassigning! 
        this._syntaxList.push(syntax.name as CompositeType) //TODO: check duplicates?
        this.syntaxMap[syntax.name as CompositeType] = syntax.syntax

    }

    getSyntax = (name: AstType): Syntax => {
        return this.syntaxMap[name as CompositeType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

}