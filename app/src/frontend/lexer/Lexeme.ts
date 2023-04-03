import { LexemeType } from "../../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"
import { Context } from "../../facade/context/Context"
import BaseLexeme from "./BaseLexeme"
import Thing from "../../backend/wrapper/Thing"


export interface Lexeme {
    /**canonical form*/  root: string
    /**token type*/  type: LexemeType
    /**form of this instance*/ token?: string
    /**made up of more lexemes*/  contractionFor?: Lexeme[] //TODO: Lexeme[]
    /**for quantadj */ cardinality?: Cardinality
    _root?: Partial<Lexeme>
    extrapolate(context: Context): Lexeme[] //TODO: optional Context?
    readonly isPlural: boolean
    readonly isVerb: boolean

    referent?: Thing
}

export function makeLexeme(data: Partial<Lexeme> | Lexeme): Lexeme {

    if (data instanceof BaseLexeme) {
        return data
    }

    return new BaseLexeme(data)
}