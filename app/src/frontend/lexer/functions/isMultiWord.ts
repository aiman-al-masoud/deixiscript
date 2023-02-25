
import { Lexeme } from "../Lexeme";

export function isMultiWord(lexeme: Lexeme) {
    return lexeme.root.includes(' ');
}
