Can evaluate be called recursively as long as you still have a separate "normalize" function that produces an AST in normalized form that can be called before actually executing an AST at the "top-top level of the program"? Would benefit matchAst()

convert any Ast (except for derivation clauses) to world model stuff?
A specific function just to do that, so as to simplify the implementation of Command(Negate), and to avoid having to manage additions/eliminations. The tell() function has already basically almost the same purpose.

- verb sentence may be the only kind of AST that may need decompression, but it is not the only overridable AST (nouns for pronouns, other nounphrases for "funcs')

# CONVERTING AN AST TO BASE FORM / NORMALIZATION / BASIC SUBSET
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

--------------------------------

Experimental idea (for later or never): deictic dictionary could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the verb "jump") causing the pronoun "it" to point to one of them.

Random AST generator for fuzz testing?