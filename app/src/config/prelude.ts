export const prelude: string =

  `
  makro 
    any-lexeme is adjective 
            or copula 
            or defart 
            or indefart 
            or fullstop 
            or hverb 
            or verb 
            or negation 
            or existquant 
            or uniquant 
            or relpron 
            or negation 
            or noun 
            or preposition 
            or subconj 
            or nonsubconj 
            or disjunc 
            or pronoun 
            or then-keyword
            or makro-keyword 
            or except-keyword 
            or quote
  end.
  
  makro 
    quantifier is uniquant or existquant 
  end.

  makro 
    article is indefart or defart 
  end.

  makro 
    complement is preposition then object noun-phrase 
  end.

  makro 
    copula-sentence is subject noun-phrase 
      then copula 
      then optional negation 
      then predicate noun-phrase 
  end.

  makro
    and-phrase is nonsubconj then noun-phrase
  end.

  makro
    genitive-complement is genitive-particle then owner noun-phrase
  end.

  makro 
    noun-phrase is optional quantifier 
      then optional article 
      then zero-or-more adjectives 
      then zero-or-more subject noun or pronoun or string
      then optional subclause
      then optional genitive-complement
      then optional and-phrase
  end.

  makro 
    copulasubclause is relpron then copula then predicate noun-phrase 
  end.

  makro 
    mverbsubclause is relpron then verb then object noun-phrase 
  end.

  makro 
    subclause is copulasubclause or mverbsubclause 
  end.
  
  makro 
    verb-sentence is subject noun-phrase 
      then optional hverb 
      then optional negation 
      then verb 
      then optional object noun-phrase
      then zero-or-more complements
  end.

  makro 
    simple-sentence is copula-sentence or verb-sentence 
  end.

  makro 
  complex-sentence-1 is subconj 
      then condition simple-sentence 
      then then-keyword
      then consequence simple-sentence
  end.

  makro 
    complex-sentence-2 is consequence simple-sentence 
      then subconj 
      then condition simple-sentence
  end.

  makro 
    string is quote then one-or-more token any-lexeme except quote then quote 
  end.

  `
