Compile-time translation, rather than runtime interpretation. Just re-compile everything all the time.

* Mind: associate AST templates to *meaning* (program code templates)
* Long Term Memory: recognize and process World Model information
* Short Term Memory: resolve anaphora and contextual references.

The compiler takes a bunch of sentences, it splits them by dot, and parses each one of them. You get a list of ASTs.

A World Model is generated from the ASTs and validated against the Conceptual Model.

The World Model together with each AST, is used to generate standalone javascript code. One full JS statement per AST (in general, but not always).

* Mind, Long Term Memory ~ AST processing, Conceptual Model
* Short Term Memory ~ World Model

Derived Properties may also be part of the Conceptual Model.

# AST Patterns
* if-sentence --> if-statement
* (non copula) verb sentence could be modelled as method invocation (open to specification by further instructions)
* 

# Conceptual Model Entities
* concept
* individual
* drawable
* input-field
* text-field
* button
* change-event
* key-press-event
* text-content
* color
* mouse-click-event
* image
* location
* time
* event
* width
* length
* sound
* key

# Derived Props
* happenBefore, happenAfter for naturalistic control flow



# Intermediate AST

The deixiscript AST can be transformed into an intermediate AST (perhaps with the help of the Conceptual and World Models) which in turn can be translated into a JS AST which in turn can be translated into JS code.

"we navigate all the data definitions present in the source code and, for each of them, we create a global variable in the intermediate AST"

To simplify things, we could treat the intermediate AST as the JS AST and generalize later if needed.

The AST will represent the capabilities of a typical modern day high level programming language.

## Declarations/Definitions
* Creation of objects/variables
* Creation of functions
* Creation of classes/types
* ...
## Assignments (has)
* ...
## Function/Method Calls (do-verbs)
* ...
## Repeated Actions
* for loops
* while loops
* threads
## Expressions
* arithmetic
* comparisons
* ...
## Decisions
* if ...


# Translation from Deixiscript AST to Intermediate AST

Will require a bit of work.

The same type of Deixiscript AST can map to different types of Intermediate ASTs. Based on:

* context (side effect vs non-side effect)
* context (anaphora, cataphora, deixis)
* ambiguity of the verb "to be" (variable declaration vs property assignment)
* ambiguity of articles (refering to single thing or class of things)
* ambiguity of articles (refering to new or old entity)
* ambiguity of the natlang parse tree itself (multiple possible parse trees)
* side-effectish sentence with a disjunction (what action should be executed?)


Furthermore, a single Deixiscript AST node may spawn multiple Intermediate AST nodes, due to:

* limited expressivity of JS, eg: lack of universal quantification. (although JS has querySelector for DOM)


# Translation from Intermediate AST to JS

This is the easy part. Still some JS specific things to work out, for example DOM classes in JS cannot be instantiated using the constructor.

