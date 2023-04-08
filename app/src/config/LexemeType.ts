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
  'nonsubconj', // and ...
  'disjunc', // or, but, however ...
  'pronoun',
  'filler',
  'keyword',
)
