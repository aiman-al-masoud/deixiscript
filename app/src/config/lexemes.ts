import { Lexeme } from "../lexer/Lexeme";
import { lexemeTypes } from "./LexemeType";
import { constituentTypes } from "./syntaxes";

export const lexemes: Lexeme[] = [

    {
        root: 'be',
        type: 'copula',
        plurals: ['are'],
        singulars: ['is', 'art']
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

    {
        root: 'have',
        type: 'mverb',
        plurals: ['have'],
        singulars: ['has']
    },

    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },

    {
        root: 'and',
        type: 'nonsubconj'
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