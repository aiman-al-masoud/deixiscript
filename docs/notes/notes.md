# Naturalistic iterators

- The next 2 instructions repeat while x < 10.
- x increments.
- console logs x.

As well as:

- x increments.
- console logs x.
- The previous 2 instructions repeat while x < 10.

# https://stackoverflow.com/questions/9163341/multiple-inheritance-prototypes-in-javascript

# https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

# Negation

Negation as undoing any particular action, requires general solution when no ad
hoc solution is available. At any edit action A1 on an object X, a new copy is
made of X and is kept up to date, except for what happened at A1. When "A1 is
negated" the copy is retrieved and it "replaces" (how?) the current object X.

# number literals

# Context Dependent/Relative Predicates

First/Last & Biggest/Smallest & Left/Right

- the first button ----> button with smallest ID
- the last button -----> button with largest ID
- the third button -----> button with third ID

# Possessive Adjectives: x is a button and **its** color is red.

# All kinds of Subordinate Clauses

# Phatic words, fillers and partial parsing ("uhm", "errm", "ah", "oh", "please"...)

# Morphology: support languages that are more synthetic than English.

# Case Insensitivity

https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively

# Adjective as Noun BUG

"x and y are buttons. color of x is yellow. y is red. yellow button."

Returns two asts, and highlights both buttons. Reason being that 'yellow' wasn't
declared as an adjective, and is a noun by default. Fixed by allowing for zero
or more nouns in a noun-phrase.

# Events: onclick of button triggers addtion of "click" verb predicate to button's own predicates list for some milliseconds (and then removal) so that when's setInterval can pick up on the click event. More generally, when invoking any method (BaseWrapper.call()) you may tmp add predicate (with specific args, how to?) NEW PROBLEM: now relation is getting saved permanently in BaseWrapper.relations Maybe ephemeral vs permanent relations (verbs)?

# [Expression Orientation](./expression-orientation.md)

# two versions of each verb, one with side effects and one without? or remember verb application and "disapplication"? Or just overload and make the system "understand" whether it's the overload with or without side-effects ???? THREE versions: do, undo and check.

# copy has to be overridden in each BaseThing subclass!

# Thing.equals() only logical equality / "structural equality"

# copula sentence negation and copula sentence inheritance

# 3 nested (ownership) objects break everything!

# re-think Lexemes and "var names", reassignment clashes with inheritance, consider using indefart for disambiguation

# complements on copula sentence as well "x is of y"

# math expressions

# number adjectives on noun phrases

# how to define functions?

have is the next n instructions have is the next instructions the scope is have
the scope is back

# string (and any atom) should be counted as a nounphrase

# macros should also accept "raw strings" not just lexeme classes

letter is "a" or "b" or "c" ... digit is "1" or "2" or "3" ... fullstop is "."
quote is '"' character is letter or digit or fullstop or quote identifier is
one-or-more letters then zero-or-more digits. number is one-or-more digits.
string is quote then zero-or-more characters except quote then quote

cool idea, but currently hard to implement because tokens also have cardinality
and may have referents.

# DO THIS

increment is the next instructions. the value of the subject is itself + the
by-complement. increment ends.

x is 1. x increments by 2.

---

increment: the value of the subject is itself + the by-complement. end.

x is 1. x increments by 2.

increment starts. the value of the subject is itself + the by-complement.
increment ends.

a house has a string address and a sold boolean.

sell starts. sold of the subject is true. if for-complement is > 100000 then
console logs "hey!". sell ends.

x is a house. x sells for 100001.

a house has a string address and a sold boolean.

sell { sold of the subject is true. if for-complement is > 100000 then console
logs "whoah!". }

x is a house. x sells for 100001.

~sell { sold of the subject is false. }

interrogative sell { sell returns sold of house. }


# grammar

work on a framework to define complement-related syntax/morphology across different languages using a basic set of "'case' markers" that can be used to extract info back from the parsed AST independently of syntax.

# grammatical cases
* nominativo ---> subject
* accusativo/oggetto ---> object
* genitivo (of, saxon-s) ---> owner
* dativo (to) ---> receiver
* ablativo (from) ---> origin
* stato-in-luogo (in/on/at) ---> location
* strumentale (by) ---> means
* compagnia (with) ---> companion

... w/ corresponding prepositions or case markings.

