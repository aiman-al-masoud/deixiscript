= Deixiscript

== Code Organization

The language of the code is Python (specifically version 3.10), annotated with type-hints and type checked by the Pyright static type checker.

Tests are performed with the Pytest framework.

The code follows the Interpreter Pattern with immutable classes.

The English subset will be interpreted rather than compiled.

The core components of the interpreter will require no dependecies besides Python's (included) standard library.

Lark will be used as a parsing library.

The code will be available under GPLv3 for inspection and future research.

- Functions tell() and ask() do NOT have ANY side effects (like most other
  functions). tell() and ask() both return a brand new knowledge base object,
  because even ask() may produce updated versions of the deictic dictionary and
  add newly computed numbers to the world model. Pure functions and immutable
  data structs whenever possible.

What follows is an overview of packages and modules. TODO.

- core
- parser
- main




== Future Work

=== Ambiguous Grammars

- no ambiguous sentence recognition and multi-tree parse, but possiblility to
  "disambiguate" (really: change default parse order) using parentheses.


=== Support for Synthetic and Agglutinative Grammars

Perhaps as function hooks reaching out to the lexer from a higher level?

=== Past Tense

- past tense
  - list of world models = history
  - "anachronistic semantics": set of derivation clauses is unique
  - search all of history in case of unspecified time
  - alter all of history in case of unspecified time

Alternative idea to "list of world models = history" => events can have associated times.

=== Context Sensitivity

- context sentitivity is incomplete
  - the does eat the fish.
  - it jumps. ---> "it" resolves to "the fish" :'-)

But there is the potential to improve it: by managing the deictic dictionary, which could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the applicability of the verb "jump") causing the pronoun "it" to point to one of them (cats can jump, fish usually can't).

=== Cataphora and full Deixis?

=== Maybe Implementable on time

Temporarily ignore: synthetic derivations, ordinals (first, second etc...), defaults (maybe as synthetic clauses, beware default creation loops), number restriction, mutex concepts, equation solver, noun-phrase complements, adjectives. You can use KB.dd for expression transformation history.


// = Metaphysics

// - At the most basic level there is: the Graph, the derivations and the DD. The Graph is the "interface" through which Deixiscript communicates with the outer world, including JS, which only uderstands has-as properties.

// world model as the interface to the outer world

// = Deixis

// - Implicit references work as if any entity got the current timestamp whenever
//   it was mentioned. When function ask() is called from findAll() the deictic
//   dict is NOT updated, because the results from ask() are ignored.

// = Syntactic Compression