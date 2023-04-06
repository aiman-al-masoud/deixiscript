import { Lexeme, makeLexeme } from "../frontend/lexer/Lexeme";
import { buttonThing, colorThing, divThing, greenThing, redThing, thing } from "./things";

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


export const lexemes: (Partial<Lexeme> | Lexeme)[] = [

    being,
    doing,
    not,

    { _root: being, token: 'is', cardinality: 1 },
    { _root: being, token: 'are', cardinality: '*' }, //TODO! 2+
    { _root: doing, token: 'does', cardinality: 1 },

    { root: 'then', type: 'filler' },
    { root: '.', type: 'fullstop' },
    { root: 'optional', type: 'adjective', cardinality: '1|0' },
    { root: 'one-or-more', type: 'adjective', cardinality: '+' },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*' },
    { root: 'or', type: 'disjunc' },
    { root: 'subject', type: 'adjective' },
    { root: 'predicate', type: 'adjective' },
    { root: 'object', type: 'adjective' },
    { root: "isn't", type: 'contraction', contractionFor: [being, not] },
    { root: 'and', type: 'nonsubconj' },
    { root: 'left', type: 'adjective' },
    { root: 'right', type: 'adjective' },
    { root: 'condition', type: 'adjective' },
    { root: 'consequence', type: 'adjective' },
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
    { root: 'thing', type: 'noun', referent: thing },
    { root: 'button', type: 'noun', referent: buttonThing },
    { root: 'div', type: 'noun', referent: divThing },
    { root: 'color', type: 'noun', referent: colorThing },
    { root: 'red', type: 'noun', referent: redThing },
    { root: 'green', type: 'noun', referent: greenThing },

]

