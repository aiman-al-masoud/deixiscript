import { Lexeme } from "../Lexeme"


export function numberLexeme(word: string): Lexeme | undefined {

    if (word.match(/\d+/)) {
        return { root: word, type: 'noun', proto: 'Number' }
    }

    return undefined
}
