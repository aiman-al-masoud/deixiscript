import { Lexeme, makeLexeme } from "../lexer/Lexeme"
import { AstNode } from "../parser/interfaces/AstNode"
import { AstType, Syntax, SyntaxMap } from "../parser/interfaces/Syntax"
import { BasicConfig } from "./BasicConfig"
import { lexemes } from "./lexemes"
import { LexemeType, lexemeTypes } from "./LexemeType"
import { prelude } from "./prelude"
import { CompositeType, staticDescPrecedence, syntaxes } from "./syntaxes"

export interface Config {
    readonly lexemes: Lexeme[]
    readonly prelude: string[]
    readonly syntaxList: CompositeType[]
    readonly lexemeTypes: LexemeType[]
    readonly syntaxMap : SyntaxMap
    getSyntax(name: AstType): Syntax
    setSyntax(macro: AstNode): void
    setLexeme(lexeme: Lexeme): void
    getLexeme(rootOrToken: string): Lexeme | undefined
}

export function getConfig(): Config {

    return new BasicConfig(
        lexemeTypes,
        lexemes.map(x => makeLexeme(x)),
        syntaxes,
        prelude,
        staticDescPrecedence
    )
}

