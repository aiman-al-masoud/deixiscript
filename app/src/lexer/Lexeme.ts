import { LexemeType } from "../config/LexemeType"
import { Cardinality } from "../parser/ast-types"


export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**useful for irregular stuff*/ readonly forms?: string[]
    /**refers to verb conjugations or plural forms, assume regularity*/ readonly irregular?: boolean
    /**semantical dependece*/ readonly derivedFrom?: string
    /**semantical equivalence*/ readonly aliasFor?: string
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
    /**for quantadj */ readonly cardinality?: Cardinality
    readonly concepts?: string[]
    readonly proto?: string
}

export function formsOf(lexeme: Lexeme) {

    return [lexeme.root].concat(lexeme?.forms ?? [])
        .concat(!lexeme.irregular ? [`${lexeme.root}s`] : [])

}

export function getLexemes(word: string, lexemes: Lexeme[]): Lexeme[] {

    const lexeme: Lexeme =
        lexemes.filter(x => formsOf(x).includes(word)).at(0)
        ?? { root: word, type: 'noun' }

    const lexeme2: Lexeme = { ...lexeme, token: word }

    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, lexemes)) :
        [lexeme2]

}

export function getProto(lexeme: Lexeme) {
    return (window as any)?.[lexeme.proto as any]?.prototype
}