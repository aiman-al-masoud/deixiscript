import { Context } from "../../brain/Context"
import { Lexeme } from "../Lexeme"
import { conjugate } from "./conjugate"
import { dynamicLexeme } from "./dynamicLexeme"
import { numberLexeme } from "./numberLexeme"


export function getLexemes(word: string, context: Context, words: string[]): Lexeme[] {

    const lexeme: Lexeme = context
        .config.lexemes
        .filter(x => conjugate(x).includes(word))
        .at(0)
        ?? numberLexeme(word)
        ?? dynamicLexeme(word, context, words)

    const lexeme2: Lexeme = { ...lexeme, token: word }

    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lexeme2]

}