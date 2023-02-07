import { Lexeme } from "../Lexeme";
import { isMultiWord } from "./isMultiWord";
import { stdspace } from "./stdspace";
import { unspace } from "./unspace";

export function joinMultiWordLexemes(sourceCode: string, lexemes: Lexeme[]) {

    let newSource = sourceCode;

    lexemes
        .filter(x => isMultiWord(x))
        .forEach(x => {
            const lexeme = stdspace(x.root);
            newSource = newSource.replaceAll(lexeme, unspace(lexeme));
        });

    return newSource;
}
