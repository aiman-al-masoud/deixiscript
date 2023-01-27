import { ElementType, stringLiterals } from "./utils"

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
  'then',
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
