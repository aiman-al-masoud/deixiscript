import { Lexeme } from "../Lexeme"


export function conjugate(lexeme: Lexeme): string[] {

    const word = lexeme.token ?? lexeme.root

    if (lexeme.irregularForms) {
        return [word, ...lexeme.irregularForms]
    }

    return [word, `${word}s`]

}
