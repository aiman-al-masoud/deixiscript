import { Lexeme } from "../Lexeme";

export function isIrregular(lexeme: Lexeme) {
    return lexeme.plurals || lexeme.singulars
}