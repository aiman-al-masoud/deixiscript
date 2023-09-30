Use brython to package the interpreter for the web
https://brython.info/static_tutorial/en/index.html

Some and Every as values of cardinality in Numerality? Do NOT just assume that tuple means 'AND'?

Default connective when using implicit is 'OR'? Because that will match more stuff more easily. Eg: "man ride horse" -> concept of man rides concept of horse, or individual man rides etc...

All "argument passing" (derivation clauses) through deictic dictionary, not match and subst.

Normalized:
- no implicit references, only explicit
- everything is decompressed
- verb sentences don't cotain negations or commands

maybe "conceptual" and "individual" modes/contexts that can be triggered with some conventional command for testing.

Random AST generator for fuzz testing?

- test semantic/idiomatic match()

## Problems

- less than greater than as vague commands (tell)


- derivations should "eschew commands"


----------------------


ADVANTAGES OF NOT TREATING CONCEPTS LIKE INDIVIDUALS??

- isMatch() problem: an id should't exist if it's not in the WM, whereas concept should always exist. Problem isMatch(the('cat').e, 'cat#1', kb1) But this may provoke other problems??

- stallion/horse isMatch() problem:
	checking for isMatch() with:
	
	gen=the man rides the stallion
	spec=the man rides the horse
	kb=stallion is a horse

	should yield false but instead it yields true
	
	because spec has the effect of man concept rides on stallion (which is a horse) concept

- maybe: no entity can exist unless it is at least somewhat distinct from another already exisiting entity, and ID is not enough for the distinction
	Benefits
	- remove Negation(NounPhrase) special case 
	- remove Command(SimpleSentence) special case

