import { Context } from "../../brain/Context"
import { clauseOf } from "../../clauses/Clause"
import { Lexeme } from "../Lexeme"
import { stem } from "./stem"


export function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {

    const stemmedWord = stem({ root: word, type: 'noun' })

    const types = words
        .map(w => clauseOf({ root: w, type: 'noun' }, 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x?.typeOf(stemmedWord))
        .filter(x => x !== undefined)

    const isMacroContext = context.config.lexemes // macro identifying heuristic
        .some(l => l.type === 'grammar' && words.some(w => w === l.root)) //TODO: stem the word w
        && (!words.includes('a') && !words.includes('an') && !words.includes('the') && !words.includes('and')) //TODO: defart/indefart!!!!

    const type = types[0] ??
        (isMacroContext ? 'grammar' : 'noun')

    return { root: stemmedWord, type: type }
}
