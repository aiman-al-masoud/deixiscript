import { ElementType, stringLiterals } from "./utils"

export const lexemeTypes = stringLiterals(
  'adj',
  'contraction',
  'copula',
  'defart',
  'indefart',
  'fullstop',
  'hverb',
  'iverb',
  'mverb',
  'negation',
  'nonsubconj',
  'existquant',
  'uniquant',
  'then',
  'relpron',
  'negation',
  'noun',
  'preposition',
  'subconj',
  'grammar',
  // 'quantadj',
  'disjunc', // or, but, however ...
  'pronoun'
)
// 'semantics' //?

export type LexemeType = ElementType<typeof lexemeTypes>