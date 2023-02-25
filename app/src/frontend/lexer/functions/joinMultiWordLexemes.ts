import { Lexeme } from "../Lexeme";
import { stdspace } from "./stdspace";
import { unspace } from "./unspace";

export function joinMultiWordLexemes(sourceCode: string, lexemes: Lexeme[]) {

    let newSource = sourceCode;

    lexemes
        .filter(x => x.isMultiWord)
        .forEach(x => {
            const lexeme = stdspace(x.root);
            newSource = newSource.replaceAll(lexeme, unspace(lexeme));
        });

    return newSource;
}
