export const prelude: string[] = [

      // grammar
      'quantifier is uniquant or existquant',
      'article is indefart or defart',
      'complement is preposition then object noun-phrase',

      `copula-sentence is subject noun-phrase 
        then copula 
        then optional negation 
        then predicate noun-phrase`,

      `noun-phrase is optional quantifier 
        then optional article 
        then zero-or-more adjectives 
        then zero-or-more subject noun or pronoun or grammar
        then optional subclause 
        then zero-or-more complements `,

      'copulasubclause is relpron then copula then predicate noun-phrase',
      'mverbsubclause is relpron then mverb then object noun-phrase.',
      'subclause is copulasubclause or mverbsubclause',

      `and-sentence is left copula-sentence or noun-phrase 
        then nonsubconj
        then one-or-more right and-sentence or copula-sentence or noun-phrase`,

      `mverb-sentence is subject noun-phrase 
		then optional hverb
		then optional negation
		then mverb
		then object noun-phrase`, // TODO complements

      `iverb-sentence is subject noun-phrase 
		then optional hverb
		then optional negation
		then iverb`, // TODO complements

      `simple-sentence is copula-sentence or iverb-sentence or mverb-sentence`,

      `cs2 is consequence simple-sentence
      then subconj
      then condition simple-sentence`,

      `cs1 is subconj 
    then condition simple-sentence 
    then filler 
    then consequence simple-sentence`,

      `a and an are indefarts`,
      `the is a defart`,
      `if and when and while are subconjs`,
      `any and every and all are uniquants`,
      `of and on and to and from are prepositions`,
      `that is a relpron`,
      `it is a pronoun`,


      // domain
      'color is a thing',
      'red and blue and black and green and purple are colors',

      'color of any button is background of style of it',
      'color of any div is background of style of it',
      'text of any button is textContent of it',
]