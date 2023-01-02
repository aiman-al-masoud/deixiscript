import { lexemes } from "./lexemes"

export interface Lexeme {
    readonly name: string
    readonly type: string
    readonly forms?: string[]
    readonly regular?: boolean
    readonly derivedFrom?: string
    readonly aliasFor?: string
    readonly contractionFor?: string[]
}

export function formsOf(lexeme: Lexeme) {

    return [lexeme.name].concat(lexeme?.forms ?? [])
        .concat(lexeme.regular ? [`${lexeme.name}s`] : [])

}

export function getLexemes(word: string): Lexeme[] {

    const lexeme = lexemes.filter(x => formsOf(x).includes(word))[0] ?? { name: word, type: 'adj' }

    return lexeme.contractionFor ?
        lexeme.contractionFor.flatMap(x => getLexemes(x)) :
        [lexeme]

}