import { Lexeme } from "../lexer/Lexeme"
import { LexemeType } from "../config/LexemeType"
import { CompositeType } from "../config/syntaxes"

export type SyntaxMap = { [name in CompositeType]: Syntax }

export type Syntax = Member[]

export type Member = {
    readonly type: AstType[]
    readonly number?: Cardinality
    readonly role?: Role
}

export type AstType = LexemeType | CompositeType

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | number // currently only supports =1

export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'

export interface AstNode<T extends AstType> {
    readonly type: T
}

export interface LeafNode<T extends LexemeType> extends AstNode<T> {
    readonly lexeme: Lexeme
}

export interface CompositeNode<T extends CompositeType> extends AstNode<T> {
    readonly links: { [index in AstType | Role]?: AstNode<AstType> }
    readonly role?: Role
}

// export interface Macro extends CompositeNode<'macro'>{
//     readonly links : {
        
//     }
// }

export const isNecessary = (c?: Cardinality) =>
    c === undefined // necessary by default
    || c == '+'
    || +c >= 1

export const isRepeatable = (c?: Cardinality) =>
    c == '+'
    || c == '*'
