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

// co-optional sequential members

  makro 
    noun-phrase is 
    optional uniquant
    then optional existquant
    then optional indefart
    then optional defart
    then (optional owner noun-phrase then "'s")
    then zero-or-more adjectives
    then optional limit-phrase 
    then subject noun or pronoun or string or number-literal
    then optional math-expression
    then optional subordinate-clause
    then (optional "of" then owner noun-phrase)
    then optional and-phrase
  end.


// any-order members

  makro 
    verb-sentence is 
    optional subject noun-phrase 
    then optional hverb 
    then optional negation 
    then verb 
    then optional object noun-phrase
    then optional any-order "to" receiver noun-phrase
    		            "from" origin noun-phrase
    		            "with" instrument noun-phrase
    		            "at" location noun-phrase    		            
  end.
