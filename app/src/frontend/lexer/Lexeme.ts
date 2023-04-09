import { LexemeType } from "../../config/LexemeType"
import { Cardinality, isRepeatable } from "../parser/interfaces/Cardinality"
import { pluralize } from "./functions/pluralize"
import { conjugate } from "./functions/conjugate"
import { Thing } from "../../backend/Thing"


export interface Lexeme {
    readonly root: string
    readonly type: LexemeType
    readonly token?: string
    readonly cardinality?: Cardinality
    referents: Thing[]
}

export function makeLexeme(data: Lexeme): Lexeme {
    return data
}

export function isPlural(lexeme: Lexeme) {
    return isRepeatable(lexeme.cardinality)
}

export function extrapolate(lexeme: Lexeme, context?: Thing): Lexeme[] {

    if (lexeme.type === 'noun' && !isPlural(lexeme)) {
        return [makeLexeme({
            root: lexeme.root,
            type: lexeme.type,
            token: pluralize(lexeme.root),
            cardinality: '*',
            referents: lexeme.referents
        })]
    }

    if (lexeme.type === 'verb') {
        return conjugate(lexeme.root).map(x => makeLexeme({
            root: lexeme.root,
            type: lexeme.type,
            token: x,
            referents: lexeme.referents
        }))
    }

    return []
}

