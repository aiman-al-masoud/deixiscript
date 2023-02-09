import { Lexeme } from "../lexer/Lexeme";
import { lexemeTypes } from "./LexemeType";
import { constituentTypes } from "./syntaxes";

export const lexemes: Lexeme[] = [

    {
        root: 'have',
        type: 'mverb',
        irregularForms: ['have', 'has']
    },

    {
        root: 'button',
        type: 'noun',
        proto: 'HTMLButtonElement'
    },

    {
        root: 'div',
        type: 'noun',
        proto: 'HTMLDivElement'
    },

    {
        root: 'element',
        type: 'noun',
        proto: 'HTMLElement'
    },

    {
        root: 'list',
        type: 'noun',
        proto: 'Array'
    },

    {
        root: 'cat',
        type: 'noun'
    },

    {
        root: 'be',
        type: 'copula',
        irregularForms: ['is', 'are']
    },

    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },

    {
        root: 'do',
        type: 'hverb',
        irregularForms: ['do', 'does']
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
        type: 'then' // filler word, what about partial parsing?
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
        root: 'subject',
        type: 'adjective'
    },

    {
        root: 'predicate',
        type: 'adjective'
    },

    {
        root: 'optional',
        type: 'adjective',
        cardinality: '1|0'
    },

    {
        root: 'one or more',
        type: 'adjective',
        cardinality: '+'
    },

    {
        root: 'zero or more',
        type: 'adjective',
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

    {
        root: 'concept',
        type: 'noun',
        concepts: ['concept']
    },

    {
        root: 'left',
        type: 'adjective'
    },

    {
        root: 'right',
        type: 'adjective'
    },

    {
        root: 'object',
        type: 'adjective'
    }
]

/**
 * Grammar
 */
constituentTypes.concat(lexemeTypes as any).forEach(g => {
    lexemes.push({
        root: g,
        type: 'grammar'
    })
})