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

export const lexemes: Lexeme[] =
    [
        {
            name: 'have',
            type: 'mverb',
            forms: ['have', 'has'],
            regular: false
        },

        {
            name: 'button',
            type: 'noun'
        },

        {
            name: 'click',
            type: 'mverb',
            forms: ['click'],
            regular: true
        },

        {
            name: 'clicked',
            type: 'adj',
            derivedFrom: 'click'
        },

        {
            name: 'pressed',
            type: 'adj',
            aliasFor: 'clicked'
        },

        {
            name: 'cat',
            type: 'noun'
        },

        {
            name: 'be',
            type: 'copula',
            forms: ['is', 'are'],
            regular: false
        },

        {
            name: "isn't",
            type: 'contraction',
            contractionFor: ['is', 'not']
        },

        {
            name: "red",
            type: "adj"
        },

        {
            name: "green",
            type: "adj"
        },

        {
            name: "exist",
            type: "iverb",
            regular: true
        },

        {
            name: 'do',
            type: 'hverb',
            regular: false,
            forms: ['do', 'does']
        },

        {
            name: 'some',
            type: 'existquant'
        },

        {
            name: 'every',
            type: 'uniquant'
        },

        {
            name: 'all',
            type: 'uniquant'
        },

        {
            name: 'any',
            type: 'uniquant'
        },

        {
            name: 'to',
            type: 'preposition'
        },

        {
            name: 'with',
            type: 'preposition'
        },

        {
            name: 'from',
            type: 'preposition'
        },

        {
            name: 'of',
            type: 'preposition'
        },

        {
            name: 'over',
            type: 'preposition'
        },

        {
            name: 'on',
            type: 'preposition'
        },

        {
            name: 'at',
            type: 'preposition'
        },

        {
            name: 'then',
            type: 'then' // filler word
        },

        {
            name: 'if',
            type: 'subconj'
        },

        {
            name: 'when',
            type: 'subconj'
        },

        {
            name: 'because',
            type: 'subconj'
        },

        {
            name: 'while',
            type: 'subconj'
        },

        {
            name: 'that',
            type: 'relpron'
        },

        {
            name: 'not',
            type: 'negation'
        },

        {
            name: 'the',
            type: 'defart'
        },

        {
            name: 'a',
            type: 'indefart'
        },

        {
            name: 'an',
            type: 'indefart'
        },

        {
            name: '.',
            type: 'fullstop'
        },

        {
            name: 'and',
            type: 'nonsubconj'
        }

    ]
