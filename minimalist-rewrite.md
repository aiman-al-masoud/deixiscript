- check for a match with analytic derivation clauses
- if there is a match, execute the definition, else go on
- expand negations, & other stuff that doesn't require KB
- resolve each noun phrase in a sentence to a list of constants
- produce a new knowledge base (update deictic dict, add new created new entities)
- substitute list of constants into sentence by decompressing

what about a function specifically meant only to ask/tell NounPhrases?

when you actually get to execute the final real defintition, at that point you should resolve all noun phrases to explicit references, and you should not have any implicit reference left. So maybe no need for evaluate() recursive call? maybe? what about math-expression?



Temporarily ignore: defaults, number restriction, mutex concepts, parser, equation solver, noun-phrase complements, adjectives

All "argument passing" (derivation clauses) through deictic dictionary, not match and subst.

Match maybe can return a comparison value (more/less specific, unrelated or identical?) Can match be made "semantic?", ie: matching formulas also based on derivation clauses?


The function match has to match between:
- thing-pointer vs thing-pointer
- is-a-formula vs is-a-formula (probabily, to prevent infinite rec with is-a overloads)
- an ast of any type vs conjunction
- list vs list (later)
- two asts of same type
- two asts of different types based on derivation clauses ???



Functions:
evalArgs/updateDeixis?
definitionOf?
consequencesOf?
compareSpecificities?


Make separate tests for each function, besides more general "evaluate" tests



1. match (definitionOf)
2. if there is a match, "resolve args" and execute where with new deictic dict.
3. else, decompress
4. execute

Ordinality
the thing => the LAST thing 
clear N old entries in deictic dict

### Every reference is implicit

- more importance to deictic dict (determines whether ref to concept or individual)
- articles aren't necessary

- what about the creation of the concept in the WM?

--------------------------------

Experimental idea (for later or never): deictic dictionary could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the verb "jump") causing the pronoun "it" to point to one of them.

Can performance be improved by turning list of derivation clauses into hashmap? Because maybe an ast could be hashed and matched to another with a hash? Maybe not possible because of specificity problem (how do I make sure to hash things the proper way when new more/less specific dervation clauses can be added dynamically).

Could is-a really only be treated in the "derived sense"? Only has-sentences in world model

Random AST generator for fuzz testing?






