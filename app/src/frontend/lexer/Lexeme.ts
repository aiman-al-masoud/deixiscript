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
    _root?: Partial<Lexeme>
    extrapolate(context: Context): Lexeme[]
    readonly isPlural: boolean
    readonly isMultiWord: boolean

    proto?: string
    concepts?: string[]
    getProto(): object | undefined
    readonly isConcept: boolean
    setAlias(alias: string, path: string[]): void
    heirlooms: Heirloom[]
}

export interface Heirloom { set?: any, get?: any, name: string, value?: any, writable?: boolean }

export function makeLexeme(data: Partial<Lexeme>): Lexeme {
    return new LexemeObject(data)
}