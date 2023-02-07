import { Context } from "../brain/Context"
import { clauseOf } from "../clauses/Clause"
import { LexemeType } from "../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"


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

export function getLexemes(word: string, context: Context, words: string[]): Lexeme[] {

    const lexeme: Lexeme = context
        .config
        .lexemes
        .filter(x => conjugate(x).includes(word))
        .at(0) ?? dynamicLexeme(word, context, words)

    const lexeme2: Lexeme = { ...lexeme, token: word }

    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lexeme2]

}

function dynamicLexeme(word: string, context: Context, words: string[]): Lexeme {

    const stemmedWord = stem({ root: word, type: 'any' })

    const types = words
        .map(w => clauseOf({ root: w, type: 'any' }, 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x?.typeOf(stemmedWord))
        .filter(x => x !== undefined)

    return { root: stemmedWord, type: types[0] ?? 'noun' }
}

export function getProto(lexeme: Lexeme): Object | undefined {
    return (window as any)?.[lexeme.proto as any]?.prototype
}

export function isConcept(lexeme?: Lexeme) {
    return lexeme?.concepts?.includes('concept')
}

export function isMultiWord(lexeme: Lexeme) {
    return lexeme.root.includes(' ')
}

export function unspace(string: string) {
    return string.replaceAll(' ', '-')
}

export function respace(string: string) {
    return string.replaceAll('-', ' ')
}

export function stdspace(string: string) {
    return string.replaceAll(/\s+/g, ' ')
}

function stem(lexeme: Lexeme): string {

    const word = lexeme.token ?? lexeme.root

    if (lexeme.irregular) {
        return word
    }

    if (word.endsWith('s')) {
        return word.slice(0, -1)
    }

    return word

}

function conjugate(lexeme: Lexeme): string[] {

    const word = lexeme.token ?? lexeme.root

    if (lexeme.irregular) {
        return [word, ...lexeme.forms ?? []]
    }

    return [word, `${word}s`]

}