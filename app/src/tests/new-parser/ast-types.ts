
import { LexemeType } from "../../ast/interfaces/LexemeType"
import { Lexeme } from "../../lexer/Lexeme"
import { ConstituentType } from "./blueprints"

export type AstType = LexemeType | ConstituentType

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | number

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
    readonly lexeme: Lexeme<LexemeType>
}

export interface CompositeNode<T extends ConstituentType> extends AstNode<T> {
    readonly links: (AstNode<AstType> | undefined)[]
    readonly role?: Role
}