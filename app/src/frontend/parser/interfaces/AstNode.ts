import { Lexeme } from "../../lexer/Lexeme"
import { AstType } from "./Syntax"

export interface AstNode {
    readonly type: AstType
    readonly links?: { [index in AstType | Role]?: AstNode }
    readonly lexeme?: Lexeme
    readonly list?: AstNode[]
    readonly role?: Role
}

export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'
    | 'left'
    | 'right'
    | 'owner'
    