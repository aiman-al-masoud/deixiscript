import { ElementType } from "../utils/ElementType"
import { stringLiterals } from "../utils/stringLiterals"

export type LexemeType = ElementType<typeof lexemeTypes>

export const lexemeTypes = stringLiterals(
  'adjective',
  'copula',
  'defart',
  'indefart',
  'fullstop',
  'hverb',
  'verb',
  'negation',
  'existquant',
  'uniquant',
  'relpron',
  'negation',
  'noun',
  'preposition',
  'subconj',
  'nonsubconj', // and
  'disjunc', // or
  'pronoun',
  'quote',

  'makro-keyword',
  'except-keyword',
  'then-keyword',
  'end-keyword',

  'genitive-particle',
  'dative-particle',
  'ablative-particle',
  'locative-particle',
  'instrumental-particle',
  'comitative-particle',

  'next-keyword',
  'previous-keyword',

)
