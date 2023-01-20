import { Lexeme } from "./Lexeme";
import { LexemeType } from "./LexemeType";


export const lexemes: Lexeme<LexemeType>[] = [
    {
        root: 'have',
        type: 'mverb',
        forms: ['have', 'has'],
        regular: false
    },

    {
        root: 'button',
        type: 'noun',
        regular: true
    },

    {
        root: 'click',
        type: 'mverb',
        forms: ['click'],
        regular: true
    },

    {
        root: 'clicked',
        type: 'adj',
        derivedFrom: 'click'
    },

    {
        root: 'pressed',
        type: 'adj',
        aliasFor: 'clicked'
    },

    {
        root: 'cat',
        type: 'noun'
    },

    {
        root: 'be',
        type: 'copula',
        forms: ['is', 'are'],
        regular: false
    },

    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },

    {
        root: "red",
        type: "adj"
    },

    {
        root: "green",
        type: "adj"
    },

    {
        root: "exist",
        type: "iverb",
        regular: true
    },

    {
        root: 'do',
        type: 'hverb',
        regular: false,
        forms: ['do', 'does']
    },

    {
        root: 'some',
        type: 'existquant'
    },

    {
        root: 'every',
        type: 'uniquant'
    },

    {
        root: 'all',
        type: 'uniquant'
    },

    {
        root: 'any',
        type: 'uniquant'
    },

    {
        root: 'to',
        type: 'preposition'
    },

    {
        root: 'with',
        type: 'preposition'
    },

    {
        root: 'from',
        type: 'preposition'
    },

    {
        root: 'of',
        type: 'preposition'
    },

    {
        root: 'over',
        type: 'preposition'
    },

    {
        root: 'on',
        type: 'preposition'
    },

    {
        root: 'at',
        type: 'preposition'
    },

    {
        root: 'then',
        type: 'then' // filler word
    },

    {
        root: 'if',
        type: 'subconj'
    },

    {
        root: 'when',
        type: 'subconj'
    },

    {
        root: 'because',
        type: 'subconj'
    },

    {
        root: 'while',
        type: 'subconj'
    },

    {
        root: 'that',
        type: 'relpron'
    },

    {
        root: 'not',
        type: 'negation'
    },

    {
        root: 'the',
        type: 'defart'
    },

    {
        root: 'a',
        type: 'indefart'
    },

    {
        root: 'an',
        type: 'indefart'
    },

    {
        root: '.',
        type: 'fullstop'
    },

    {
        root: 'and',
        type: 'nonsubconj'
    }
]