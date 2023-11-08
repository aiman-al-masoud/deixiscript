= Deixiscript

== Internal and External Dependencies

The language of the code is Python 3 (specifically version 3.10), annotated with type-hints and type checked by the Pyright static type checker. Unit tests are performed with the help of the Pytest testing framework. The Lark parsing toolkit for Python is used for the front end of the interpreter: to turn the strings of source code into parse trees and to further apply some transformations and obtain Abstract Syntax Trees (ASTs), which the interpreter can process. The Graphviz graph visualization software and relative Python wrapper are used as a testing tool, to visually inspect the knowledge graphs produced as a side effect of the interpreter's operation. All of this software is available for free and under the terms of an open source license (MIT for Pyright, Pytest and Lark, CPL for Graphviz).

Other than the aforementioned ones, the core components of the system will require no further dependencies beyond Python's own standard library. The present work itself is free software, and will be made available under the terms of the GPLv3 license by the time this document is published.

We welcome any further inspection and scrutiny of the code by anyone who is interested in developing it further, as we hope this will aid in improving the code's quality and conciseness, other than expanding its functionality. Regarding the latter, some of the possible further developments that we forsee are outlined later in this section.

== Code Organization: high level overview

The code is split into four modules: "core", "main", "parse" and "plot". The module "main" houses the program's main entry point. The module "plot" defines a few utility functions to visualize graphs. The module "parse" defines the language's concrete grammar(s). And the module "core" contains the core logic of the interpreter, which is independent of the rest of the code. Every module also contains a "tests.py" file which includes some unit tests that also serve to showcase the module's functionalities.

Regarding the code's style, an effort was made to follow the Functional Paradigm's approach of data-immutability and function (or method) purity whenever feasible (especially in the "core" module); the advantage being that of uniform semantics in the business-logic: methods never directly modify an object, they rather return a new copy of it if need be; reducing the chances of a harmful/unforeseen side-effect (change of state in an object) flying under the radar.

The code inside of the "core" module follows the Interpreter Pattern, one of the well-known 23 GoF Patterns for OOP languages. Alternative approaches were tried, but the advantage offered by the polymorphic overriding of methods in the classes representing the AST types was too great, and no alternative facilities were offered by the Python language, as function overloading is tedious and must be done by hand. The Interpreter Pattern allows for greater flexibility in adding new AST types to the language, and in specializing the behavior of existing ones; and it does so by defining a common interface (usually at least an "eval" method) on every class representing an AST type. The classes representing the AST types are usually subdivided in "leaf" types and "composite" types, the former representing atomic entities (or constants) such as strings and numbers, and the latter representing anything else: from the simplest of boolean expressions to the messiest of function definitions. The common interface ensures that each of these ASTs can be evaluated the same way: by calling its "eval" method and passing it the current operating context (also known as "environment", or "state"). The "eval" method is expected to return the result of the evaluation; in our case it returns a whole new updated context, without changing the original, in accordance with the general functional style of the codebase.

== Core

The classes in the "core" module represent AST types, except for the classes EB (which stands for "Expression Builder") and KB (which stands for "Knowledge Base"). 

=== Expression Builder

The Expression Builder is a utility class that helps to build language expressions (phrases and sentences) from the AST classes without interacting directly with the latter. It makes use of the Builder GoF pattern, and adopts the Fluent Interface style: a way of designing Object Oriented Application Programming Interfaces (APIs), whose goal is to increase code readability by emulating a Domain Specific Language (DSL) through the usage of method chaining and informative method names. In practice it is useful to test the core logic of the language independently of the parser.

=== Knowledge Base

This is the equivalent of the context/environment of the Interpreter Pattern. It holds all of the state at any point during the execution of the program, which mainly consists of three kinds of information: the World Model (or Knowledge Graph), the Deictic Dictionary and the list of Defs and Laws.

== Core Grammar

The abstract syntax of a language is distinct from its concrete syntax. 

The concrete syntax consists in a set of production rules that describe a Context Free Grammar (CFG) and are captured by meta-languages such as the Extended Backus-Naur Form (EBNF). It is related to the front end, therefore to the particular way the user writes/speaks (or "linearizes") the language. This is manifested, for instance, in the difference between infix and prefix style of mathematical operator representation, or in the preference of English for the Subject Verb Object (SVO) word order in unmarked sentences above other word orders.

The abstract syntax is instead the set of Abstract Syntax Trees (ASTs) that are used internally by the interpreter to carry around meaning, carry out symbolic manipulations and describe the actions to be executed on an environment.

There is obviously a correspondence between the two kinds of syntaxes: a concrete grammar describes how a string of text (a linear representation of an idea) has to be turned into a parse tree (a bidimensional representation of the same idea); this parse tree can be further transformed, and when the "unimportant" details related to the concrete syntax are discarded, an AST is born.

These "unimportant" details may include the fact of whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) construct, with the latter usually being easier for the system to evaluate.

Another example may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user intended) precendence of operators and function calls.

Being this a naturalistic language, and specifically a language intended to be easy for English speakers to read and write, the inspiration for both the concrete and abstract syntaxes came from natural language. The influence of English, specifically, is evident in the concrete syntax, but perhaps a little less so in the abstract syntax.

The abstract syntax is inteded to be as language-neutral as possible; it serves the purpose of binding general natural language structures to their "equivalent" programming language structures: an issue related to the concept of programmatic semantics, mentioned in the earlier chapters of this work.

A fundamental distinction in the kinds of possible abstract structures that can be made in all languages the authors are aware of is that between a 

// A fundamental dis phrase vs sentence




// == Future Work

// === Ambiguous Grammars

// - no ambiguous sentence recognition and multi-tree parse, but possiblility to
//   "disambiguate" (really: change default parse order) using parentheses.


// === Support for Synthetic and Agglutinative Grammars

// Perhaps as function hooks reaching out to the lexer from a higher level?

// === Past Tense

// - past tense
//   - list of world models = history
//   - "anachronistic semantics": set of derivation clauses is unique
//   - search all of history in case of unspecified time
//   - alter all of history in case of unspecified time

// Alternative idea to "list of world models = history" => events can have associated times.

// === Context Sensitivity

// - context sentitivity is incomplete
//   - the does eat the fish.
//   - it jumps. ---> "it" resolves to "the fish" :'-)

// But there is the potential to improve it: by managing the deictic dictionary, which could be "adjusted/biased" at any time to point to entities with specific qualities, maybe this could help to make the language more context sensitive. For example "it does jump" would increment the "timestamp" of jumping entities (based on the applicability of the verb "jump") causing the pronoun "it" to point to one of them (cats can jump, fish usually can't).

// === Cataphora and full Deixis?

// === Maybe Implementable on time

// Temporarily ignore: synthetic derivations, ordinals (first, second etc...), defaults (maybe as synthetic clauses, beware default creation loops), number restriction, mutex concepts, equation solver, noun-phrase complements, adjectives. You can use KB.dd for expression transformation history.


// // = Metaphysics
// // - At the most basic level there is: the Graph, the derivations and the DD. The Graph is the "interface" through which Deixiscript communicates with the outer world, including JS, which only uderstands has-as properties.
// // world model as the interface to the outer world
// // = Deixis
// // - Implicit references work as if any entity got the current timestamp whenever
// //   it was mentioned. When function ask() is called from findAll() the deictic
// //   dict is NOT updated, because the results from ask() are ignored.
// // = Syntactic Compression
