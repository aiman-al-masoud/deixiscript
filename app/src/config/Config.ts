import { Lexeme } from "../lexer/Lexeme"
import { AstType, Member } from "../parser/ast-types"
import { LexemeType } from "./LexemeType"
import { lexemes } from "./lexemes"
import { getSyntax } from "./syntaxes"
import { startupCommands } from "./startupCommands"
import { constituentTypes, ConstituentType } from "./syntaxes"

export interface Config {
    readonly lexemes: Lexeme<LexemeType>[]
    getSyntax(name: AstType): Member[]
    readonly startupCommands: string[]
    readonly constituentTypes: ConstituentType[]
}

export function getConfig(): Config {
    return {
        lexemes,
        getSyntax,
        startupCommands,
        constituentTypes
    }
}