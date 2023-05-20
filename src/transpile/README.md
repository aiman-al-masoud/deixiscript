The input is a piece of text composed of sentences separated by dots.

Compile-time translation, rather than runtime interpretation. Just re-compile everything all the time.

# Stages
1. Split text by dots. **(EASY)**
2. Parse each sentence and obtain a list of Deixiscript ASTs. **(EASY)**
3. Construct a World Model of the entities from the Deixiscript ASTs.
4. Validate against Conceptual Model.
4. (??) Generate updated Deixiscript ASTs (??)
5. Translate each Deixiscript AST into one or more Intermediate AST(s).
6. Translate the Intermediate ASTs into runnable JS code. **(EASY)**

# Parsing a Deixiscript sentence

Is done through the configurable parser, which directly produces an AST. It can be configured to parse different "dialects" of Deixiscript.

# Deixiscript AST

An abstract representation of a natural language sentence.

# World Model Construction

Go through each Deixiscript AST, add entities and relationships to World Model.

Example: "Print the second element of the third row of the matrix", should produce a world model that has: a matrix, a third row and a second element, with the relevant relations between those 3 entities.

Anaphora are resolved during this stage, requiring also knowledge from the Conceptual Model, for example when entities are referred to anaphorically by superclass type.

# Validate Against Conceptual Model

Check that the relationships between the entities in the World Model don't conflict with the constraints imposed by the Conceptual Model.

# Generate updated Deixiscript ASTs

Replace anaphoric references with explicit references. Re-sort the instructions in the right order of execution.


# Translation from Deixiscript AST to Intermediate AST

Will require a bit of work.

The same type of Deixiscript AST can map to different types of Intermediate ASTs. Based on:

* context (side effect vs non-side effect)
* context (anaphora, cataphora, deixis)
* ambiguity of the verb "to be" (variable declaration vs property assignment)
* ambiguity of referring to individual thing or to concept.
* ambiguity of universal quantifier, referring to concept or to all individuals.
* ambiguity of articles (refering to new or old entity)
* ambiguity of the natlang parse tree itself (multiple possible parse trees)
* side-effectish sentence with a disjunction (what ORred action should be executed?)
* [and more](./ambiguities.md)

Furthermore, a single Deixiscript AST node may spawn multiple Intermediate AST nodes, due to:

* limited expressivity of JS, eg: lack of universal quantification. (although JS has querySelector for DOM)

# Intermediate AST

Reflects the capabilities and limitations of a typical modern day high level programming language.

## Declarations/Definitions
* Creation of objects/variables
* Definition of functions
* Definition of classes/structs
* Variable Reassignments
* ...
## Property Assignments (has)
* ...
## Function/Method Calls (do-verbs)
* ...
## Loops
* for
* while
## Expressions
* arithmetic
* comparisons
* call to class constructor 
* ...
## Decisions
* if
## Concurrency
* do once then stop
* keep on doing until
* ...
## Blocks
* ...
## Statements
* return
* (all of the other non-expressions)...

# Translation from Intermediate AST to JS

This is the easy part. Still some JS specific things to work out, for example DOM classes in JS cannot be instantiated using the constructor.

