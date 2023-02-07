import { Lexeme } from "../Lexeme";


export function stem(lexeme: Lexeme): string {

    const word = lexeme.token ?? lexeme.root;

    if (lexeme.irregularForms) {
        return word;
    }

    if (word.endsWith('s')) {
        return word.slice(0, -1);
    }

    return word;

}
