The input is a piece of text composed of sentences separated by dots.

Compile-time translation, rather than runtime interpretation. Just re-compile
everything all the time.

# Stages

1. Split text by dots. **(EASY)**
2. Parse each sentence and obtain a list of Deixiscript ASTs. **(EASY)**
3. Resolve implicit references, generate unique ids for entities. Possible user
   involvement.
4. Construct a World Model of the entities, including instructions.
5. Validate against Conceptual Model.
6. Sort instructions by order of execution.
7. Generate updated Deixiscript ASTs
8. Translate each Deixiscript AST into one or more Intermediate AST(s).
9. Translate the Intermediate ASTs into runnable JS code. **(EASY)**

# Parsing a Deixiscript Sentence

Is done through the configurable parser, which directly produces an AST from a
source code string. It can be configured to parse different "dialects" of
Deixiscript. The parser has a typescript type codegen facility, to automatically
generate AST types for static type checking, or maybe validate new CST
definitions against required AST structures.

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
1. Past Participle (root + -ed) / analytic past with "did"
1. Comparative (root + -er, more + root)
1. Superlative (root + -est, -most, most + root)
1. Simple Math Expressions


# Resolve Implicit References

Go through the list of Deixiscript ASTs in order. Whenever you find a noun
phrase, try searching for a corresponding entity in the "queue", if you don't
find it then create a new entity and place it in the "queue". Produce updated
Deixiscript ASTs with explicit references.

Requires knowledge from the Conceptual Model:

- when entities are referred to anaphorically by superclass type.
- For derived properties, "the red button" == "the button with red as color".

In case of multiple matches in the queue, issue a warning.

In case of a universally quantified reference?

In case of a MAYBE universally quantified reference?

# World Model Construction

Go through each updated Deixiscript AST, add entities and relationships to World
Model.

Example: "Print the second element of the third row of the matrix", should
produce a world model that has: a matrix, a third row and a second element, with
the relevant relations between those 3 entities.

Instructions are also treated as entities, and they are related to program
objects by usage/definition relations.

# Validate Against Conceptual Model

Check that the relationships between the entities in the World Model don't
conflict with the constraints imposed by the Conceptual Model.

# Sort list of Deixiscript ASTs by order of execution

Re-sort the instructions in the right order of execution, using a topological
sort algorithm.

# Translation from Deixiscript AST to Intermediate AST

[Semantics](./semantics.md)

The same type of Deixiscript AST can map to different types of Intermediate
ASTs. Based on:

- context (anaphora, cataphora, deixis) SOLVED IN PREVIOUS STEP
- ambiguity of the natlang parse tree itself (multiple possible parse trees) SOLVED IN PREVIOUS STEP.
- ambiguity of articles (refering to new or old entity) SOLVED IN PREVIOUS STEP.
- context (side effect vs non-side effect)
- ambiguity of the verb "to be" (variable declaration vs property assignment)
- ambiguity of referring to individual thing or to concept.
- ambiguity of universal quantifier, referring to concept or to all individuals.
- side-effectish sentence with a disjunction (what ORred action should be
  executed?)
- [and more](./ambiguities.md)

Furthermore, a single Deixiscript AST node may spawn multiple Intermediate AST
nodes, due to the limited expressivity of JS:

- Lack of universal quantification. (although JS has querySelector for DOM).
  BTW, if entities are created dynamically at runtime, you can't just spawn
  multiple ASTs to edit them all.

- Initialization with head and modifiers treated as: call to constructor and
  then property assigments as two or more separate commands.

# Intermediate AST

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

# Translation from Intermediate AST to JS

This is the easy part. Still some JS specific things to work out, for example
DOM classes in JS cannot be instantiated using the constructor.
