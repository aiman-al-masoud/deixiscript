import { Lexeme } from "../lexer/Lexeme"
import { AstType, Member } from "../parser/ast-types"
import { LexemeType } from "./LexemeType"
import { lexemes } from "./lexemes"
import { getSyntax } from "./syntaxes"
import { startupCommands } from "./startupCommands"

export interface Config {
    readonly lexemes: Lexeme<LexemeType>[]
    getSyntax(name: AstType): Member[]
    readonly startupCommands: string[]
}

export function getConfig() {
    return {
        lexemes,
        getSyntax,
        startupCommands
    }
}