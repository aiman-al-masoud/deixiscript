import { Lexeme } from "../Lexeme"
import { isIrregular } from "./isIrregular"


export function stem(lexeme: Lexeme): string {

    const word = lexeme.token ?? lexeme.root

    if (isIrregular(lexeme)) {
        return word
    }

    if (word.endsWith('s')) {
        return word.slice(0, -1)
    }

    return word

}
