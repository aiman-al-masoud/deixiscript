import { Lexeme } from "../Lexeme"
import { isIrregular } from "./isIrregular"


export function conjugate(lexeme: Lexeme): string[] {

    const word = lexeme.token ?? lexeme.root

    if (isIrregular(lexeme)) {
        return [word, ...lexeme.plurals ?? [], ...lexeme.singulars ?? []]
    }

    return [word, `${word}s`]

}
