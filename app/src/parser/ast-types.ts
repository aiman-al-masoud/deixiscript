import { Lexeme } from "../lexer/Lexeme"
import { LexemeType } from "../config/LexemeType"
import { ConstituentType } from "../config/syntaxes"

export type AstType = LexemeType | ConstituentType

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
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
    readonly links: { [index in AstType | Role]?: AstNode<AstType> }
    readonly role?: Role
}

export const isNecessary = (m: Member) => {
    return m.number === 1 || m.number === '+';
}