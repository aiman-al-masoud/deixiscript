import { ElementType, stringLiterals } from "./utils"

export type LexemeType = ElementType<typeof lexemeTypes>

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
  'pronoun'
)
// 'quantadj',
// 'semantics' //?
