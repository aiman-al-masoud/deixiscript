# Naturalistic iterators

- The next 2 instructions repeat while x < 10.
- x increments.
- you log x.

As well as:

- x increments.
- you log x.
- The previous 2 instructions repeat while x < 10.

# https://stackoverflow.com/questions/9163341/multiple-inheritance-prototypes-in-javascript

# https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

# Negation

Negation as undoing any particular action, requires general solution when no ad
hoc solution is available. At any edit action A1 on an object X, a new copy is
made of X and is kept up to date, except for what happened at A1. When "A1 is
negated" the copy is retrieved and it "replaces" (how?) the current object X.

# Context Dependent/Relative Predicates

First/Last & Biggest/Smallest & Left/Right

- the first button ----> button with smallest ID
- the last button -----> button with largest ID
- the third button -----> button with third ID

# Possessive Adjectives: x is a button and **its** color is red.

# All kinds of Subordinate Clauses

# Phatic words, fillers and partial parsing ("uhm", "errm", "ah", "oh", "please"...)

# Case Insensitivity

https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively

# Events: onclick of button triggers addtion of "click" verb predicate to button's own predicates list for some milliseconds (and then removal) so that when's setInterval can pick up on the click event. More generally, when invoking any method (BaseWrapper.call()) you may tmp add predicate (with specific args, how to?) NEW PROBLEM: now relation is getting saved permanently in BaseWrapper.relations Maybe ephemeral vs permanent relations (verbs), duration property of verb/event?

# Three versions of each verb: do, undo and check. (Can infer side effects?)

# copy has to be overridden in each BaseThing subclass!

# Thing.equals() only logical equality / "structural equality"

# copula sentence negation and copula sentence inheritance

# 3 nested (ownership) objects break everything!

# some lexemes have to be "instrinsic" and some "extrinsic" relative to things.

# macros should also accept "raw strings" not just lexeme classes

cool idea, but currently hard to implement because tokens also have cardinality
and may have referents.

# DO THIS

a house has "xxx" as address and false as sold.

sold of the subject is true. if for-complement is > 100000 then you log
"expensive!". sell is the previous "2" instructions. x is a house. x sells
for 100001.

~sell { sold of the subject is false. } ?sell { you return sold of house. }

# single noun vs adjectives problem, make noun usable as adjective.

# redefining verbs: problem if you put "or verb" in np def because it recognz verb sentences as nps!!!!

# In any function, for every instruction, before running it, check if any instruction wants to run before. Put the whole program in a main function automatically.

# grammar

AST vs CST, unify morphology + syntax = morphosyntax

https://en.wikipedia.org/wiki/List_of_grammatical_cases

maybe make "for" dative.

# Add location complement to log verb for debugging

# remove anys from:

- evalAst
- KoolParser
- AstNode

# re-think Lexemes and "var names", reassignment clashes with inheritance, consider using indefart for disambiguation

- [Lexemes](./the-question-of-lexemes.md)

- [Macros](./the-question-of-macros.md)

# [Expression Orientation](./expression-orientation.md)

# [2023-04-29.md](./2023-04-29.md)