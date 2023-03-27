import { makeLexeme } from "../Lexeme"


export function numberLexeme(word: string) {

    if (word.match(/\d+/)) {//TODO
        return makeLexeme({ root: word, type: 'noun', /* proto: 'Number' */ })
    }

}
