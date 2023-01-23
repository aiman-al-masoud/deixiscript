import { Lexeme } from "../lexer/Lexeme"
import { AstType, CompositeNode, Member } from "../parser/ast-types"
import { BasicConfig } from "./BasicConfig"
import { lexemes } from "./lexemes"
import { LexemeType, lexemeTypes } from "./LexemeType"
import { startupCommands } from "./startupCommands"
import { CompositeType, constituentTypes, syntaxes } from "./syntaxes"

export interface Config {
    readonly lexemes: Lexeme[]
    readonly startupCommands: string[]
    readonly syntaxList: CompositeType[]
    readonly lexemeTypes: LexemeType[]
    getSyntax(name: AstType): Member[]
    setSyntax(macro: CompositeNode<'macro'>): void
}

export function getConfig(): Config {

    return new BasicConfig(lexemes,
        lexemeTypes,
        constituentTypes,
        syntaxes,
        startupCommands)
}

