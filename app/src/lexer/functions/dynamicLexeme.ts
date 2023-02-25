import { Context } from "../../brain/Context"
import { clauseOf } from "../../clauses/Clause"
import { Lexeme, makeLexeme } from "../Lexeme"


export function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {

    const objects = words
        .map(w => clauseOf(makeLexeme({ root: w, type: 'noun' }), 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))

    let dynamicLexemes = objects.flatMap(o => o?.dynamic() ?? [])
    dynamicLexemes = dynamicLexemes.concat(dynamicLexemes.flatMap(x => x.extrapolate(context.config)))

    const relevant = dynamicLexemes.filter(x => x.root === word || x.token === word)

    const isMacroContext =
        words.some(x => context.config.getLexeme(x)?.type === 'grammar')
        && !words.some(x => ['defart', 'indefart', 'nonsubconj'].includes(context.config.getLexeme(x)?.type as any))//TODO: why dependencies('macro') doesn't work?!

    const type = relevant[0]?.type ??
        (isMacroContext ?
            'grammar'
            : 'noun')

    return makeLexeme({ token: word, root: relevant?.at(0)?.root ?? word, type: type })
}
