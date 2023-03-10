import { LexemeType } from "../../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"
import { Context } from "../../facade/context/Context"
import LexemeObject from "./LexemeObject"


export interface Lexeme {
    /**canonical form*/  root: string
    /**token type*/  type: LexemeType
    /**form of this instance*/ token?: string
    /**made up of more lexemes*/  contractionFor?: string[]
    /**for quantadj */ cardinality?: Cardinality
    proto?: string
    concepts?: string[]
    _root?: Partial<Lexeme>
    extrapolate(context: Context): Lexeme[]
    getProto(): object | undefined
    readonly isPlural: boolean
    readonly isConcept: boolean
    readonly isMultiWord: boolean
    setAlias(alias: string, path: string[]): void
    heirlooms: { set?: any, get?: any, name: string }[]
}

export function makeLexeme(data: Partial<Lexeme>): Lexeme {
    return new LexemeObject(data)
}