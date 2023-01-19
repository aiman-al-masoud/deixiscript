import { LexemeType } from "../ast/interfaces/LexemeType"
import { lexemes } from "./lexemes"

export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**useful for irregular stuff*/ readonly forms?: string[]
    /**refers to verb conjugations or plural forms*/ readonly regular?: boolean
    /**semantical dependece*/ readonly derivedFrom?: string
    /**semantical equivalence*/ readonly aliasFor?: string
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
}

export function formsOf(lexeme: Lexeme) {

    return [lexeme.root].concat(lexeme?.forms ?? [])
        .concat(lexeme.regular ? [`${lexeme.root}s`] : [])

}

export function getLexemes(word: string): Lexeme[] {

    const lexeme: Lexeme =
        lexemes.filter(x => formsOf(x).includes(word)).at(0)
        ?? { root: word, type: 'adj' }

    const lexeme2: Lexeme = { ...lexeme, token: word }

    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x)) :
        [lexeme2]

}