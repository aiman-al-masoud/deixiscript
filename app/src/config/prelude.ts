export const prelude: string[] = [

      // grammar
      'quantifier is uniquant or existquant',
      'article is indefart or defart',
      'complement is preposition then noun phrase',

      `copula sentence is subject noun phrase 
        then copula 
        then optional negation 
        then predicate noun phrase`,

      `noun phrase is optional quantifier 
        then optional article 
        then zero  or  more adjectives 
        then optional subject noun or pronoun or mverb 
        then optional subclause 
        then zero or more complements `,

      'copulasubclause is relpron then copula then noun phrase',
      'subclause is copulasubclause',

      `and sentence is left copula sentence or noun phrase 
        then nonsubconj
        then one or more right and sentence or copula sentence or noun phrase`,

      `mverb sentence is subject noun phrase 
		then optional hverb
		then optional negation
		then mverb
		then object noun phrase`, // TODO complements

      `iverb sentence is subject noun phrase 
		then optional hverb
		then optional negation
		then iverb`, // TODO complements

      // `simple sentence is copula sentence or iverb sentence or mverb sentence`,

      // `cs2 is consequence simple sentence
      // then subconj
      // then condition simple sentence`,

      // `complex sentence is cs2`,

      // domain
      'color is a concept',
      'red and blue and black and green are colors',
      'color of any element is background of style of it',
      'text of any button is textContent of it',
]