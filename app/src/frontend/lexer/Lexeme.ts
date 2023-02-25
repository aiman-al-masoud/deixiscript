import { LexemeType } from "../../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"
import { Context } from "../../facade/context/Context"
import LexemeObject from "./LexemeObject"


export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**form of this instance*/readonly token?: string
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**for quantadj */ readonly cardinality?: Cardinality
    readonly proto?: string
    readonly concepts?: string[]
    readonly _root?: Partial<Lexeme>
    readonly isPlural: boolean
    readonly isConcept: boolean

    extrapolate(context: Context): Lexeme[]
    readonly isMultiWord:boolean
    getProto():object|undefined

}

export function makeLexeme(data: Partial<Lexeme>): Lexeme {

    if (data instanceof LexemeObject) {
        return data
    }

    return new LexemeObject(data)

}