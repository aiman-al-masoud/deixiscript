import { LexemeType } from "../../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"
import { Context } from "../../facade/context/Context"
import BaseLexeme from "./BaseLexeme"
import Wrapper from "../../backend/wrapper/Wrapper"


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
    readonly isVerb: boolean


    referent?: Wrapper
    readonly isConcept: boolean
}

export function makeLexeme(data: Partial<Lexeme>): Lexeme {
    return new BaseLexeme(data)
}