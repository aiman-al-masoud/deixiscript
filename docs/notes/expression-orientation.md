Can you force logical clauses to behave like espressions? (composable AND return a value) And also some clauses should represent fixed values and take no arguments.

toClause() is the most suitable place to do this

y is 2 plus the first number 
((y) is ((2) plus (the first number)))

noun phrases could "resolve to variables"

the button is red

((the button) is (red))

the red button appendChilds y

((the red button) appendChilds (y))

((the red button) appendChilds (y and z))

resolve (the red button) to one or more vars
resolve y and z to two or more vars
apply appendChilds from each subject to each object

((x) is (red)) 
((x) is (a button)). 
((y) is (a green button)).


((the color of (the button)) is (red))

resolve (the color of (the button))
resolve (red)
apply rhs to lhs


(if ((x) is (red)) then ((y) is (a blue button)))


resolve condition
if condition is not empty run the consequence


# Plan:

* make branch (DONE)
* tmp eliminate CreateLexemeClause, putting lexemes in lexemes.ts (DONE)
* tmp eliminate SetAliasAction & its usage in prelude (DONE)
* eliminate Actions & Actuator (DONE)
* in BasicBrain, toClause() is called with ast and context as args (DONE)
* in toClause() tmp eliminate every transformation step except for resolveAnaphora(result) if need be.
* put resolveAnaphora() within each eval MRF (mutually recursive function)
* computation (yes, potentially with side effects!) performed within each MRF
* an MRF can produce side effects AND/OR resolve to a value (list of maps or whatever)!
* toClause() effectively becomes a sort of eval() as in traditional interpreters, but supercharged with anaphora!

eval() needs to return Map[] instead of Clause

returning Map[] is ok for theme part, but currently not ok for rheme part, partly because Thing.set() requires Lexeme as predicate.

in a traditional programming language, the RHS is always defined, so some Clauses should be able to resolve to a Thing value, or list of {[id:Id] : Thing} with newly created Thing perhaps.
