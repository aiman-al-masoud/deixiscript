import { Cardinality } from "./Cardinality"
import { LexemeType } from "../../../config/LexemeType"
import { CompositeType } from "../../../config/syntaxes"

export type Syntax = Member[]

export type SyntaxMap = {
    [name in CompositeType]: Syntax
}

export type Member = {
    readonly types: AstType[]
    readonly number?: Cardinality
    readonly role?: string
    readonly exceptTypes?: AstType[]
}

export type AstType = LexemeType | CompositeType