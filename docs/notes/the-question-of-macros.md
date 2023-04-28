# PROBLEM 1 vs PROBLEM 2

## PROBLEM 1

simple-sentence is copula-sentence or verb-sentence

You need to peel off simple-sentence, you only care about copula-sentence or
verb-sentence

Solutions:

1. keep simple-sentence, make it official
2. peel off simple-sentence

## PROBLEM 2

complex-sentence is complex-sentence-one or complex-sentence-two

You need to peel off complex-sentence-one or complex-sentence-two, you only care
about complex-sentence

Solutions:

# variant-number and define variants like so:

simple-sentence 1 is copula-sentence simple-sentence 2 is verb-sentence

complex-sentence 1 is ... complex-sentence 2 is ...

this requires a change in getSyntax() -> getSyntaxes() but it eliminates
KoolParser.simplify

You don't really care about lisp-style macros (to define new semantics), you
care about a generalized morphosyntax with predefined logical ASTs (translation
to dialects, partial parsing?...).


# discard parent, keep child in ast ?

# co-optional sequential members
### can be made with: expand-children-into-parent-in-ast keyword
### exclude-from-ast keyword

noun-phrase ... then (optional owner noun-phrase then "'s") then
... then (optional "of" then owner noun-phrase).

saxon-genitive = owner noun-phrase then not-ast "'s".
of-genitive = not-ast "of" then owner noun-phrase.

noun-phrase = ...
... then optional expand saxon-genitive 
...
... then optional expand of-genitive.

# any-order members
### can ALSO be done with expand+not-ast:

dative = not-ast "to" then receiver noun-phrase
ablative = not-ast "from" then origin noun-phrase
locative = not-ast "at" then location noun-phrase

complement = dative or ablative or locative

verb-sentence is ...
then zero-or-more expand complements
...

