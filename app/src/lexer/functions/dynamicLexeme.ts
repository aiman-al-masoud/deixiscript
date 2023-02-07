import { Context } from "../../brain/Context";
import { clauseOf } from "../../clauses/Clause";
import { Lexeme } from "../Lexeme";
import { stem } from "./stem";


export function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {

    const stemmedWord = stem({ root: word, type: 'any' });

    const types = words
        .map(w => clauseOf({ root: w, type: 'any' }, 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x?.typeOf(stemmedWord))
        .filter(x => x !== undefined);

    return { root: stemmedWord, type: types[0] ?? 'noun' };
}
