import { Cardinality } from "./Cardinality"
import { Role } from "./AstNode"
import { LexemeType } from "../../config/LexemeType"
import { CompositeType } from "../../config/syntaxes"

export type Syntax = Member[]

export type SyntaxMap = {
    [name in CompositeType]: Syntax
}

export type Member = {
    readonly type: AstType[]
    readonly number?: Cardinality
    readonly role?: Role
}

export type AstType = LexemeType | CompositeType