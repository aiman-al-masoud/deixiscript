import { wrap } from "../backend/wrapper/Thing";
import { Lexeme, makeLexeme } from "../frontend/lexer/Lexeme";

const being: Lexeme = makeLexeme({
    root: 'be',
    type: 'copula',
})

const doing: Partial<Lexeme> = {
    root: 'do',
    type: 'hverb',
}

const not: Lexeme = makeLexeme({
    root: 'not',
    type: 'negation',
})


//TODO: put back in prelude!
const buttonThing = wrap({ id: 'button', object: HTMLButtonElement.prototype })
buttonThing.setAlias('color', ['style', 'background'])
buttonThing.setAlias('text', ['textContent'])
const divThing = wrap({ id: 'div', object: HTMLDivElement.prototype })
divThing.setAlias('color', ['style', 'background'])

export const lexemes: (Partial<Lexeme> | Lexeme)[] = [

    being,
    doing,
    not,

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
        root: 'one-or-more',
        type: 'adjective',
        cardinality: '+'
    },

    {
        root: 'zero-or-more',
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
        contractionFor: [being, not]
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
        referent: wrap({ id: 'thing', object: {} })
    },
    {
        root: 'button',
        type: 'noun',
        referent: buttonThing
    },
    {
        root: 'div',
        type: 'noun',
        referent: divThing
    },


    //TODO: put back in prelude!
    { root: 'a', type: 'indefart' },
    { root: 'an', type: 'indefart' },
    { root: 'the', type: 'defart' },
    { root: 'if', type: 'subconj' },
    { root: 'when', type: 'subconj' },
    { root: 'any', type: 'uniquant' },
    { root: 'every', type: 'uniquant' },
    { root: 'of', type: 'preposition' },
    { root: 'that', type: 'relpron' },
    { root: 'it', type: 'pronoun' },

]
