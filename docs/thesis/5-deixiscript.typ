= Deixiscript

We will refer to the programming language developed in the present work and described in the following pages with the name: "Deixiscript". The name is a protmonteau of the words: Deixis (a linguistic concept related to indexicality) and Script (on the model of many other popular programming language names).

== Goals and Non-goals

=== Goals

Our goal in relation to Deixiscript was to design and build a working prototype of a naturalistic language, that could showcase some of the ideas from the existing naturalistic languages on the "market", to get a feel of some of the practical difficulties involved in making a naturalistic programming system, and to propose and experiment with the addition of some slightly more novel features that we shall discuss.

=== Non-goals

As is maybe clear by now, our goal has never been to implement a production-grade programming environment, a task that would require a higher level of practical expertise in the field of language implementation and many more man-months of effort.

We also did not pay much attention to issues related to performance and code-optimization (_"premature optimization is the root of all evil"_ @prematureOptimization); and we were in general more interested in code-readability than execution speed.

== Evolution of Deixiscript

Our idea of what the language had to be like (and how it had to be implemented) has changed and evolved significantly throughout the arc of time we had at our disposal. During this period of time we have explored many different ideas, not all of them have made it into the final implementation.

=== Initial Stage

We initially started out with the vague notion of translating basic sentences in natural language to predicate logic (specifically to Prolog) clauses, which could be then executed on a Prolog interpreter as either questions or statements. We eventually decided to change strategy when we realized that the process of translation was a little more involved than expected, and that the full power of Prolog's predicate logic was perhaps not really needed for our more modest purposes.

=== Rule Orientation

After this initial experiment with predicate logic, we were initially inclined to go back to a more object-oriented approach. This meant rigidly attaching both data and behavior to the entities in the world model. This approach, however, comes with its own set of problems. We discussed some of these problems when we talked about Inform 7's approach in a previous chapter @inform7RuleOrientation.

