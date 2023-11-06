# How to fill up "which-gaps" when parsing?
- use of transitive vs intransitive verb distinction in ST post-processing?
- use of (ugly) explicit gap
- use of special pronoun (unnatural in English)

# Use brython to package the interpreter for the web
https://brython.info/static_tutorial/en/index.html

# Fuzz testing
Random AST generator for fuzz testing?

# Property/Structural/Non-nominal Uniquess for everything
- maybe: no entity can exist unless it is at least somewhat distinct from another already exisiting entity, and ID is not enough for the distinction
	Benefits
	- remove Negation(NounPhrase) special case 
	- remove Command(SimpleSentence) special case
	
# Ordinality
Currently only supports first/last, and limit DD

# I/O Example with stdin and stdout buffers
- the standard output is "ciao mondo"
- do print the string when the standard output is the string
- do print "ciao mondo"

# Simplify
Since define is called recursively once and for all, you may be able to avoid calling eval() from some of the other functions or maybe even call define at the top-level outside of eval

---------------------
Note to self: a question may create a whole new entity (thus having side effects even on the WM). Actually no, right now a generic simple sentence is converted to an event first (a "nounphrase") so none of its constituents are created if it is not (the whole thing) a command.

Method match is purely structural, no access to KB, doesn't call execute.