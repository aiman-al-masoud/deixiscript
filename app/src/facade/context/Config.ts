import { lexemes } from "../../config/lexemes"
import { LexemeType, lexemeTypes } from "../../config/LexemeType"
import { prelude } from "../../config/prelude"
import { CompositeType, syntaxes, staticDescPrecedence } from "../../config/syntaxes"
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme"
import { AstNode } from "../../frontend/parser/interfaces/AstNode"
import { SyntaxMap, AstType, Syntax } from "../../frontend/parser/interfaces/Syntax"
import { BasicConfig } from "./BasicConfig"


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

