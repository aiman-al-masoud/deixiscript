import { TokenType } from "../ast/interfaces/Token"
import { lexemes } from "./lexemes"

export interface Lexeme {
    /**usually root form*/ readonly name: string
    /**token type*/ readonly type: TokenType
    /**useful for irregular stuff*/ readonly forms?: string[]
    /**refers to verb conjugations or plural forms*/ readonly regular?: boolean
    /**semantical dependece*/ readonly derivedFrom?: string
    /**semantical equivalence*/ readonly aliasFor?: string
    /**made up of more lexemes*/ readonly contractionFor?: string[]
}

export function formsOf(lexeme: Lexeme) {

    return [lexeme.name].concat(lexeme?.forms ?? [])
        .concat(lexeme.regular ? [`${lexeme.name}s`] : [])

}

export function getLexemes(word: string): Lexeme[] {

    const lexeme = lexemes.filter(x => formsOf(x).includes(word))[0]
        ?? { name: word, type: 'adj' }

    return lexeme.contractionFor ?
        lexeme.contractionFor.flatMap(x => getLexemes(x)) :
        [lexeme]

}