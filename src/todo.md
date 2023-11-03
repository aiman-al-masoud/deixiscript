# How to fill up "which-gaps" when parsing?
- use of transitive vs intransitive verb distinction in ST post-processing?
- use of (ugly) explicit gap
- use of special pronoun (unnatural in English)

# Distinction between head and modifiers in search?
cat which is red != red which is cat
this to allow Implicit to resolve to concept by default (if no individual is found).
be sentences should sometimes not take concepts in the "object" position

# Use brython to package the interpreter for the web
https://brython.info/static_tutorial/en/index.html

# Conceptual mode?
maybe "conceptual" and "individual" modes/contexts that can be triggered with some conventional command for testing.

# Fuzz testing
Random AST generator for fuzz testing?

# Syntax Sugar
- adjectives as relative clauses with verb to be or similar
- complements on nounphrases analogously

# Property/Structural/Non-nominal Uniquess for everything
- maybe: no entity can exist unless it is at least somewhat distinct from another already exisiting entity, and ID is not enough for the distinction
	Benefits
	- remove Negation(NounPhrase) special case 
	- remove Command(SimpleSentence) special case

---------------------
Note to self: a question may create a whole new entity (thus having side effects even on the WM). Actually no, right now a generic simple sentence is converted to an event first (a "nounphrase") so none of its constituents are created if it is not (the whole thing) a command.

Method match is purely structural, no access to KB, doesn't call execute.