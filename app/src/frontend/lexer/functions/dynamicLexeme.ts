import { Context } from "../../../facade/context/Context"
import { clauseOf } from "../../../middle/clauses/Clause"
import { Lexeme, makeLexeme } from "../Lexeme"


export function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {


    const relevant =
        // words
        //     .map(w => clauseOf(makeLexeme({ root: w, type: 'noun' }), 'X'))
        //     .flatMap(c => context.query(c))
        //     .flatMap(m => Object.values(m))
        //     .flatMap(id => context.get(id) ?? [])
        context.values
            .flatMap(x => x.getLexemes())
            .filter(x => x.token === word || x.root === word)

    // console.log('dynamicLexemes!', word, 'relevant=', relevant)

    const isMacroContext =
        words.some(x => context.getLexeme(x)?.type === 'grammar')
        && !words.some(x => ['defart', 'indefart', 'nonsubconj'].includes(context.getLexeme(x)?.type as any))//TODO: why dependencies('macro') doesn't work?!

    const type = relevant[0]?.type ??
        (isMacroContext ?
            'grammar'
            : 'noun')

    // console.log('dynamicLexeme', relevant.at(0)?.referent)

    return makeLexeme({
        token: word,
        root: relevant?.at(0)?.root ?? word,
        type: type,
        referent: relevant.at(0)?.referent,
    })
}

