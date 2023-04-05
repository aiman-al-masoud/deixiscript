# Actions/Clauses as Objects (Reflection)

# Naturalistic iterators

- The next 2 actions repeat while x < 10.
- x increments.
- console logs x.

As well as:

- x increments.
- console logs x.
- The previous 2 actions repeat while x < 10.

# Verb (method) definition

with [actions as objects](#actions-as-objects), eg:

- The next 3 actions are blink of a button.
- the button is red.
- the button is green.
- the button is red.


# Every Lexeme must have a referent (Thing), maybe also Lexeme is a Thing

# Lexeme order of operands, for lexmes with same meaning (of, own, have) but different order of operands (x of y === y owns x).

# https://stackoverflow.com/questions/9163341/multiple-inheritance-prototypes-in-javascript

# https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

# Negation

Negation as undoing any particular action, requires general solution when no ad
hoc solution is available. At any edit action A1 on an object X, a new copy is made of X and is kept up to date, except for what happened at A1. When "A1 is negated" the copy is retrieved and it "replaces" (how?) the current object X.

# x is hidden === x hides

# x appendChilds y === y is on x === position of y is x

# Eager lexer lexes everything before new grammar pieces start getting added as lexemes, so you cannot run one single string as startup command, because eager lexer has it all lexed at the beginning. Bad heuristic in dynamicLexeme() is an obstacle to change!
# string literals
# number literals

# Context Dependent/Relative Predicates

First/Last & Biggest/Smallest & Left/Right

- the first button ----> button with smallest ID
- the last button -----> button with largest ID
- the third button -----> button with third ID

# Possessive Adjectives: x is a button and **its** color is red.

# Plurals

'buttons are red' = 'every button is red' = 'button(X) -> red(X)'

Problem with 'and sentences': 'x and y and z are colors' Temporary Solution: in toClause(), don't call makeImply() if current ast is and sentence. Plurals work.

It would be great if (x and y and z) would just behave like a noun phrase... BUT
this is a problem for and-sentence: 'x is a button and it is red' if noun-phrase
contains 'and then noun-phrase' because left copula sentence gets parsed but
within it there is the 'and it' and-phrase!

# All kinds of Subordinate Clauses

# Low Level JS Access: add of any number is "a=>this+a"

# Phatic words, fillers and partial parsing ("uhm", "errm", "ah", "oh", "please"...)

# Morphology: support languages that are more synthetic than English.

# Case Insensitivity

https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively

# Identity and Equivalence and Assignments: if x is 1 ...

# and between simple clauses is kind of broken

# Adjective as Noun BUG

"x and y are buttons. color of x is yellow. y is red. yellow button."

Returns two asts, and highlights both buttons. Reason being that 'yellow' wasn't
declared as an adjective, and is a noun by default. Fixed by allowing for zero or more nouns in a noun-phrase.

# New Inheritance Model: A Thing can have multiple prototypes. Ok methods, what about state?

# Events: onclick of button triggers addtion of "click" verb predicate to button's own predicates list for some milliseconds (and then removal) so that when's setInterval can pick up on the click event. More generally, when invoking any method (BaseWrapper.call()) you may tmp add predicate (with specific args, how to?) NEW PROBLEM: now relation is getting saved permanently in BaseWrapper.relations Maybe ephemeral vs permanent relations (verbs)?

# copy: not copying heirlooms. YOU STILL NEED TO FIND A BETTER INHERITANCE SYSTEM!

# Turn Enviro into a Wrapper

# Less Actions, kill CreateLexemeAction.


# Thing should know the least possible about Lexemes

# [Expression Orientation](./expression-orientation.md)

# background of style of a button is a color
