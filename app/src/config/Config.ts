import { Lexeme } from "../lexer/Lexeme"
import { AstNode } from "../parser/interfaces/AstNode"
import { AstType, Syntax } from "../parser/interfaces/Syntax"
import { BasicConfig } from "./BasicConfig"
import { lexemes } from "./lexemes"
import { LexemeType, lexemeTypes } from "./LexemeType"
import { startupCommands } from "./startupCommands"
import { CompositeType, staticDescPrecedence, syntaxes } from "./syntaxes"

export interface Config {
    readonly lexemes: Lexeme[]
    readonly startupCommands: string[]
    readonly syntaxList: CompositeType[]
    readonly lexemeTypes: LexemeType[]
    getSyntax(name: AstType): Syntax
    setSyntax(macro: AstNode): void
    setLexeme(lexeme: Lexeme): void
}

export function getConfig(): Config {

    return new BasicConfig(
        lexemeTypes,
        lexemes,
        syntaxes,
        startupCommands,
        staticDescPrecedence)
}

