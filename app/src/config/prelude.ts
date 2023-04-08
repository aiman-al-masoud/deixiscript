export const prelude: string =

  `
  makro quantifier is uniquant or existquant makro. 
  makro article is indefart or defart makro. 
  makro complement is preposition then object noun-phrase makro.
  makro copula-sentence is subject noun-phrase then copula then optional negation then predicate noun-phrase makro.
  makro noun-phrase is optional quantifier then optional article then zero-or-more adjectives then zero-or-more subject noun or pronoun then optional subclause then zero-or-more complements makro.
  makro copulasubclause is relpron then copula then predicate noun-phrase makro.
  makro mverbsubclause is relpron then verb then object noun-phrase makro.
  makro subclause is copulasubclause or mverbsubclause makro.
  makro and-sentence is left copula-sentence or noun-phrase then nonsubconj then one-or-more right and-sentence or copula-sentence or noun-phrase makro.
  makro verb-sentence is subject noun-phrase then optional hverb then optional negation then verb then optional object noun-phrase makro.
  makro simple-sentence is copula-sentence or verb-sentence makro.
  makro cs2 is consequence simple-sentence then subconj then condition simple-sentence makro.
  makro cs1 is subconj then condition simple-sentence then filler then consequence simple-sentence makro.
  `