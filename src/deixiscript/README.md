# General Idea

Bring Deixiscript ASTs closer and closer to JS ASTs, through several successive simple AST transformations, until you can translate each Deixiscript AST to at most one JS AST (of multiple possible types).

# AST Transformations

* modifier expansion (context free)
* syntactic decompression (context free)
* conversion of copula sentence to has sentence when needed (context dependent)
* implicit reference resolution (context dependent)
* semantic decompression (context dependent)
* universal quantifier expansion (context dependent)
* sort ASTs by order of execution (context dependent, needs explicit references)

# Stages

1. parse each sentence as a Deixiscript AST
1. go through the AST transformations
1. translate Deixiscript ASTs to JS ASTs (one to one)
1. translate JS ASTs to JS code

# Parsing a Deixiscript Sentence

The input is a piece of text, composed of sentences separated by dots.

Compile-time translation, rather than runtime interpretation. Just re-compile
everything all the time.

Parsing is done through the configurable parser, which directly produces an AST
from a source code string. It can be configured to parse different "dialects" of
Deixiscript.

The parser has a typescript type codegen facility, to automatically generate AST
types for static type checking, or maybe validate new CST definitions against
required AST structures.

There is still no mechanism to solve the problem of syntactic ambiguities in
natural language, ie: multiple parse trees.

# Deixiscript AST

An abstract representation of a natural language sentence.

1. Noun Phrase
1. Copula Sentence
1. Has Sentence
1. Verb Sentence
1. There Is Sentence
1. If Sentence
1. When Sentence
1. And Sentence
1. Or Sentence
1. Comparative Sentence (root + -er, more + root)
1. Past Participle (root + -ed) / analytic past with "did"
1. Superlative (root + -est, -most, most + root)
1. Simple Math Expressions

# Resolve Implicit References

Go through the list of Deixiscript ASTs in order. Whenever you find a noun
phrase, try searching for a corresponding entity in the world model, if you don't
find it then create a new entity and place it in the world model. Produce updated
Deixiscript ASTs with explicit references.

Instructions are also treated as entities, and they are related to program
objects by usage/definition relations.

Requires knowledge from the Conceptual Model:

- when entities are referred to anaphorically by superclass type.
- For derived properties, "the red button" == "the button with red as color".

## Special Cases
* In case of multiple matches in the queue, issue a warning.
* In case of a universally quantified reference?
* In case of a MAYBE universally quantified reference?

# Expand Modifiers

Concerning modifiers in sentences with side effects.

"there is a red button" --> "there is a button AND the button is red."

In sentences without side effects, modifiers are part of implicit references,
which should have been eliminated and replaced by explicit references.

# Copular Sentence Assignments

"the button is red" --> "the button has red as color"

# Sort list of Deixiscript ASTs by order of execution

Re-sort the instructions in the right order of execution, using a topological
sort algorithm.

# Translation from Deixiscript AST to JS AST

[Programmatic Semantics](./semantics.md)

The same type of Deixiscript AST can map to different types of JS ASTs. Based
on:

- ~~context (anaphora, cataphora, deixis) SOLVED IN PREVIOUS STEP~~
- ~~ambiguity of the natlang parse tree itself (multiple possible parse trees) SOLVED IN PREVIOUS STEP.~~
- ~~ambiguity of articles (refering to new or old entity) SOLVED IN PREVIOUS STEP.~~
- ~~ambiguity of the verb "to be" (variable declaration vs property assignment) SOLVED IN PREVIOUS STEP~~
- context (side effect vs non-side effect)
- ambiguity of referring to individual thing vs to concept.
- ambiguity of universal quantifier, referring to concept vs to all individuals.
- side-effectish sentence with a disjunction (what ORred action should be
  executed?)
- [and more](./ambiguities.md)

Furthermore, a single Deixiscript AST node may spawn multiple JS AST nodes, due
to the limited expressivity of JS:

- Lack of universal quantification. (although JS has querySelector for DOM).
  BTW, if entities are created dynamically at runtime, you can't just spawn
  multiple ASTs to edit them all.

- Initialization with head and modifiers treated as: call to constructor and
  then property assigments as two or more separate commands.

# JS AST

Reflects the capabilities and limitations of a typical modern day imperative/OOP
high level programming language.

1. Declarations/Definitions
   1. Creation of objects/variables
   1. Definition of functions
   1. Definition of classes/structs
   1. Variable Reassignments
   1. ...
1. Property Access (has)
   1. property read
   1. property write
1. Function/Method Calls (do-verbs)
   1. ...
1. Loops
   1. for
   1. while
1. Expressions
   1. arithmetic
   1. comparisons
   1. call to class constructor
   1. literals
   1. ...
1. Decisions
   1. if
1. Concurrency
   1. do once then stop
   1. keep on doing until
   1. ...
1. Blocks
   1. ...
1. Statements
   1. return
   1. (all of the other non-expressions)...

# Translation from JS AST to JS

This is the easy part. Still some JS specific things to work out, for example
DOM classes in JS cannot be instantiated using the constructor.
