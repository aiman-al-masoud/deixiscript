import { Lexeme } from "../lexer/Lexeme"
import { LexemeType } from "../config/LexemeType"
import { ConstituentType } from "../config/syntaxes"

export type AstType = LexemeType | ConstituentType

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | number // currently only supports =1

export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'

export type Member = {
    readonly type: AstType[]
    readonly number?: Cardinality
    readonly role?: Role
}

export interface AstNode<T extends AstType> {
    readonly type: T
}

export interface AtomNode<T extends LexemeType> extends AstNode<T> {
    readonly lexeme: Lexeme
}

export interface CompositeNode<T extends ConstituentType> extends AstNode<T> {
    readonly links: { [index in AstType | Role]?: AstNode<AstType> }
    readonly role?: Role
}

export const isNecessary = (c?: Cardinality) =>
    c === undefined // necessary by default
    || c == '+'
    || +c >= 1

export const isRepeatable = (c?: Cardinality) =>
    c == '+'
    || c == '*'
