= Deixiscript

== Internal and External Dependencies

The implementation language of the code is Python 3 (specifically version 3.10), annotated with type-hints and type checked by the Pyright static type checker. Unit tests are performed with the help of the Pytest testing framework. The Lark parsing toolkit for Python is used for the front end of the interpreter: to turn the strings of source code into parse trees and to further apply some transformations and obtain Abstract Syntax Trees (ASTs), which the interpreter can process. The Graphviz graph visualization software and relative Python wrapper are used as a testing tool, to visually inspect the knowledge graphs produced as a side effect of the interpreter's operation. All of this software is available for free and under the terms of an open source license (MIT for Pyright, Pytest and Lark, CPL for Graphviz).

Other than the aforementioned ones, the core components of the system will require no further dependencies beyond Python's own standard library. The present work itself is free software, and will be made available under the terms of the GPLv3 license by the time this document is published.

We welcome any further inspection and scrutiny of the code by anyone who is interested in developing it further, as we hope this will aid in improving the code's quality and conciseness, other than expanding its functionality. Regarding the latter, some of the possible further developments that we forsee are outlined later in this section. 

We will refer to the new computer language developed in the present work and described in the following pages with the code name "Deixiscript". The name is a protmonteau of the words: Deixis (as in the linguistic concept of indexicality and indirect references) and Script (because this system is intended mainly as a scripting language).

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

A fundamental cross-linguistic distinction can be drawn between phrases (specifically noun phrases) and sentences. 

A declarative sentence expresses a complete thought, and its meaning corresponds with a proposition in logic, ie: it has a truth value, it can be true (corresponding to how the world really is) or false (contradicting the actual state of affairs). In English, a sentence can be simple, compound or complex; an example of a simple sentence in English is: "the quick brown fox jumps over the lazy dog".

A phrase is a linguistic structure that does not express a complete thought, in particular a noun phrase is a phrase of arbitrary length that performs the same function as a noun; a test for whether something counts as a noun phrase is to replace it with a pronoun and see if it fits, for instance in the sentence "the quick brown fox jumps over the lazy dog" there are two noun phrases: "the quick brown fox" and "the lazy dog", the sentence's structure is equivalent to: "it jumps over the lazy dog" or "the quick brown fox jumps over it".

As we have already mentioned, a noun phrase can be of arbitrary length, the most trivial example is a single noun all by itself. A noun phrase typically includes articles, adjectives and relative clauses with an arbitrary level of nesting. It is therefore totally possible for a noun phrase to incorporate a sentence (as a relative clause), such as "the fox that jumped over the lazy dog", where "that jumped over the lazy dog" is the relative clause.

A linguistic head (or nucleus) of a phrase is the part that determines the syntactic category of that phrase, in the case of a noun phrase the head would be a noun (or perhaps another, smaller, noun phrase). In the noun phrase "the lazy dog" the head is "dog".

As can be evinced from these properties, the noun phrase leaps to the eye as a good candidate to represent data structures or entities in any framework that tries to achieve a coupling between natural language structures and programming language structures.

There is another more general programming language structure that we think a noun phrase is a good candidate to represent, and that is the (programming) expression.

A programming language expression is any piece of code that evaluates to (or returns) a value, as opposed to a statement, the latter of which is executed purely for its side-effects and does not return anything.

With this in mind, and knowing how noun phrases "point to things/entities", it seems natural to us to draw a more general parallel between all kinds of expressions (the programming language construct) and noun phrases (the natural language construct).

Other than data-structures and objects, what else can be considered an expression in "typical" traditional programming language? Well, a lot of things: function calls (as opposed to procedure calls), mathematical and boolean expressions obviously, the ternary operator, function literals, etc... 

In some languages, the ones that embrace Expression Oriented Programming (EOP) to a greater degree, almost everything can be considered an expression, even regular (non anonymous) function or class defintions, every kind of variable assignment (which typically evaluates to the value of the right hand side) and sometimes even the if "statement" (which ends up being the "if expression") and the for loop.

Given this, we present a strong case for the potential of the noun phrase as a naturalistic surrogate for all of these programming constructs.

== Abstract Syntax

