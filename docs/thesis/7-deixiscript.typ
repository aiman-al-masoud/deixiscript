= Deixiscript

We will refer to the new computer language developed in the present work and described in the following pages with the name: "Deixiscript". The name is a protmonteau of the words: Deixis (a linguistic concept related to indexicality and indirect references) and Script (because this system is mainly intended as a scripting language). The term "Deixis" is used here, perhaps in a slightly inaccurate fashion, to refer to the more general concept of indirect references in language, and not to the more specific idea of deictic words (personal pronouns, temporal and spatial adverbs).

As we have seen in the previous sections, envisioning a naturalistic programming system involves in part the description of a "programmatic semantics" @verbsAsFuncs, or mapping between the constructs of natural language and the constructs of one or more programming languages.

We propose the following set of linguistic abstractions as the basic building blocks for Deixiscript: noun phrases, simple sentences, definitions (a priori knowledge), laws (a posteriori knowledge), the question/command distinction and the possibility to negate noun phrases or sentences. In the following section we will present each of these abstractions and discuss their proposed application to the domain of programming.

== Noun Phrases

A phrase is a linguistic structure that does not express a complete thought; in particular: a noun phrase is a phrase of arbitrary length that performs the same function as a noun; a general test for whether something counts as a noun phrase is to replace it with a pronoun and see if the sentence still makes sense; for instance in the sentence "the quick brown fox jumps over the lazy dog" there are two noun phrases: "the quick brown fox" and "the lazy dog", the sentence's structure is equivalent to: "_it_ jumps over the lazy dog" or "the quick brown fox jumps over _it_".

As we saw, a noun phrase can be of arbitrary length, the most trivial example is given by a single noun all by itself. A noun phrase also typically includes articles, adjectives and relative clauses with an arbitrary level of nesting. It is therefore possible for a noun phrase to incorporate a sentence (as a relative clause), such as "the fox _that jumped over the lazy dog_", where "that jumped over the lazy dog" is the relative clause.

A linguistic head (or nucleus) of a phrase is the part that determines the syntactic category of that phrase, in the case of a noun phrase the head would be a noun (or any smaller noun phrase). In the noun phrase "the lazy dog" the head is "dog".

A noun phrase therefore generally represents things (material and immaterial objects) or types (categories of objects); a noun phrase can also be a proper noun (a name of a person or place).

A key insight from the study of natural language, is that people rarely ever use explicit references (proper nouns, IDs, numbers...) even when talking about individual entities @the80s; they instead make use of the "type" of these individual entities (common nouns) leveraging a phenomenon known as the indexicality of language. For instance, if a person refers to "the cat" when they're at home, versus "the cat" when they're visiting a zoo (a different "context"), they may be referring to two very different individuals (a house cat vs a mountain lion, for example). But the phrase they may decide to use in both cases is the same: "the cat". 

A noun phrase, as we only know too well, may be made arbitrarily long, and hence arbitrarily precise, (and hence exclude an arbitrarily large set of individual entities in a context); and this can be achieved through the use of modifiers such as: adjectives, relative clauses and ordinal numbers: "the cat", "the agile calico cat", "the first agile calico cat which leaped on top of the desk holding a fresh kill in its fangs". Moreover, a noun phrase may also refer to multiple entities at once: "the two cats", "the cat and the ocelot", "the 44 caracals".

== Simple, Compound and Complex Sentences

A declarative sentence expresses a complete thought; the meaning it carries corresponds to a logical proposition, and the latter is associated to a truth value. Having a truth value means that whatever construct carries it can be true or false: in the former case it would be describing how the world really is, and in the latter case it would contradict the actual state of affairs in the world.

In English, a sentence can be simple, compound or complex; an example of a simple sentence in English is: "the quick brown fox jumps over the lazy dog". A simple sentence generally has a subject (the doer of an action), a verb (the action) a direct object (the passive agent that receives the action) and any number of complements; such complements can help specify the location or time of the action, or can correspond to any other actors directly or indirectly involved in the action, in English they are generally introduced via a preposition such as: "to", "from", "by"...

We will refer to the subject, direct object and complements in a sentence collectively as the "arguments" of the verb, because the number of arguments or "slots" to be filled can vary depending on the nature of the verb that is used. This number is known as the "transitivity" (or more generally the "valency") of a verb. These arguments we speak of are generally noun phrases.