We where then inspired by projects like Pegasus and by readings such as the book "Machines Like Us" (which we also discussed in a previous chapter @commonSenseACentralProblem) to take a more "rule-based" approach (though we still had not read about Inform 7's implementation to know it was called like that there).

As it stands, the current version of Deixiscript adopts a kind of rule-based programming approach. This makes types a little more flexible than classes, because they do not have to be declared as rigidly (or linked to their behavior as tightly) as in class-based programming.

=== Automated Planning (limited)

The current version of Deixiscript also tries to introduce a limited kind of automatic planning (which we encountered in the previous chapter @automaticPlanning) in the context of a rule-based naturalistic programming language. This capability can be used to issue declarative "orders" to individuals in the world model known as "agents", as we will see. 

== Implementation Details

In the current section, we we will begin by discussing some high-level implementation details, including the programming language, libraries, code-style and software design pattern that were used.

In the later sections we will then move on to describe the current version of Deixiscript, detailing and motivating the choices that were made and the philosophy behind them. 

Since Deixiscript is an English-based language, what follows will also include some inevitable digressions into some (basic) aspects of the English grammar.

=== Language

The implementation language is Python 3 (specifically version 3.10 or higher), annotated with type-hints and type checked by the Pyright static type checker. Unit tests are performed with the help of the Pytest testing framework.

We have experimented with other programming languages (TypeScript/JavaScript) for Deixiscript's implementation, but we decided to stick to Python at the end.

We think that Python is a great language for prototyping, due to its flexibility and regularity, due to the aboundance of third-party libraries that help perform a wide variety of complex tasks easily, and also due to the richness of its included standard library.

=== Parser

The Lark @larkwebsite parsing toolkit for Python is used for the "front end" of the Deixiscript interpreter: to turn the strings of source code into parse trees and to further apply some transformations to obtain Abstract Syntax Trees (ASTs), which the interpreter can process.

The Lark parsing toolkit is available for free under the terms of the MIT opensource software license.

=== Graphical Tools

The Graphviz @graphviz graph visualization software and relative Python wrapper  @graphvizPythonWrapper were used as a testing tool, to visually inspect the world models produced as a side effect of the interpreter's operation.

The Matplotlib @matplotlib visualization tool and Python library was used to display the evolution of some simulated processes graphically.

// (MIT for Pyright, Pytest, and Lark, CPL for Graphviz,)

=== Licensing

All of the software that was used to develop Deixiscript is available for free and under the terms of an opensource license. Other than the aforementioned ones, the core components of Deixiscript require no further dependencies beyond Python's own standard library.

Deixiscript itself is free software, and will be made available under the terms of the GPLv3 license by the time this document is published. We will suggest some possible further developments for the language in a later section of this work.

=== Functional Style

Regarding the code's general style, an effort was made to follow (when possible) the Functional Paradigm's approach of data-immutability and function (or method) purity.

We perceive that the advantage gained from following this style was a more predictable semantics in the business-logic. Most method calls do not modify an object directly: they return a copy of it if need be. This immutability of objects reduces the chances of an unforeseen side-effect happening (an unpredicted state mutation within an object which can be a cause for bugs).

On the other hand, the disadvantage of this approach is that method return types can become a little too elaborate, because due to the lack of side-effects all changes have to be propagated through the mechanism of function returns.

=== Interpreter Pattern

The classes that represent the Abstract Syntax Trees (ASTs) follow the Interpreter Pattern, one of the well-known 23 GoF Software Design Patterns for OOP languages.

Alternative approaches were tried (using a single or multiple eval functions) but the polymorphic nature of the Interpreter Pattern offers a higher degree of flexibility, also considering the fact that Python functions cannot be overloaded (unless done manually).

The Interpreter Pattern defines a common interface (called "AST") with at least one method (usually called "eval", short for "evaluate"). The classes that implement the AST interface can either be "leafs" or "composites". A leaf (such as a number, a string, or a boolean literal) are typically constants, which means they always evaluate to themselves.

Examples of composite types can be: an arithmetic expression, a logic expression, a function definition, a function invocation (or almost anything else one can think of, for that matter). A composite type typically evaluates its "children" first, then combines them however its logic dictates into a new evaluation result.

The common interface ensures that all of the AST objects can be evaluated the same way: by calling the "eval" method and passing it as an argument the operating context (known as "environment", or "state").

The "eval" method is expected to return the result of the evaluation of the AST object and to write the changes produced by its evaluation (if any) to the environment.

In our case, since we are following a Functional approach, the eval method returns a new object that contains the updated context without changing the original.

== Representing Propositions

We think that a central theme in any language (natural or artificial) is about propositions and their concrete representation. We came across propositions when discussing logic programming in a previous chapter; as we saw, in predicate logic propositions are represented by Well-Formed Formulas. In natural language, on the other hand, propositions are typically represented by sentences. In English, a sentence can be simple, compound or complex.

=== Simple Sentences

A common example of a simple sentence in English is: "the quick brown fox jumps over the lazy dog". A simple sentence can contain: a subject ("the quick brown fox"), a verb ("jumps"), a direct object (none in this case, since "jump" is typically used as an intransitive verb), and any number of complements ("the lazy dog" could be considered as the "location" of the fox's jump).

==== Complements & Grammatical Cases

The complements of a sentence can help specify the location or time of an action, they can also correspond to any other actors directly or indirectly involved in the action. In English, complements are generally introduced after a preposition such as: "over" (from the example), "to", "from", "by", and so on.

The direct object of a sentence is a little special in English (and many other modern European languages) because, just like the subject, it is not preceded by any preposition. The subject and the object are generally distinguished by their order of appearance in the sentence (the subject typically precedes the object).

Unlike English, some languages (even some modern Indo-European languages) rely more heavily on "case-markings" rather than prepositions and word-order to express grammatical relationships. A case-marking is typically a word inflection (such as a suffix, a prefix or an infix). In many such languages, English's "direct object" corresponds to an inflected noun in the "accusative case".

A vestige of this grammatical case-system (which English inherited from an older proto-language) remains in modern English's personal pronouns, for instance: "I/he/she" are "nominative" (the grammatical case of the subject), "me/him/her" are "accusative" (the grammatical case of the direct object) or "dative" (e.g.: "I give _him_ the book").

==== Verbs and Transitivity

In any case, the verbs that require a direct object are known as transitive verbs, for instance the verb "to eat" in the sentence: "the cat eats fish", where "fish" is the direct object. Some verbs do not require a direct object, such verbs are known as intransitive verbs, the verb "to exist" is an example of an intransitive verb in English.

Some verbs are traditionally regarded as optionally accepting two direct objects and are known as ditransitive verbs, such as the verb "to make" in the sentence: "the senate made him consul".

Some other verbs can be seen as requiring no subject at all, and are known as impersonal verbs, such as the verb "to rain" in the sentence "it rains". Since English always (syntactically) requires the subject slot to be filled, except in informal speech, the existence of such verbs isn't so obvious as in other languages which can drop the subject, such as Italian where the translation of the example sentence above would be just "piove", without any visible subject.

Some simple sentences in English can have no verb at all: verbless sentences can be seen as alternative forms of an equivalent sentence with a verb, and are typically used for the sake of brevity or to achieve some special rethorical effect, common examples include exclamations such as: "good job!" in lieu of "you did a good job!" or "excellent choice!" in place of: "this is an excellent choice you are making!"

=== Compound Sentences

A compound sentence is a sentence made up of two or more simple or compound sentences joined together by a conjunction or disjunction. An example is: "the cat meowed loud, but she failed to obtain food"; it is important to note that the two simple sentences incorporated in the larger compound sentence remain "independent" of each other: you can rephrase the previous sentence by changing their order and the meaning is logically equivalent (if you ignore the time factor, at least).

=== Complex Sentences

A complex sentence creates a relation of dependence between two simple sentences, in the example: "the cat failed to obtain food, because she didn't meow loud enough" the two simple sentences cannot be swapped around without changing the logical meaning of the statement. The word "because" is a subordinating conjunction, and in this example it serves to highlight a cause-and-effect relationship between two actions of the cat (meowing loud and obtaining food).

But cause-and-effect relationships aren't the only kind of relationships that can be expressed by a complex sentence; take the example: "the man is a bachelor, because he isn't married", the linguistic structure is similar but the idea is a little different: this is an example of what is known in philosophy as "analytic" or "a priori" knowledge, it isn't knowledge of the laws (observable regularities) that govern the world, but rather of the meanings of the words "bachelor" and "married" and the necessary (and somewhat trivial) relationship between them.

=== Deixiscript Ideas 

A proposition (or "Idea") in Deixiscript has: a (necessary) subject, a (necessary) predicate (we will come to this later) and an (optional) object.

A choice was made in the current version of Deixiscript to limit the maximum number of "slots" of a verb in a sentence to only two: a (necessary) subject and an (optional) direct object. The language could be easily extended to include more (optional) complements in a sentence (older "versions" of the language had them indeed), but we chose to avoid them at the end because they may be more confusing than helpful at this stage (how many prepositions do we have to support? Is "in" a synonym of "on"?) and because binary relations (subject, direct object) are already quite powerful and allow one to express a large range of ideas @nelson2006natural.

From now on, we will speak of "simple sentences", of "Ideas" and of "propositions" almost interchangeably in the context of the Deixiscript language, while keeping in mind that: a proposition is really an abstract (mental) concept, that an English simple sentence is best thought of as a feature of the (concrete) syntax of the English language, and that an "Idea" (as we are using the term) is an element of the abstract syntax of our implementation of Deixiscript. 

Also, we must keep in mind that a proposition is the meaning of any sentence (not just simple sentences), hence the term "atomic proposition" would be more appropriate when referring to the meaning represented by a Deixiscript Idea.

Another component of a Deixiscript Idea is a Boolean flag we will refer to as "CMD". The CMD flag is there because simple sentences in natural language can be "statements" (matters of fact, acritical declarations of some knowledge assumed to be true) or "questions" (expressions of the desire to learn about a specific fact or facts in the world). In English, both statements and questions are expressed in the grammatical mood known as "indicative".

There are other grammatical moods such as "subjunctive" (to express unreal or hypothetical situations) and "imperative" (to give orders). We won't be needing an explicit subjunctive mood (it is rarely used in English anyway), and we will be using a different kind of sentence all-together to express the "imperative mood" as we shall see.

From a programming perspective, what is the difference between a question and a statement? We think that natural language "statements" (i.e.: declarations of knowledge assumed to be true) and programming language "statements" (i.e.: those constructs that are executed primarily for the side-effects they produce in the environment) are actually quite similar, because they both cause the "environment" to change its "beliefs" in some way.

A programming statement, such as a variable assignment, (primarily) causes a change of state in the system, while a natural language statement in the indicative mood causes a person to change its beliefs about the world (or at least about the other person making the statement).

On the other hand, we think that questions (and conditions) are more akin to programming language expressions, because their primary function (barring rethorical questions of course) is not that of modyfing someone else's beliefs about the world, but rather of eliciting a response from the interlocutor. In natural language, this response can be a simple "yes" or "no", or it can "point to a thing" (such as in "what", "where", "who" questions), or it can be an explanation of some phenomenon or behavior (such as in "why" questions).

// https://stackoverflow.com/questions/19132/expression-versus-statement

In most of the popular programming languages there is a syntactical distinction between a conditional expression and a statement. For instance, in C-like languages an assignment typically uses a single equal sign and an equality-comparison uses a double equals sign.

We think that this distinction is mostly abstent from English (e.g.: the simple sentence "it is snowing" remains unchanged when embedded in the bigger complex sentence "if _it is snowing_, then wear a heavy coat"), and there is no reason why it must be otherwise in a programming language.

So a sentence like "it is snowing" can be interpreted either as a statement (i.e.: "let it be known that it is snowing right now") or as a question or condition (i.e.: "is it snowing right now, yes or no?"). These two different interpretations, which we will call "TELL" and "ASK" respectively, are triggered by syntactic context. For instance, if a simple sentence is embedded within the condition part of a conditional statement (as we saw before), then it will be interpreted in "ASK" mood.

A simple sentence all by itself (e.g.: "it is snowing") is interpreted in "TELL" mood, unless ended by a question mark (e.g.: "it is snowing?"). This syntax is a little off from the syntax of a "proper" question in English which in this case would require swapping the verb "to be" with the dummy subject "it" (i.e.: "is it snowing?") but we think that the two forms are still pretty close, and this issue could be fixed in the future by some slight additions to Deixiscript's concrete syntax.

In general almost all syntactic elements of Deixiscript can be interpreted as either "TELL" statements or "ASK" expressions. Depending on the value of the CMD flag, the method "eval" behaves in one way (TELL) or in the other (ASK). However, with some syntactic elements only one kind of behavior makes sense: strings, numbers, Booleans are only meant to evaluate to themselves (they are constants after all), so they do not have a TELL mood.

Most AST types have an intrinsic meaning which cannot be overridden/overloaded, for instance: arithmetic operators, logic operators, comparison operators, the equal sign (which works either as a comparison operator or as an assignment depending on the syntactic context); these all have a fixed meaning for the sake of simplicity.

Simple sentences (Ideas), instead, don't have any predefined meaning: they must be defined by the programmer before being used, this can be done through a definition (or "Def") syntactic construct that looks a lot like a complex sentence in English.

We will distinguish between two kinds of Ideas (and consequently two kinds of simple sentences) which are formally very similar (they are all represented by the same abstract syntactical structure) but they have a different meaning that can be discerned (as we will see).

We will call these two categories of Ideas: "Facts" and "Events". We think of a Fact as just a regular proposition (a statement about how the world is or isn't at any particular point in time), and we think of an Event as an action that can be actively performed by an agent.

Syntactically speaking, we will represent "Facts" as simple sentences with a copular verb (the verb "to be" in English), for instance the sentence: "the player is dead". We will think of Facts as "static" states of affairs, a sentence representing a Fact always refers to the present tense (there are no other tenses in Deixiscript), and describes the presence or absence of a particular situation "here and now" in the world model.

Events on the other hand will be represented by simple sentences with any verb other than the copula (other than the verb "to be"). An Event does not describe a state of affairs that we think of as statically represented in the world model, but rather a dynamic action (performable by an agent) that produces certain kinds of changes to the world model when it is performed at any given time.

As already mentioned, the AST type behind both Facts and Events is the one and same Idea AST type. Another thing we already mentioned is that the Idea AST type has a subject, an (optional) object and a "predicate". In case of an Event this predicate is a non-copular verb (e.g.: to eat, to drink, to run), whereas in case of a Fact the predicate is an adjective (e.g.: red, dead, near).

Some "adjectives" such as near (we will be treating it as an adjective) support an object (e.g.: "the cat is near _the mat_"), they are akin in this sense to transitive verbs (such as "to eat").

Therefore, the system does not know whether an Idea represents an Event or a Fact from the Idea object itself. Every Idea is thought of as a Fact (i.e.: it cannot be performed by an agent) until proven otherwise, namely if there is an appropriate Potential.

The Potential AST type was introduced just for this: to mark certain kinds of Ideas as a _potential_ action for a certain kind of agent under some kind of circumstance. A Potential specifies the condition under which a kind of Idea (which implicitly becomes a kind of Event) can occur. A Potential also specifies the duration of this kind of Event, which is useful for the purposes of time-bounded planning and simulation, as we will see later. Syntactically, a Potential is (like a Definition) a kind of complex sentence.

== Representing Entities

Up until now, we have always generically talked about the "subject" and the "object" of a simple sentence, we will now take some time to explain what we mean by those terms.

==== Noun Phrases

In English, the subject and the object of a sentence are "noun phrases". A phrase is a syntactic structure that does not express a complete thought; in particular: a noun phrase is a phrase that performs the same function as a noun.

A general test for whether a part of a sentence counts as a noun phrase is to replace it with a pronoun and to see if the sentence still makes sense; for instance in the sentence "the quick brown fox jumps over the lazy dog" there are two noun phrases: "the quick brown fox" and "the lazy dog", the sentence's structure is equivalent to: "_it_ jumps over the lazy dog" or "the quick brown fox jumps over _it_", or even "_it_ jumps over _it_".

A linguistic head (or nucleus) of a phrase is the part that determines the syntactic category of that phrase, in the case of a noun phrase the head would be a noun (or any smaller noun phrase). In the noun phrase "the lazy dog" the head is "dog".

==== Implicit References

A key insight from the study of natural language, is that people rarely ever use explicit references (proper nouns, IDs, numbers...) even when talking about individual entities @the80s; they instead make use of the "type" of these individual entities (common nouns) leveraging a phenomenon known as the indexicality of language. 

For instance, if a person refers to "the cat" when they're at home, versus "the cat" when they're visiting a zoo (a different "context"), they may be referring to two very different individuals (a house cat vs a mountain lion, for example). But the phrase they may decide to use in both cases is the same: "the cat".

A noun phrase can be of arbitrary length, and of arbitrary precision (and thus include/exclude a higher number of individuals), the most trivial example is given by a single noun all by itself (e.g.: "cat"), but a noun phrase also typically includes articles, adjectives and even relative clauses with any arbitrary level of nesting, e.g.: "the agile calico cat that leaped on top of my desk holding a fresh kill (which she wanted me to have as a gift) in its fangs".

==== Deixiscript Noun Phrases

The kinds of noun phrases supported by Deixiscript are: constants (numbers, strings, Booleans and IDs), "implicit phrases", "genitive phrases", pronouns and variables.

===== Constants

Numbers, strings and Booleans work just like they do in any other programming language. IDs are mainly there for the system's own benefit (we will discuss them further when talking about the world model) and are not accessible to the user of the language. 

===== Variables

Variables are placeholders names ("x","y" and "z") that match any type, they can be useful when writing some kinds of general Definitions.

===== Implicit Phrases

What we call "implicit phrases" comprise of a noun and a list of adjectives. A noun is just a string representing a type (which doesn't have to be declared explicitly). The adjectives do not carry an intrinsic meaning, they are tied to the adjectives used in Ideas (simple sentences) we discussed earlier.

===== Attributive Adjectives

An adjective in a noun phrase is referred to as an "attributive" adjective, whereas an adjective in a sentence with a copula is referred to as a "predicative" adjective. In Deixiscript there is an equivalence between the two: once the meaning of an adjective is defined as a predicative adjective in a simple sentence (e.g.: "the cat is calico, means..."), it can be used as an attributive adjective in a noun phrase (e.g.: "the calico cat"). An attributive adjective can also be negated (e.g.: "a non-calico cat").

===== Genitives and Possession

What we call a "genitive phrase" is a noun phrase that refers to a property of an individual rather than to an individual itself. Syntactically, it is in the form:  "an individual's property" or "x's y" (using English's Saxon Genitive). It is also possible to implement an equivalent form using the preposition "of".

We think that "possession" is an important part of how we model the world. All of the "useful work" that the system really does (everything it boils down to) is setting the value of properties on the dictionary-like data structures the system internally uses to represent "individuals". It is precisely because of this internal representation that the system is able to interface with the outside world (other programming languages, tools and libraries). We will come back to this idea later when discussing the Knowledge Base and World Model.

===== Pronouns

The last kind of noun phrase we mentioned is the pronoun. This is perhaps the most elusive kind of syntactical element that we take for granted in natural language, but that is actually not so easy to approximate (with a hundred percent accuracy) in an artificial language.

A personal pronoun (e.g.: "I", "you", "he/she", "it", etc) is a specific instance of a linguistic phenomenon known as "deixis". The "deictic" words are highly context-dependent words whose true meaning depends almost entirely on the state of the speaker who uses them. Deixis can be spatial (in words such as: "here", "there"), temporal (in words like: "yesterday", "before", "after") or personal (in words such as the personal pronouns).

Deixiscript really only supports one kind of pronoun (third person singular). Pronouns in Deixiscript are a little special for another reason: they are the only kind of noun phrase that needs some external context to evaluate.

We have already talked about how a simple sentence (Idea) may be treated as a conditional expression or as a statement with side-effects depending on the surrounding (syntactic) context (e.g.: the simple sentence "it is snowing" enclosed in the larger complex sentence: "if _it is snowing_ you put on a heavy coat"), but this is technically easier to achieve: the object that represents the larger syntactic structure (the complex sentence) _knows_ that its own conditional part has to be evaluated in "ASK" mood and not in "TELL" mood.

On the other hand, with a pronoun that behaves somewhat "realistically", one should reserve the right to resolve the pronoun in different ways (to different concrete referents) based on the meaning of the surrounding context (the simple sentence that embeds the pronoun). 

For instance: "the cat saw a table, and it jumped on it", it is obvious that the first instance of the pronoun "it" refers to "the cat" and that the second one refers to "the table", because we live in a world were cats are the sort of entities that can jump on tables, and not vice versa.

Deixiscript supports a limited kind of context-dependent resolution of pronouns,  based on the Short Term Memory (STM) of the interpreter and the stored Definitions of the simple sentences, we will discuss the STM later alongside the Knowledge Base.

===== Relative Clauses (not included)

Deixiscript does not support realtive clauses, although a previous version of it did support them. The decision to drop their support and focus instead on other aspects of the noun phrase came from the difficulties encountered in their implementation.

// https://en.wikipedia.org/wiki/English_relative_clauses

A relative clause had to be introduced by a relativizer (such as: "that", "which", "who", etc) followed by a sentence. In English, the prevalent strategy to refer back to the nucleus (or head) of the enclosing noun phrase is that of "gapping", i.e.: leaving a "gap" in the place where the head would have stood had the relative clause been independent.

For example: the noun phrase "the fish that the cat ate" has a relative clause ("that the cat ate") with an apparently missing direct object (the fish). As an independent sentence it would have looked like this: "the cat ate _the fish_".

A possible implementation for this kind of relative clause involves substituting the head (in this example: "the fish") to the "gap" within the relative clause. The problem is that one has to know whether the verb that is used is transitive or not, to determine whether there is a gap in the sentence or not.

While this is not an insurmountable problem in principle (the transitivity of a verb can be deduced from its usage in the Definitions) we thought that this feature (relative clauses) was not too central to our goals. 

At the end of the day, the goal behind implementing noun phrases was to have a system to distinguish types from one another, to recognize some kinds of sub-type and compatibility relationships, and to pick out individuals from the world models based on their properties. For our basic prototyping purposes, one can get along well enough with the syntactic structures we have previously described (nouns, adjectives, genitives).

== Knowledge Base (KB)

We have repeatedly mentioned the "Knowledge Base", in the following paragraphs we will discuss the details behind this important component of the system. The Knowledge Base contains all of the state of the Deixiscript interpreter at any point in time, which comprises of: the World Model (WM), the lists of Definitions, Potentials and Orders (we will come to these latter ones later), and the Short Term Memory (STM).

=== World Model (WM)

As we already said, the world is modelled as individual entities (or "individuals") and their associated properties. An "individual" in the world model is nothing more than a bundle of properties stored in a dictionary (associative array) data structure. Any one of these individuals (or bundles of properties) must contain at least one essential property that we call "type". There is a list of these individuals, and the index in the list of an individual is its "ID". For instance, we could have a world model like this one (represented in JSON notation):

`[{"type":"cat", "color":"red", "age":10}, {"type":"cat", "claws":"sharp"}, {"type":"dog", "color":"brown"}]`

This world model contains three individuals (two cats and one dog), and describes the property "color" of the first cat (ID number 0) as "red" and the same property of the only dog (ID number 2) as "brown". The second cat (ID number 1) does not have a property "color" (or better yet: the model does not have any information about it) but it has a property "claws" set to the value "sharp". The first cat (the red one) also has a property "age" that is set to the value 10.

The "keys" are the names of the properties of the individuals ("type", "color", etc.) and they must be strings. The values assigned to the properties can be strings, numbers or Boolean values. One might also imagine to set the value of a property to an ID value (which is a distinct type in Deixiscript from the number type). 

Setting the value of a property to an ID type might be useful for those properties that involve a permanent bond (more stable than an emphemeral interaction during an Event) between two individuals.

This way of representing the world has its limitations. For example, given that the value of a property can only be a scalar constant (string, number, Boolean, and maybe ID) it cannot hold more than one value at a time, e.g. a cat cannot have two colors simultaneously (unless of course one decides to have both a "color-one" and a "color-two" properties, which would be two distinct properties anyway).

This limitation however (ensuring that any given property has one single value at a time) is useful for interfacing with the outside world (other programming languages and software tools) because they (the external tools) can more easily read values from the properties of individuals in the world model, for instance: to redraw a graphical component based on the state of the world model. 

An external tool could also write to the world model, for instance: to update the value of an input buffer after the user of a Deixiscript program enters some new input.

Another limitation put in place on the world model is this: the world model must not contain (at any time) any pair of individuals that are undistinguishable from their properties alone (and the ID, which is just an index in the list, does _not_ count as a property). 

Obviously, this must be enforced by a check that is made whenever a new individual is about to be created with some properties: the system checks whether there is already an individual with all of the mentioned properties in the world model, and displays an error in case it already does.

One might say that the system cannot "conceive" of any two "identical" individuals unless it (the system) knows of some actual (even slight) difference in their properties. The rationale behind this limitation is related to how the Short Term Memory (STM) works.

=== Short Term Memory (STM)

The Short Term Memory (STM) is a part of the Knowledge Base, its purpose is essentially to disambiguate the implicit references and pronouns that may be used by the programmer in a given context.

The STM behaves like a bounded queue (with some caveats as we will see). The STM can hold up to N (we experimented with N=4) noun phrases at any time, the size N of the STM should not be too big.

The system tries updating the STM whenever a "noun phrase is used by the programmer", but STM may have to remain unchanged in some cases. We will illustrate its behavior with a simple example: suppose that there are two cats, one with color=red and the other with color=black (the two individuals can co-exist in the same world model because they are considered to be distinct by one property); suppose also that the STM is initially empty.

When we (the programmers) say: "the cat", the system displays an error. This is because there are currently two individuals in the world model to whom the noun phrase "the cat" applies; furthermore, the STM is initially empty and it cannot provide any help (yet) at disambiguating this ambiguous phrase ("the cat").

So we try being more specific; suppose that we have already defined what it means for a cat to be red (as having the "color" property set to the value "red"), so we say: "the red cat", using an attributive adjective to narrow down on the individual we would like to talk about. Now the system does not display an error, because the noun phrase we used is precise enough to pick out one single entity unambiguously from the world model. The system also prepends the noun phrase "the red cat" at the head of the STM queue.

As a side-note, another limitation that was put in place, in the latest version of Deixiscript, was that a noun phrase can only "point to" a single individual at a time; in other words: a noun phrase may resolve at most to a single ID, given one state of the Knowledge Base. Previous versions of Deixiscript didn't have this limitation, but they had to check (for any sentence) if any of the noun phrases it contained would resolve to multiple IDs, and, if that was the case, "expand" the original sentence into multiple similar sentences each with a different ID. This also meant that noun phrases had to specify a cardinality (to distinguish singular from plural). //It would be interesting to 

Going back to the example we were making, now the STM contains the noun phrase "the red cat". Suppose we _now_ say "the cat". The system does not display any error, because it is now able to use the STM to disambiguate, i.e. the system will assume that we are referring to "the red cat" in the STM. It is worth noting that, in this case, the system will _not_ insert the ambiguous phrase we just used ("the cat") into the STM, because it already contains a more precise one i.e.: "the red cat".

Suppose we now say "the non-red cat" to the system. This will pick out the other cat in the world model, the one that does not have "red" as its color. The system will insert the new noun phrase "the non-red cat" into the queue; and, from now on, the ambiguous noun phrase "the cat" will be intended as "the non-red cat".

One can then mention again "the red cat" and the STM will be updated accordingly. When the STM grows to its maximum length, the oldest element (noun phrase) will be removed from the queue to make space for the newest one.

The STM is also useful for the resolution of pronouns. The stipulation here is that any pronoun must refer exclusively to some noun phrase that is currently in the STM. As we have said previously when talking about pronouns, a pronoun should be able to resolve differently based on the meaning of the sentence or phrase that surrounds it. 

The simple technique we are using to resolve pronouns is to try executing a sentence (or phrase) that contains a pronoun multiple times, each time after having substituted the pronoun with a different noun phrase taken from the STM (they are very few, owing to the STM's limited capacity). When the sentence (or phrase) finally works (does not produce an error) then we stop, and we consider the pronoun to be resolved. Of course, it may be that none of the noun phrases in the STM succeeds at making sense of the sentence containing a pronoun, in that case the system just displays an error stating that the pronoun is used ambigiously in that context.

== Syntactic Matching

Many of the higher-level operations we have talked about (using simple sentences, using adjectives, searching for relevant Definitions, etc.) depend on the functioning of a more basic low-level operation that we will call "match".

Matching any two noun phrases or any two sentences (or, more generally, any two AST objects even of different types) is a purely syntactic operation that does not depend on the context i.e.: it is completely independent of the state of the Knowledge Base.

=== The `match()` Function

Match is implemented as a function that takes two arguments: two Abstract Syntax Tree (AST) objects. The function `match()` is "non-symmetric" i.e., the order of the arguments matters, the function cannot be expected to return the same result when the two arguments are swapped around.

When comparing noun phrases, one of the arguments can be thought of as the "super-type" and the other can be regarded as the "sub-type" of the type comparison, to use some class-based programming jargon. For instance: when comparing the structure that represent the noun phrase "the cat" to the one that represents the noun phrase "the red cat", `match()` will return a "positive result" if "the cat" is used as the first argument (in the "super-type" position), this is because "the red cat" is regarded as a special case of "the cat".

Obviously, if the arguments are swapped around and "the red cat" takes the argument position reserved to the "super-type" the `match()` function returns a "negative result" ("the cat" is obviously _not_ a special case of "the red cat"). 

Used on noun phrases, the match function behaves very much like the "instanceof" operator of some object-oriented languages that produces a Boolean value based on the inheritance hierarchy of the operands. But what the match function actually returns is a mapping (an AST-to-AST dictionary), which is just empty in case of a "negative result".

This is because the two arguments of the match function are not (as we have already hinted to) limited to being noun phrases. They can be simple sentences, compound sentences, etc. The match function needs to return a mapping when comparing together two simple sentences (two Ideas), because the goal is to determine if the subject and the object of the more specific sentence (the "sub-type") can be substituted into the subject and object of the more general sentence (the "super-type").

It is also useful to allow different AST types to compare together, it makes sense for instance to able to compare a "genitive" noun phrase to an "implicit" phrase (they are treated as two different AST types as we have seen before).

It may also make sense to compare a compound sentence (techically an "and expression" or an "or expression") to a simple sentence (an Idea).

=== Definition Lookup

Syntactic matching plays a crucial role when the system needs to lookup the definition of an Idea. As we said, an Idea is the sort of AST that does not have an intrinsic meaning: it needs to be defined before it is used, and the Definitions are stored as a list in the Knowledge Base. Each Definition has two parts: a "definendum" (or left-hand side) and a "definition" (or "meaning", or right-hand side).

When an Idea has to be executed, the system goes through the list of Definitions and attempts to match the Idea to a definendum. If the end of the list is reached and no suitable match was found, the system displays an error, telling the programmer that the verb or predicate they have attempted to use is not defined for the given kinds of arguments (it may be defined for others).

If a suitable match is indeed found, then the search stops. The system takes the result of the match function (the dictionary or "mapping") and "plugs it into" the right-hand side of the Definition. 

To do this, a very simple function called "subst" is invoked. The function subst simply takes an "original AST" and an AST-to-AST dictionary, and substitues the keys of the dictionary with the values whenever it finds them on the "original AST" callings itself recursively.

When subst is done, the new AST that it produces is executed, this is akin to running the body of a function. This argument passing strategy is similar to "pass by name", which we discussed in the chapter on programming languages.

=== Specificity and Matching

A problem with this kind Definition lookup proceudre is this: suppose that the system needs to answer a question like: "the amphibious fish is dead?". Let us suppose that the Knowledge Base contains two Definitions for the predicate "is dead", the first Definition in the list generically applies to any kind of fish (i.e. "a fish is dead means ...") and the second applies specifically to amphibious ones.

Since an "amphibious fish" is a kind of "fish", then the question we are trying to answer ("the amphibious fish is dead?") will match the definendum of the first (general) Definition, the one that applies to a _generic_ kind of fish. This means that the amphibious fish will be (wrongly) treated as any other regular fish. 

The solution we adopted to this problem is to keep the list of Definitions sorted by descending "specificity" of the definendums. To do this, it is possible to define a special "compare function" to be used by the sorting algorithm. This compare function will return a positive number (+1) in case the first argument is more specific than the second, a negative number (-1) in case the opposite is true, and exactly zero in case the two arguments are completely equivalent (or completely unrelated, which makes no difference to the sorting logic).

The compare function we described can be readily built from the match function we previously talked about. One simply needs to invoke match twice, swapping the arguments around the second time, and comparing the two results as Booleans.

Sorting the list of Definitions by descending specificity of the definendums ensures that the most specific Definition will be found first, but only if a sentence that is specific enough is used.

The problem can still present itself if the noun phrase used is too generic for the actual shape of the object in the world model, however, it might be possible to overcome it for good by substituting ambiguous noun phrases by their more specific meaning in the STM before serching for a Definition. For instance, if we ask the system this questions: "the fish is dead?" the system may substitute the noun phrase "the fish" with the more specific noun phrase "the amphibious fish" (depending on the current state of the STM) before attempting to search for a definition of the predicate "is dead".

== Concrete Syntax

Now that we have formed a general idea (of most) of what the Deixiscript language is supposed to be (and before getting to the last aspect of Deixiscript, namely orders and planning) we wish to take a step back and give a short summary of the language's structure.

We have sometimes hinted at the concrete representation that the abstract syntactic structures would take, for instance we have said that Definitions and Potentials would end up looking like complex sentences. In general, the syntax draws inspiration from English; however, it includes some mathematical symbols (like most other programming languages) for the sake of convenience.

=== Backus-Naur Form (BNF)

Now we will present (a little more formally) the concrete syntax of the Deixiscript language, and to do so we will use a dialect of the popular Backus-Naur Form (BNF) metalanguage for syntax description, we have discussed BNF in a previous chapter when talking about ALGOL 60. 

The following presentation will omit some of the more technical details for the sake of clarity, the actual code that generates the parser is described in Lark's own dialect of BNF (Lark is the Python parsing toolkit we are using), and contains some extra caveats and technicalities compared to the following one.

==== Program

Firstly, any Deixiscript program contains at least a single statement, or more statements separated by a dot. We will express this in the equivalent BNF-like pseudo-code:

`<program> := <statement> | (<program> "." <statement>)`

==== Statement

A "statement" can be any of the following syntactic structures:

`<statement> := <expression> | <definition> | <potential> | <order> | <question> |<repetition> | <existential-quantifier>`

==== Expression

An "expression" is either a noun, or an idea or a binary expression:

`<expression> := <noun-phrase> | <idea> | <binary-expression>`

==== Question

A "question" is just a statement followed by a question mark, there is definitely room for improvement on this rule (as we already stated in a previous section):

`<question> := <statement> "?"`

==== Idea

An idea is a fact or an event; we wish to note that the distinction here is a purely syntactical one i.e., after an event or fact is parsed it is transformed into the same Idea abstract tree:

`<idea> := <event> | <fact>`

This is how an event looks like, it is basically an English simple sentence with only a subject and an optional object (the question mark after the second occurrence of the noun means that it is optional):

`<event> := <noun-phrase> <verb> <noun-phrase>?`

A fact instead looks like a simple sentence with a copular verb (i.e. the verb "to be" in English). The first noun phrase is the subject, the second is the predicative adjective, and the third is the (optional) object:

`<fact> := <noun-phrase> <copula> <noun-phrase> noun-phrase>?`

==== Binary Expression

A binary expression is two smaller expressions separated by a binary operator. The binary operator can be a logical operator ("and", "or"), a comparison operator (">", "<", etc.), an arithmetical operator ("+", "-", etc.) or the equal sign ("=") which (as already said) can be interpreted as an assignment or as an equality comparison depending on the surrounding syntactic context. 

The BNF code below shows the binary expression as a single production rule, but in practice it would be split into several similar-looking rules (logic, arithmetic, comparison, etc.) for the purpose of defining operator precedence:

`<binary-expression> := <expression> <binary-operator> <expression>`

==== Definition

A definition is quite simply an "idea" (a simple sentence) followed by the harcoded verb "to mean", followed by any expression (the "meaning"):

`<definition> := <idea> "means" <expression>`

==== Potential

A potential is a noun followed by the hardcoded modal verb "can", followed by any (non-copular) verb, followed by another (this time optional) noun (the direct object); there are two further optional parts of a potential: a duration in seconds and a condition (in no fixed order). If the condition expression (introduced by an "if") is not explicitly stated, it is assumed to be equal to the Boolean value "true" i.e., the action that the potential describes could be carried out unconditionally (at will, without constraints) by the relevant agent.

`<potential> := <noun-phrase> "can" <verb> <noun-phrase>? ["(" <number> "seconds" ")"] ["if" <expression>]`

==== Order

An order (which we will discuss in a later section) is composed of a noun (the agent who receives the order), the harcoded verb phrase "should ensure" and an expression (the agents "goal").

`<order> := <noun-phrase> "should ensure" <expression>`

==== Repetition

A repetition statement is not really recessary (and we had not really mentioned it before now), but we decided to add it just for convenience; it consists of an idea (a simple sentence) followed by a number, followed by the harcoded word "times". A repetition, exactly as the name says, repeats an action a certain number of times, like in a loop.

`<repetition> := <idea> <number> "times"`

==== Noun Phrase

A noun phrase can be any of the following things:

`<noun-phrase> := <constant> | <noun> | <article-phrase> | <genitive-phrase> | <attributive-phrase> | <pronoun> | <variable> | <number> | <parenthesized-phrase>`

Constants are numbers, strings or Booleans; the ID type is not shown here because in principle it should not be accessible to the programmer (the ID of an individual is supposed to be used internally by the system) though the system could be easily extended to include a syntax for an "ID literal" which could be useful for debugging purposes:

==== Constant
  
`<constant> := <number> | <string> | <boolean>`

A `<noun>` is just a simple, basic English noun (actually any "non-verb word") among the ones that the parser recognizes. By itself, it is actually just treated as a string, and could in fact be considered a constant.

==== Article Phrase

A "real" noun (i.e. an implicit reference) is preceded by an English article (definite or indefinite); this is the kind of noun that will resolve to an ID when evaluated by the system:

`<article-phrase> := <article> <noun-phrase>`

An "attributive phrase" adds an adjective to that kind of noun phrase. The adjective itself is another single noun, and can be preceded by a negative particle ("non"):

==== Attributive Phrase

`<attributive-phrase> := "non-"? <noun> <noun-phrase>`

A "genitive phrase" contains a noun phrase followed by a genitive particle ("apostrophe s") and a simple noun.

==== Genitive Phrase

`<genitive-phrase> := <noun-phrase> "'s" <noun>`

==== Parenthesized Phrase

And finally, a "parenthesized phrase" is also a noun phrase, and it consists of an expression enclosed by parentheses. It can be useful to better specify the order of evaluation in mathematical formulas and the like:

`<parenthesized-phrase> := "(" <expression> ")"`

=== AST Transformations

As we have said, we use the Lark parsing toolkit for Python to parse a concrete syntax similar to the one we have just described. Parsing is just the process of converting a linear (monodimensional) representation of language (i.e. written text, or even spoken sound) into a bidimensional, tree-like structure that clearly reflects the hierarchical relationship between the expression's constituents.

Parsing however is just the first step of this process, after an initial (intermediate) "parse tree" is generated, this is in turn converted (transformed) into an abstract syntax tree, which is a more convenient and easier to work with representation of the latter, as it leaves out many of the unimportant details.

These "unimportant details" may specify whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) one.

Another example of "unimportant detail" may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user-intended) precendence of operators.

Lark provides some useful facilities to further transform the parse trees it generates into abstract syntax trees. The "Transformer" class it provides (completely unrelated to the "Transformer" neural network architecture in AI) performs a bottom up traversal of the parse tree, allowing us to define some further logic that converts the parse tree into a proper abstract syntax tree.

// ------

We have seen how it is possible to add Definitions that determine the effects of executing a simple sentence; this makes the execution of a simple sentence akin to a "function" (or rather: a procedure) invocation in more traditional languages.

// contra CAL
However, one must also keep in mind that any sentence may be subject to two interpretations (the "ASK" mood and the "TELL" mood, also mentioned previously), with the difference that the former ("ASK") thinks of the function as a "getter" or "predicate" i.e., it tries to verify if a condition is true in the world model, and the latter ("TELL") is the mood that actively changes the world model according to a sentence's Definition.

This duality makes sense for Facts (the same Fact can be "checked" or can be "learned" by the world model), but it makes a little less sense for Events. As we have already said, an Event in Deixiscript (although it has a duration) is still modelled as an ephemeral, transitional concept, so the "ASK" mood (which presumes a static state of affairs in the world model) does not make sense applied to an Event.

As we have stated though, Facts and Events in Deixiscript are basically represented by the same underlying structure (the Idea), so an Event might indeed risk getting executed in ASK mood. One could add a check to make sure this does not happen, however, we are relying on the programmer's understanding of the difference between Facts and Events, and on the syntactic distinction (between copular simple sentences and simple sentences with a regular verb) to make sure this does not happen.

Given the analogy we have made with procedure Definitions, and despite the actual "dual" nature (ASK versus TELL) of a Deixiscript statement, one could nonetheless conclude that Deixiscript is a kind of procedural (or imperative) language.

In a way this is true, one can even define the meaning of a simple sentence as a sequence of steps, this can be achieved by joining together (through the `and` operator) multiple atomic statements (like simple sentences or variable assignments). The comma symbol (',') can also be used for the same purpose, and it behaves exactly like (indeed, it is aliased to) the `and` operator.

This however would overlook the last aspect of the language that we still have not really explained: automatic planning. 

// Orders and Planning
// http://www.cs.toronto.edu/~hector/pcr.html
// https://github.com/ssardina/ergo
// https://en.wikipedia.org/wiki/Agent-oriented_programming
// cognitive robotics precedent

// syntactic compression
// Example program
// problems
// conclusions

// ------------------------------------------------------------------------------

// recall
// === Complex Sentences

// We mentioned the fact that complex sentences allow the speaker to express a relation of subordination between two ideas; and we mentioned the philosophical distinction between "analytic" (or "a priori") and "synthetic" (or "a posteriori") knowledge, and how a valid option to verbalize this kind of knowledge in natural language is indeed through the use of a complex sentence. We think that two useful parallels with the domain of programming can be drawn here.

// The question of whether "analytic" and "synthetic" knowledge really exhaust all of human knowledge is an open issue in philosophy; and there are indications that this is not the case, specifically in the existence of unfalsifiable (like analytic) knowledge that nontheless depends on real world experience (like synthetic), for instance the general notion that "things change"; this third kind of knowledge can't be neatly classified in the binary scheme presented to us by the analytic/synthetic distinction. But regardless of this problem with the distinction, we will assume that all of the knowledge contained in a computer program falls exclusively under one of these two categories.

// When it comes to a priori knowledge, we think that a computer program essentially presents us with defintions: function definitions, type definitions, class definitions; these are all examples of abstractions that the programmer essentially creates for their own comfort: to avoid having to repeat themselves and hence to improve code maintainability; the interpreter or compiler needs to know that when we say `abs(x)` we really mean `-x if x<0 else x`, but it would just as well directly accept `-x if x<0 else x`, or the equivalent machine code.

// On the other hand, we believe that the a posteriori knowledge contained in a program essentially corresponds with the "useful work" done by it, this knowledge is more correlated to the side-effects, intended as the desired output or external behavior of the program: it describes them. A perfect example of this, we think, are event handlers in an Event Driven programming language, when a programmer adds an event handler to a program (eg: "when the button is clicked, the counter increments"), they are essentially teaching the environment a new cause-and-effect relationship. You may also say that they are teaching it to react with a certain response to a given stimulus, or that they are teaching it to expect a certain kind of event to take place after another.

// // ----------------

// // // Edward Sapir (1884-1939) linguist famous for the Sapir-Whorf hypothesis on linguistic relativity once wrote: 

// // // Were a language ever completely "grammatical" it would be a perfect engine of  conceptual expression. Unfortunately, or luckily, no language is tyrannically consistent. All grammars leak @sapir1921language.
