export const startupCommands: string[] = [

    // grammar
    'quantifier is uniquant or existquant',
    'article is indefart or defart',
    'complement is preposition then noun phrase',
    'copula sentence is subject noun phrase then copula then optional negation then predicate noun phrase',
    'noun phrase is optional quantifier then optional article then zero  or  more adjectives then optional noun or pronoun then optional subclause then zero or more complements ',
    'copulasubclause is relpron then copula then noun phrase',
    'subclause is copulasubclause',

    // domain
    'color is a concept',
    'red and blue and black and green are colors',
    'color of any button is background of style of button',
    'text of any button is textContent of button',
]