The verbs that require a direct object are known as transitive verbs, for instance the verb "to eat" in the sentence: "the cat eats fish", where "fish" is the direct object. Some verbs do not require a direct object, such verbs are known as intransitive verbs, the verb "to exist" is an example of an intransitive verb in English.

Some verbs are traditionally regarded as optionally accepting two direct objects and are known as ditransitive verbs, such as the verb "to make" in the sentence: "the senate made him a consul".

Some other verbs can be seen as requiring no subject at all, and are known as impersonal verbs, such as the verb "to rain" in the sentence "it rains". Since English always (syntactically) requires the subject slot to be filled, except in informal speech, the existence of such verbs isn't so obvious as in other languages which can drop the subject, such as Italian where the translation of the sentence mentioned above would be just "piove", without any visible subject.

Some simple sentences in English can have no verb at all: verbless sentences can be seen as alternative forms of an equivalent "verbful" sentence, and are typically used for the sake of brevity or to achieve some special rethorical effect, common examples include exclamations such as: "good job!" in lieu of "you did a good job!" or "excellent choice!" in place of: "this is an excellent choice!"

==== Compound Sentences

A compound sentence is a sentence made up of two or more simple or compound sentences joined together by a conjunction or disjunction. An example is: "the cat meowed loud, but she failed to obtain food"; it is important to note that the two simple sentences incorporated in the larger compound sentence remain "independent" of each other: you can rephrase the previous sentence by changing their order and the meaning is logically equivalent (if you ignore the time factor, at least).

==== Complex Sentences

A complex sentence creates a relation of dependency between two simple sentences, in the example: "the cat failed to obtain food, because she didn't meow out loud" the two simple sentences cannot be swapped around without changing the logical meaning of the statement. The word "because" is a subordinating conjunction, and in this example it serves to highlight a cause-and-effect relationship between two actions of the cat (meowing out loud and obtaining food).

But cause-and-effect relationships aren't the only kind of relationships that can be expressed by a complex sentence; take the example: "the man is a bachelor, because he isn't married", the linguistic structure is similar but the idea is very different: this is an example of what is known in philosophy as "analytic" or "a priori" knowledge, it isn't knowledge of the laws (observable regularities) that govern the world, but rather of the meanings of the words "bachelor" and "married" and the (necessary, and somewhat trivial) relationship between them.

== Questions vs Commands

A simple declarative sentence generally stands for a logical proposition, in English these are generally known as sentences in the indicative mood, and often constrasted with sentences in the subjunctive mood, which refer to possible or unreal events.

Natural languages also typically include an imperative mood, a sentence in the imperative mood (an "order" or a "command") doesn't really correspond to a logical proposition, but it expresses nontheless the desire of the speaker for the world around them to change in some specific respect.

Questions in English are generally stated in the indicative mood, with some slight syntactical differences and/or a different tone of voice in speech.

== Negation

We distinguish between two kinds of negation in natural language: the first applies to simple sentence, which thus asserts the falsity of a proposition (eg: "the sun doesn't rise from the west"), and the second applies to noun phrases and serves to exclude a certain kind of property from the scope of the noun phrase (eg: "the non-residents").

== Programmatic Semantics

Coming back to the subject of programmatic semantics, we propose that noun phrases be regarded as expressions, that simple and compound sentences be thought of mainly as procedure invocations, and that complex sentences be regareded as function/type definitions or event handlers.

=== Noun Phrases

A noun phrase generally represents things (material and immaterial objects) or types (categories of objects), and this makes it a good candidate, in the context of programming, to represent strings, numbers, records and data structures in general, as was also mentioned in a previous section @verbsAsFuncs.

Besides data structures, we believe that the noun phrase captures a more general programming construct known as the "expression"; an expression in programming languages is any piece of code that evaluates to (or returns) a value. It is generally contrasted to a "statement" (or "instruction"), which does not evaluate to anything, and is hence executed purely for its side-effects (state mutations it produces in the execution environment).

An important property of expressions is composability: a number, boolean, string, record or object literal is an example of an expression in most programming languages, and so are mathematical expressions, function calls and any combination of the former; just like noun phrases, programming expressions can grow up to an arbitrary length and can contain nested expressions.

