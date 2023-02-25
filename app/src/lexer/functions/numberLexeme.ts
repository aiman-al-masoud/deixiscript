import { makeLexeme } from "../Lexeme"


export function numberLexeme(word: string) {

    if (word.match(/\d+/)) {
        return makeLexeme({ root: word, type: 'noun', proto: 'Number' })
    }

}
