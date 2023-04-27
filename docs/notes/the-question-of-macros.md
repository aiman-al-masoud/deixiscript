# PROBLEM 1 vs PROBLEM 2

## PROBLEM 1
simple-sentence is copula-sentence or verb-sentence 

You need to peel off simple-sentence, you only care about copula-sentence or verb-sentence 

Solutions:
1. keep simple-sentence, make it official
2. peel off simple-sentence

## PROBLEM 2
complex-sentence is complex-sentence-one or complex-sentence-two

You need to peel off complex-sentence-one or complex-sentence-two, you only care about complex-sentence

Solutions:
1. add variant-number and define variants like so:

simple-sentence 1 is copula-sentence
simple-sentence 2 is verb-sentence

complex-sentence 1 is ...
complex-sentence 2 is ...

this requires a change in getSyntax() -> getSyntaxes() but it eliminates KoolParser.simplify

You don't really care about lisp-style macros (to define new semantics), you care about a generalized morphosyntax with predefined logical ASTs (translation to dialects, partial parsing?...).

