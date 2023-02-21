
import { Lexeme } from "../Lexeme";

export function isConcept(lexeme?: Lexeme) {
    return lexeme?.type === 'noun' && lexeme?.concepts && !lexeme.proto
}