# Ambiguous Grammars

- no ambiguous sentence recognition and multi-tree parse, but possiblility to
  "disambiguate" (really: change default parse order) using parentheses.


# Support for Synthetic and Agglutinative Grammars

Perhaps as function hooks reaching out to the lexer from a higher level?

# Past Tense

- past tense
  - list of world models = history
  - "anachronistic semantics": set of derivation clauses is unique
  - search all of history in case of unspecified time
  - alter all of history in case of unspecified time


# Context Sensitivity

- context sentitivity is incomplete
  - the does eat the fish.
  - it jumps. ---> "it" resolves to "the fish" :'-)

But there is the potential to improve it: by managing the deictic dictionary, which could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the applicability of the verb "jump") causing the pronoun "it" to point to one of them (cats can jump, fish usually can't).

# Cataphora and full Deixis?


# Maybe Implementable on time:

Temporarily ignore: synthetic derivations, ordinals (first, second etc...), defaults (maybe as synthetic clauses, beware default creation loops), number restriction, mutex concepts, equation solver, noun-phrase complements, adjectives. You can use KB.dd for expression transformation history.
