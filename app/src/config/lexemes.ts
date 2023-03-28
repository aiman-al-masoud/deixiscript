import { wrap } from "../backend/wrapper/Wrapper";
import { Lexeme } from "../frontend/lexer/Lexeme";

const being: Partial<Lexeme> = {
    root: 'be',
    type: 'copula',
}

const doing: Partial<Lexeme> = {
    root: 'do',
    type: 'hverb',
}

export const lexemes: Partial<Lexeme>[] = [

    being,
    doing,

    { _root: being, token: 'is', cardinality: 1 },
    { _root: being, token: 'are', cardinality: '*' }, //TODO! 2+
    { _root: doing, token: 'does', cardinality: 1 },

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
        root: 'thing',
        type: 'noun',
    },
    {
        root: 'button',
        type: 'noun',
        referent: wrap({ id: 'button', object: HTMLButtonElement.prototype })
    },
    {
        root: 'div',
        type: 'noun',
        referent: wrap({ id: 'div', object: HTMLDivElement.prototype })
    }

]
