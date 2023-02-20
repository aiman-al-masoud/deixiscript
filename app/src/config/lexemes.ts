import { Lexeme } from "../lexer/Lexeme";
import { lexemeTypes } from "./LexemeType";
import { constituentTypes } from "./syntaxes";

export const lexemes: Lexeme[] = [

    // CORE --------------------

    {
        root: 'be',
        type: 'copula',
        plurals: ['are'],
        singulars: ['is', 'art']
    },

    {
        root: 'any',
        type: 'uniquant'
    },

    {
        root: 'of',
        type: 'preposition'
    },

    {
        root: 'then',
        type: 'filler' // filler word, what about partial parsing?
    },

    {
        root: '.',
        type: 'fullstop'
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
        root: 'concept',
        type: 'noun',
        concepts: ['concept']
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
        root: 'object',
        type: 'adjective'
    },

    {
        root: 'do',
        type: 'hverb',
        plurals: ['do'],
        singulars: ['does']
    },

    // END CORE -----------------------------

    {
        root: 'have',
        type: 'mverb',
        plurals: ['have'],
        singulars: ['has']
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
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
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
        root: 'and',
        type: 'nonsubconj'
    },

    {
        root: 'it',
        type: 'pronoun'
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
        root: 'condition',
        type: 'adjective'
    },

    {
        root: 'consequence',
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