We will now describe in detail the specific set of AST types (or abstract syntax) of the Deixiscript language. The main AST types are: Explicit, Implicit, BinExp, SimpleSentence, Def and Law. Almost every AST type (except for Explicit) can be negated and/or marked as a "command" (imperative mood) through the relative two boolean flags it carries. 

The ASTs which represent noun phrases (noun phrase types) are: Explicit, Implicit and (sometimes) BinExp; the ones which represent sentences are: (sometimes) BinExp, SimpleSentence, Def and Law.

=== Explicit

Explicit (or explicit references) correspond to the "leafs" in the framework described by the traditional Interpreter Pattern; they are hence constants, and constants (the name says it) can only ever evaluate to themselves. It would have made little sense, therefore, to allow them to be negated or marked as commands. A constant in Deixiscript can be: a string, a boolean or a number (only integers are supported as of the time of writing).

Booleans are kept distinct from integers for two reasons: the system needs to have a special value that always syntactically matches anything (we will return to this point later) and another special value which points to no entity whatsoever ("nothing"). These special values are identified with the boolean values of true and false (only false, there is no need for a separate null pointer). To implement these two special constants through integers would mean to force 0 to point to nothing (which is clearly not the desired case, 0 should point to the number zero, which is a thing), and to force 1 to point to the value which syntactically matches any other construct, which again isn't right. Both of these choices would sooner or later lead to bugs, so booleans and integers are kept distinct.

Another thing to keep in mind is that the system (as we will see) follows a closed world assumption, it is therefore quite natural to associate the value "false" with the idea of "nothingness": if it is not in the system then it is "false".

Strings have a dual (or triple) purpose in Deixiscript: they all behave the same way as far as the system is concerned, but some of them are supposed to be considered "just strings" and others are supposed to be considered as symbols that represent more complex entities (individuals or concepts). What keeps them apart is the convention that "individual strings" contain a pound sign (`#`), for example: `"cat#1"` or `"puma#33"`. Strings that don't have a pound sign can either be thought of as concepts (especially when they don't contain any spaces, such as: `cat` or `puma`) or as "just strings".

Explicit references are of paramount importance implementation wise (only Explicits are allowed into the world model), but their direct usage by the end-user (although allowed) is discouraged, as it goes against the principles of naturalistic programming that are hereby being proposed.

=== Implicit

A key insight from the study of natural language, is that people almost never use explicit references (proper nouns, IDs, numbers...) when talking about individual entities; they instead make use of the "type" of these individual entities (common nouns) leveraging the indexicality of language within a given context. For instance, if a person refers to "the cat" when they're at home, versus when they're visiting a zoo, they may be referring to two very different individuals (a house cat vs a mountain lion, for example). But the phrase they may decide to use in both cases is the same: "the cat". 

A noun phrase, as we only know too well, may be made arbitrarily long and arbitrarily precise (and thus exclude an arbitrarily large set of individual entities in a context) through the usage of modifiers such as: adjectives, relative clauses and ordinal numbers: "the cat", "the agile calico cat", "the first agile calico cat which leaped on top of the desk holding a fresh kill in its fangs".

A noun phrase may also refer to multiple entities at once: "the two cats", "the three ocelots", "the 44 caracals".

To support this kind of flexibility with implicit references, we have defined the "Implicit" AST type. An "Implicit" AST has: a head (usually a common noun), a relative clause (which can accept an arbitrarily complex SimpleSentence, or the trivial value of "true"), a cardinality (how many) and an ordinality (a function of the point in time an individual thing was last mentioned).

Furthermore, an Implicit AST supports negation and/or imperative mood through the two boolean flags it carries. There are four possible combinations of these flags' values: positive declarative (search), negative declarative (search opposite), positive imperative (create) and negative imperative (destroy).

The life cycle of an individual starts when a positive imperative (create) statement is made about it, this corresponds to the creation in the world model of a new node with a pound sign id and a connection to a concept node, plus any additional connections (which reflect additional logical relations) to other nodes. In this case, the noun head and the relative clause modifiers are interpreted as a programming language constructor, because they serve to specify the characteristics of the soon to be born entity.

Once created, an existing entity can be retrieved (hoisted on top of the short term memory) by using a positive declarative statement (search), which will be interpreted as a search over the whole world model for (one or more) individual matching the specified type constraints.

