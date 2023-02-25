import { Context } from "../../../facade/context/Context"
import { Lexeme } from "../Lexeme"
import { dynamicLexeme } from "./dynamicLexeme"
import { numberLexeme } from "./numberLexeme"


export function getLexemes(word: string, context: Context, words: string[]): Lexeme[] {

    const lex = context.config.getLexeme(word) ??
        numberLexeme(word) ??
        dynamicLexeme(word, context, words)

    return lex.contractionFor ?
        lex.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lex]

}