Some programming languages are known as Expression Oriented, because almost every construct they provide returns a value and is composable, even constructs that are traditionally seen as statements such as for loops or if-else "statements", an example of this is the Scala Language @alexander2017functional.

=== Simple and Compound Sentences

The tendency will be to regard these as either assertions: which add knowledge to the world model or as yes-or-no questions: which evaluate to a truth value, depending on the current state of the knowledge base.

As we saw, an assertion doesn't precisely correspond to an imperative sentence in English, but it is the closest thing there will be to a "command", we will therefore use these terms interchangeably. 

=== Complex Sentences

We mentioned the fact that complex sentences allow the speaker to express a relation of subordination between two ideas; and we mentioned the philosophical distinction between "analytic" (or "a priori") and "synthetic" (or "a posteriori") knowledge, and how a valid option to verbalize this kind of knowledge in natural language is indeed through the use of a complex sentence. We think that two useful parallels with the domain of programming can be drawn here.

The question of whether "analytic" and "synthetic" knowledge really exhaust all of human knowledge is an open issue in philosophy; and there are indications that this is not the case, specifically in the existence of unfalsifiable (like analytic) knowledge that nontheless depends on real world experience (like synthetic), for instance the general notion that "things change"; this third kind of knowledge can't be neatly classified in the binary scheme presented to us by the analytic/synthetic distinction. But regardless of this problem with the distinction, we will assume that all of the knowledge contained in a computer program falls exclusively under one of these two categories.

When it comes to a priori knowledge, we think that a computer program essentially presents us with defintions: function definitions, type definitions, class definitions; these are all examples of abstractions that the programmer essentially creates for their own comfort: to avoid having to repeat themselves and hence to improve code maintainability; the interpreter or compiler needs to know that when we say `abs(x)` we really mean `-x if x<0 else x`, but it would just as well directly accept `-x if x<0 else x`, or the equivalent machine code.

On the other hand, we believe that the a posteriori knowledge contained in a program essentially corresponds with the "useful work" done by it, this knowledge is more correlated to the side-effects, intended as the desired output or external behavior of the program: it describes them. A perfect example of this, we think, are event handlers in an Event Driven programming language, when a programmer adds an event handler to a program (eg: "when the button is clicked, the counter increments"), they are essentially teaching the environment a new cause-and-effect relationship. You may also say that they are teaching it to react with a certain response to a given stimulus, or that they are teaching it to expect a certain kind of event to take place after another.


== Implementation

=== Language

The implementation language of the code is Python 3 (specifically version 3.10), annotated with type-hints and type checked by the Pyright static type checker. Unit tests are performed with the help of the Pytest testing framework. 

=== Parser

The Lark parsing toolkit for Python is used for the front end of the interpreter: to turn the strings of source code into parse trees and to further apply some transformations and obtain Abstract Syntax Trees (ASTs), which the interpreter can process. 

The Graphviz graph visualization software and relative Python wrapper are used as a testing tool, to visually inspect the knowledge graphs produced as a side effect of the interpreter's operation. 

=== Licensing

All of the software used to develop Deixiscript is available for free and under the terms of an open source license (MIT for Pyright, Pytest and Lark; CPL for Graphviz). Other than the aforementioned ones, the core components of Deixiscript will require no further dependencies beyond Python's own standard library.

Deixiscript itself is free software, and will be made available under the terms of the GPLv3 license by the time this document is published. We welcome any further inspection and scrutiny of the code by anyone who is interested, as we hope that this openness will aid in improving the code's quality and conciseness, and in expanding its functionality. Regarding the latter, we will suggest some possible further developments later in this section.

=== Code Style

Regarding the code's style, an effort was made to follow the Functional Paradigm's approach of data-immutability and function (or method) purity whenever feasible (especially in the "core" module); the advantage being that of predictable semantics in the business-logic: method calls never directly modify an object, they rather return a new copy of it if need be; reducing the chances of an unforeseen side-effect (state mutation within an object) flying under the radar and causing harm.

=== Modules

The code is split into four modules: `core`, `main`, `parse` and `plot`. The module `main` houses the program's main entry point. The module `plot` defines a few utility functions to visualize graphs. The module `parse` defines the language's concrete grammar(s). And the module `core` contains the core logic of the interpreter, which is independent of the rest of the code. Every module also includes a `tests.py` file which contains some unit tests that serve to test and showcase the module's functionalities.

