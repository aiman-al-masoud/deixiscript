import { Lexeme } from "../Lexeme";

export function isPlural(lexeme: Lexeme) {

    if (!lexeme.token) {
        return false
    }

    return lexeme.plurals?.includes(lexeme.token) ||
        (!lexeme.plurals && lexeme.type==='noun' && lexeme.token.endsWith('s'))

}