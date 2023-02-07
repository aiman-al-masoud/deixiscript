
import { Lexeme } from "../Lexeme";

export function isConcept(lexeme?: Lexeme) {
    return lexeme?.concepts?.includes('concept');
}
