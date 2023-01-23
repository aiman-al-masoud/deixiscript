import { Lexeme } from "../lexer/Lexeme";

export const lexemes: Lexeme[] = [
    {
        root: 'have',
        type: 'mverb',
        forms: ['have', 'has'],
        irregular: true
    },

    {
        root: 'button',
        type: 'noun',
        proto: 'HTMLButtonElement'
    },

    {
        root: 'list',
        type: 'noun',
        proto: 'Array'
    },

    {
        root: 'click',
        type: 'mverb',
        forms: ['click']
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
        irregular: true
    },

    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },

    {
        root: "red",
        type: "adj",
        concepts: ['color']

    },

    {
        root: "green",
        type: "adj",
        concepts: ['color']

    },

    {
        root: "exist",
        type: "iverb",
    },

    {
        root: 'do',
        type: 'hverb',
        irregular: true,
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
    },
    {
        root: 'black',
        type: 'adj',
        concepts: ['color']
    },

    {
        root: 'blue',
        type: 'adj',
        concepts: ['color']

    },


    {
        root: 'subject',
        type: 'adj'
    },

    {
        root: 'predicate',
        type: 'adj'
    },

    {
        root: 'optional',
        type: 'adj',
        cardinality: '1|0'
    },

    {
        root: 'one-or-more',
        type: 'adj',
        cardinality: '+'
    },

    {
        root: 'zero-or-more',
        type: 'adj',
        cardinality: '*'
    },

    {
        root: 'or',
        type: 'disjunc'
    },

    {
        root: 'it',
        type: 'pronoun'
    },

    // grammar

    {
        root: 'negation',
        type: 'grammar'
    },

    {
        root: 'iverb',
        type: 'grammar'
    },

    {
        root: 'noun',
        type: 'grammar'
    },

    {
        root: 'adj',
        type: 'grammar'
    },

    {
        root: 'copula',
        type: 'grammar'
    },

    {
        root: 'preposition',
        type: 'grammar'
    },

    {
        root: 'uniquant',
        type: 'grammar'
    },

    {
        root: 'existquant',
        type: 'grammar'
    },

    {
        root: 'defart',
        type: 'grammar'
    },

    {
        root: 'indefart',
        type: 'grammar'
    },

    {
        root: 'relpron',
        type: 'grammar'
    },

    {
        root: 'subclause', // TODO: remove!
        type: 'grammar'
    },

    {
        root: 'nounphrase', // TODO: remove!
        type: 'grammar'
    },

    {
        root: 'pronoun',
        type: 'grammar'
    },


]