Note to self: a question may create a whole new entity (thus having side effects even on the WM)

How to fill up "which-gaps" when parsing?
- use of transitive vs intransitive verb distinction in ST post-processing?
- use of (ugly) explicit gap
- use of special pronoun (unnatural in English)

Maybe distinction between head and modifiers in search?
cat which is red != red which is cat

Implicit->Thing
SimpleSentence->Proposition???
Explicit->Atom

define:
	- Implicit: just search for definition and apply first matching
	- SimpleSentence: define sub-elements, make copy of SimpleSentence, define (like in Implicit) copy
	

- match is purely structural, no access to KB, doesn't call execute.
- Asts need to be "broken down/contextualized" before using match.
- expand nouns using which (context dependent), match nouns syntactically (context independent).

be sentences may sometimes not take individuals in the "object" position

expand noun, context dependent operation, expand to which, then you can match syntactically without need for context.

Convention where concepts are stored in the WM, but their names don't include any pound signs, whereas every individual-id does.

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


if you remove concepts from default search return, isMatch() needs "recursive Command" interpretation 

Remove Result#head in favor of using deicitc dict to get head? Remove Result in favor of only KnowledgeBase?
