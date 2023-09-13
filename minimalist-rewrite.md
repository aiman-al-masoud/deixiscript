convert any Ast (except for derivation clauses) to world model stuff?
A specific function just to do that, so as to simplify the implementation of Command(Negate), and to avoid having to manage additions/eliminations. The tell() function has already basically almost the same purpose.

- verb sentence may be the only kind of AST that may need decompression, but it is not the only overridable AST (nouns for pronouns, other nounphrases for "funcs')

- check for a match with analytic derivation clauses
- if there is a match, execute the definition, else go on
- expand negations, & other stuff that doesn't require KB
- resolve each INP (implicit noun phrase) into a list of constants
- substitute INPs with lists of constants by decompressing
- produce a new knowledge base (update deictic dict, add new created new entities)

what about a function specifically meant only to ask/tell NounPhrases?

when you actually get to execute the final real defintition, at that point you should resolve all noun phrases to explicit references, and you should not have any implicit reference left. So maybe no need for evaluate() recursive call? maybe? what about math-expression?

Temporarily ignore: defaults, number restriction, mutex concepts, parser, equation solver, noun-phrase complements, adjectives

All "argument passing" (derivation clauses) through deictic dictionary, not match and subst.

Match maybe can return a comparison value (more/less specific, unrelated or identical?) Can match be made "semantic?", ie: matching formulas also based on derivation clauses?


### Every reference is implicit

- more importance to deictic dict (determines whether ref to concept or individual)
- articles aren't necessary

- what about the creation of the concept in the WM?

--------------------------------

Experimental idea (for later or never): deictic dictionary could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the verb "jump") causing the pronoun "it" to point to one of them.

Can performance be improved by turning list of derivation clauses into hashmap? Because maybe an ast could be hashed and matched to another with a hash? Maybe not possible because of specificity problem (how do I make sure to hash things the proper way when new more/less specific dervation clauses can be added dynamically).

Could is-a really only be treated in the "derived sense"? Only has-sentences in world model

Random AST generator for fuzz testing?
