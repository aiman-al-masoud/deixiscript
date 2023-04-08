import { LexemeType } from "../../config/LexemeType"
import { Cardinality, isRepeatable } from "../parser/interfaces/Cardinality"
import { pluralize } from "./functions/pluralize"
import { conjugate } from "./functions/conjugate"
import { Thing } from "../../backend/Thing"
import { Context } from "../../backend/Context"


export interface Lexeme {
    readonly root: string
    readonly type: LexemeType
    readonly token?: string
    readonly cardinality?: Cardinality
    referent?: Thing
}

export function makeLexeme(data: Lexeme): Lexeme {
    return data
}

export function isPlural(lexeme: Lexeme) {
    return isRepeatable(lexeme.cardinality)
}

export function isVerb(lexeme: Lexeme) {
    return lexeme.type === 'mverb' || lexeme.type === 'iverb'
}

export function extrapolate(lexeme: Lexeme, context?: Thing): Lexeme[] {

    if ((lexeme.type === 'noun'/*  || lexeme.type === 'grammar' */) && !isPlural(lexeme)) {
        return [makeLexeme({ root: lexeme.root, type: lexeme.type, token: pluralize(lexeme.root), cardinality: '*', referent: lexeme.referent })]
    }

    if (isVerb(lexeme)) {
        return conjugate(lexeme.root).map(x => makeLexeme({ root: lexeme.root, type: lexeme.type, token: x, referent: lexeme.referent }))
    }

    return []
}