When the negative declarative (search opposite) option is used, the search will resolve in (one or more of) the individuals which do not match the type constraints. This is defined as the difference between the global set of individuals and the set of individuals matching the positive equivalent of the expression, taking care of the numerical constraints.

When an entity has outlived its usefulness, it can be destroyed (or purged from the world model, or "forgotten") with a negative imperative statement about it.

=== SimpleSentence

This AST type contains: a verb, a subject, a direct object and some complements. The verb is a string, and the rest of its "arguments" are noun phrase types. Contrary to the English grammar concept of "simple sentence", a SimpleSentence's subject or object or complements can all contain relative clauses.

A SimpleSentence AST models one or more relationship(s) between two or more entities (individuals or concepts). Just like an Implicit it can be interpreted as a positive or negative order, which will result, respectively, in the creation or destruction of relations (edges) in the knowledge graph; because of the closed world assumption a negative relation cannot be interpreted otherwise.

A basic SimpleSentence is a SimpleSentence whose verb is the verb "to have" or the verb "to be".

Before being executed, any non-basic SimpleSentence is converted into an Implicit AST representing an event. The Implicit representing the event is what is actually executed, either to create/destroy an event or to search for it (or for the absence of it). In fact, a non basic SimpleSentence could be seen as syntactic sugar for the direct creation of an event through a noun phrase describing it.

An event individual in the world model is a node with outgoing edges poiting towards verb, a subject and a number of optional complements.

As a cursory remark, all of the relations handled by the system, from simple "be" relations to the huge set of relations describing a complex event, can be broken down to very simple "have" relations, more specifically, in the form: "x has y as z", where x and y correspond to nodes and z corresponds to the label of the directed edge (from x to y) connecting them in a graph. 

Searching for any non basic SimpleSentence thus evaluates to an event individual's string ID, rather than the boolean value of "true" returned by the successful evaluation of a basic SimpleSentence in search mode.

//This approach is inspired by the one discussed in this book @brachman2022machines.

=== BinExp

Binexp, or "binary expression", is perhaps the most proteiform component of Deixiscript's abstract syntax; it is inspired partly  by the usage of connectives (and syntactic compression, discussed in @pegasus) in natural language, and partly by the binary operators of more traditional programming languages.

What all BinExps have in common is three things: an operator string, a left and a right operand.

The operator may be one of the two logical operators: (`and`, `or`), or one of the arithmetic operators (`+`, `-`, `*`, `/`). 

Unlike any other AST type, A BinExp may be interpreted either as a "noun phrase" or as a "sentence", depending on its operator and its operands.

If the operator is arithmetic, the BinExp is always to be interpreted as a noun phrase, because numbers are "nouns", any operation involving them evaluates to a value, and hence is an expression.

If the operator is logical, then it depends on the operands; if both operands are noun phrases then the whole BinExp is a noun phrase and it points to some entities, for instance: `the bobcat and the panther`. Otherwise, if both operands are sentences then the BinExp is interpreted as a sentence (analogous to a compound sentence in traditional English grammar) such as: `the bobcat hunts and the panther eats`.

There is probably little sense in having a BinExp where the left operand is a sentence but the right operand is a noun phrase, or viceversa.

BinExps are essential to the system for three main reasons: they work as traditional logical and arithmetic operations like in most other programming languages, they replace the lists or sequences of a traditional programming language, and they enable syntactic compression.

They work as lists because they can carry around multiple (implicit or explicit) references in one unique bundle, which can be "unrolled" into a sequence by the interpreter when it needs to perform a sequential calculation on them.

They enable syntactic de/compression, because any SimpleSentence that contains a BinExp as a subject, object or complement can be expanded into two or more SimpleSentences. For example, a SimpleSentence like `the cat and the lion dream` can be expanded into the BinExp: `the cat dreams and the lion dreams`, saving the user some time and effort. This "syntactic decompression" has to take into account some simple rules to preserve the equivalence between the compressed and the decompressed versions of the sentence, embodied in De Morgan's laws. For instance, the sentence `the cat or the lion don't like the raven` has to be expanded into something like: `it is false that ((the cat likes the raven) and (the lion likes the raven))`, switching from an `or` to an `and`.

=== Def


// === Law







// function calls, to elaborate on one specific example, are handled as noun phrases 


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
