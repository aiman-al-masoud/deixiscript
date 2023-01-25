import { Lexeme } from "../../lexer/Lexeme"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"
import { AstType } from "./Syntax"

export interface AstNode<T extends AstType> {
    readonly type: T
    readonly links?: Links
    readonly lexeme?: Lexeme
}

export interface LeafNode<T extends LexemeType> extends AstNode<T> {
    readonly lexeme: Lexeme
}

export interface CompositeNode<T extends CompositeType> extends AstNode<T> {
    readonly links: Links
    readonly role?: Role
}

export type Links = { [index in AstType | Role]?: AstNode<AstType> } //| AstNode<AstType>[]

export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'

// export interface Macro extends CompositeNode<'macro'>{
//     readonly links : {
        
//     }
// }

