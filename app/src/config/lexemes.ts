import { Lexeme } from "../frontend/lexer/Lexeme";

const be: Partial<Lexeme> = {
    root: 'be',
    type: 'copula',
}

const _do: Partial<Lexeme> = {
    root: 'do',
    type: 'hverb',
}

export const lexemes: Partial<Lexeme>[] = [

    be,
    _do,

    { _root: be, token: 'is', cardinality: 1 },
    { _root: be, token: 'are', cardinality: '*' }, //TODO! 2+
    { _root: _do, token: 'does', cardinality: 1 },

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
    },

    {
        root: 'number',
        type: 'noun',
        proto: 'Number',
        heirlooms: [
            { name: 'add', value: function (a: any) { return this + a } },
            { name: 'multiply', value: function (a: any) { return this as any * a } },
        ]
    }
]
