import { Context } from "../../brain/Context"
import { clauseOf } from "../../clauses/Clause"
import { Lexeme, makeLexeme } from "../Lexeme"
import { stem } from "./stem"


export function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {

    const stemmedWord = stem(word)

    const types = words
        .map(w => clauseOf(makeLexeme({ root: w, type: 'noun' }), 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x?.typeOf(stemmedWord))
        .filter(x => x !== undefined)

    const isMacroContext =
        words.some(x => context.config.getLexeme(x)?.type === 'grammar')
        && !words.some(x => ['defart', 'indefart', 'nonsubconj'].includes(context.config.getLexeme(x)?.type as any))//TODO: why dependencies('macro') doesn't work?!

    const type = types[0] ??
        (isMacroContext ?
            'grammar'
            : 'noun')

    return makeLexeme({ root: stemmedWord, type: type })
}
