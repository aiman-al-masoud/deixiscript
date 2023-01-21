import { LexemeType } from "../config/LexemeType"


export interface Lexeme<T extends LexemeType> {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: T
    /**useful for irregular stuff*/ readonly forms?: string[]
    /**refers to verb conjugations or plural forms*/ readonly regular?: boolean
    /**semantical dependece*/ readonly derivedFrom?: string
    /**semantical equivalence*/ readonly aliasFor?: string
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
}

export function formsOf(lexeme: Lexeme<LexemeType>) {

    return [lexeme.root].concat(lexeme?.forms ?? [])
        .concat(lexeme.regular ? [`${lexeme.root}s`] : [])

}

export function getLexemes(word: string, lexemes: Lexeme<LexemeType>[]): Lexeme<LexemeType>[] {

    const lexeme: Lexeme<LexemeType> =
        lexemes.filter(x => formsOf(x).includes(word)).at(0)
        ?? { root: word, type: 'noun' }

    const lexeme2: Lexeme<LexemeType> = { ...lexeme, token: word }

    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, lexemes)) :
        [lexeme2]

}
