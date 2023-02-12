import { ElementType } from "../utils/ElementType"
import { stringLiterals } from "../utils/stringLiterals"

export type LexemeType = ElementType<typeof lexemeTypes>

export const lexemeTypes = stringLiterals(
  'adjective',
  'contraction',
  'copula',
  'defart',
  'indefart',
  'fullstop',
  'hverb',
  'iverb',
  'mverb',
  'negation',
  'existquant',
  'uniquant',
  'filler',
  'relpron',
  'negation',
  'noun',
  'preposition',
  'subconj',
  'grammar',
  'nonsubconj', // and ...
  'disjunc', // or, but, however ...
  'pronoun',
  'any'
)
