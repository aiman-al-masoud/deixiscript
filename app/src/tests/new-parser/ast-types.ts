
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
    type: AstType[]
    number?: Cardinality
    role?: Role
}

export interface AstNode<T extends AstType> {
    type: T
    name?: string
}

export interface AtomNode extends AstNode<LexemeType> {
    lexeme: Lexeme<LexemeType>
}

export interface CompositeNode extends AstNode<ConstituentType> {
    links: (AstNode<AstType> | undefined)[]
    role? : Role
}