=== Interpreter Pattern

The code inside of the `core` module follows the Interpreter Pattern, one of the well-known 23 GoF Software Design Patterns for OOP languages. Alternative approaches were tried, but the advantage offered by the polymorphic overriding of methods in the classes representing the AST types was too tempting, and no alternative facilities were offered by the Python language, as function overloading in Python must be done by hand and is a tedious business. 

The Interpreter Pattern allows for greater flexibility in adding new AST types to the language, and in specializing the behavior of existing ones; and it does so by defining a common interface (usually at least an "eval" method) on every class representing an AST type. The classes representing the AST types are usually subdivided in "leaf" types and "composite" types. The former represent atomic entities (or constants) such as strings and numbers, and the latter represent anything else: from the simplest of boolean expressions to the messiest of function definitions. 

The common interface ensures that each of these ASTs can be evaluated the same way: by calling its "eval" method and passing it the current operating context (also known as "environment", or "state"). The "eval" method is expected to return the result of the evaluation; in our case it returns a whole new updated context, without changing the original, in accordance with the general functional style of the codebase.



// ==== Core

// The classes in the "core" module represent AST types, except for the classes EB (which stands for "Expression Builder") and KB (which stands for "Knowledge Base"). 

// ===== Expression Builder

// The Expression Builder is a utility class that helps to build language expressions (phrases and sentences) from the AST classes without interacting directly with the latter. It makes use of the Builder GoF pattern, and adopts the Fluent Interface style: a way of designing Object Oriented Application Programming Interfaces (APIs), whose goal is to increase code readability by emulating a Domain Specific Language (DSL) through the usage of method chaining and informative method names. In practice it is useful to test the core logic of the language independently of the parser.

// ===== Knowledge Base

// This is the equivalent of the context/environment of the Interpreter Pattern. It holds all of the state at any point during the execution of the program, which mainly consists of three kinds of information: the World Model (or Knowledge Graph), the Deictic Dictionary and the list of Defs and Laws.


----------------


== Abstract Syntax vs Concrete Syntax

// We will begin by fleshing out what is known as the "abstract syntax" of Deixiscript. The abstract syntax of a language is the set of Abstract Syntax Tree (AST) types, that is distinct from its concrete syntax; the latter consisting in a set of production rules (usually represented in Extended Backus-Naur Form (EBNF)) that describe more of what the language looks like "from the outside". Obviously, the same abstract syntax may be associated to multiple concrete syntaxes, and viceversa.

The abstract syntax of a language is distinct from its concrete syntax. 

The concrete syntax consists in a set of production rules that describe a Context Free Grammar (CFG) and are captured by meta-languages such as the Extended Backus-Naur Form (EBNF). It is related to the front end, therefore to the particular way the user writes/speaks (or "linearizes") the language. This is manifested, for instance, in the difference between infix and prefix style of mathematical operator representation, or in the preference of English for the Subject Verb Object (SVO) word order in unmarked sentences above other word orders.

The abstract syntax is instead the set of Abstract Syntax Trees (ASTs) that are used internally by the interpreter to carry around meaning, carry out symbolic manipulations and describe the actions to be executed on an environment.

There is obviously a correspondence between the two kinds of syntaxes: a concrete grammar describes how a string of text (a linear representation of an idea) has to be turned into a parse tree (a bidimensional representation of the same idea); this parse tree can be further transformed, and when the "unimportant" details related to the concrete syntax are discarded, an AST is born.

These "unimportant" details may include the fact of whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) construct, with the latter usually being easier for the system to evaluate.

Another example may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user intended) precendence of operators and function calls.

Being this a naturalistic language, and specifically a language intended to be easy for English speakers to read and write, the inspiration for both the concrete and abstract syntaxes came from natural language. The influence of English, specifically, is evident in the concrete syntax, but perhaps a little less so in the abstract syntax.

The abstract syntax is inteded to be as language-neutral as possible; it serves the purpose of binding general natural language structures to their "equivalent" programming language structures: an issue related to the concept of programmatic semantics, mentioned in the earlier chapters of this work.

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
