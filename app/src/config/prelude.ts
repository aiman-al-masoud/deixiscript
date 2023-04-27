export const prelude: string =

  `  
  makro 
    quantifier is uniquant or existquant 
  end.

  makro 
    article is indefart or defart 
  end.

  makro
    genitive-complement is genitive-particle then owner noun-phrase
  end.

  makro
    dative-complement is dative-particle then receiver noun-phrase
  end.

  makro
    ablative-complement is ablative-particle then origin noun-phrase
  end.

  makro
    locative-complement is locative-particle then location noun-phrase
  end.

  makro
    instrumental-complement is instrumental-particle then instrument noun-phrase
  end.

  makro
    comitative-complement is comitative-particle then companion noun-phrase
  end.

  makro 
    complement is 
    genitive-complement or 
    dative-complement or
    ablative-complement or
    locative-complement or
    instrumental-complement or
    comitative-complement
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
    limit-phrase is next-keyword or previous-keyword then optional number-literal
  end.

  makro
    math-expression is operator plus-operator then noun-phrase
  end.

  makro 
    noun-phrase is 
    optional quantifier 
    then optional article 
    then zero-or-more adjectives
    then optional limit-phrase 
    then subject noun or pronoun or string or number-literal
    then optional math-expression
    then optional subordinate-clause
    then optional genitive-complement
    then optional and-phrase
  end.

  makro 
    verb-sentence is 
    subject noun-phrase 
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
    complex-sentence-one is 
    subconj 
    then condition simple-sentence 
    then then-keyword
    then consequence simple-sentence
  end.

  makro 
    complex-sentence-two is 
    consequence simple-sentence 
    then subconj 
    then condition simple-sentence
  end.

  makro 
    complex-sentence is complex-sentence-one or complex-sentence-two
  end.

  makro 
    string is quote then one-or-more string-token any-lexeme except quote then quote 
  end.
  `
