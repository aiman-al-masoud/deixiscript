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
  'genitive-particle',
  'subconj',
  'nonsubconj', // and
  'disjunc', // or
  'pronoun',
  'makro-keyword',
  'except-keyword',
  'then-keyword',
  'end-keyword',
  'quote',
)
