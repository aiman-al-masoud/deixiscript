

= Deixiscript

We will refer to the computer language developed in the present work and described in the following pages with the name: "Deixiscript". The name is a protmonteau of the words: Deixis (a linguistic concept related to indexicality) and Script (on the model of many other programming language names).

As is clear, our goal has never been to implement a production-grade programming environment (which would require many more man-months of effort and a higher level of practical expertise in the field of language implementation). Our goal was rather to build a working prototype of a naturalistic language, taking inspiration from the existing ones on the "market", and experimenting with some novel features which we shall discuss.

== Implementation Details

=== Language

The implementation language is Python 3 (specifically version 3.10 or higher), annotated with type-hints and type checked by the Pyright static type checker. Unit tests are performed with the help of the Pytest testing framework.

We think that the Python language offers great advantages for prototyping, due to its flexibility and regularity and due to the aboundance of third-party libraries that help perform a wide variety of tasks.

=== Parser

The Lark parsing toolkit for Python is used for the front end of the interpreter: to turn the strings of source code into parse trees and to further apply some transformations and obtain Abstract Syntax Trees (ASTs), which the interpreter can process.

=== Graphical Tools

The Graphviz graph visualization software and relative Python wrapper are used as a testing tool, to visually inspect the world models produced as a side effect of the interpreter's operation.

// https://www.pygame.org/docs/tut/PygameIntro.html
The Pygame library for interactive multimedia and game creation was used to show the evolution of some simulated processes graphically.

=== Licensing

All of the software used to develop Deixiscript is available for free and under the terms of an open source license (MIT for Pyright, Pytest, and Lark, CPL for Graphviz,  GNU LGPL version 2.1 for Pygame). Other than the aforementioned ones, the core components of Deixiscript require no further dependencies beyond Python's own standard library.

Deixiscript itself is free software, and will be made available under the terms of the GPLv3 license by the time this document is published. We will suggest some possible further developments to the language in a later section of this work.

=== Functional Style

Regarding the code's style, an effort was made to follow (when possible) the Functional Paradigm's approach of data-immutability and function (or method) purity.

We perceive that the advantage gained from following this style was a more predictable semantics in the business-logic. Most method calls do not modify an object directly: they return a copy of it if need be. This immutability of objects reduces the chances of an unforeseen side-effect happening (an unpredicted state mutation within an object which can be a cause for bugs).

On the other hand, the disadvantage of this approach is that method return types can become a little too elaborate, because due to the lack of side-effects all changes have to be propagated through this mechanism (function returns).

=== Interpreter Pattern

The classes that represent the Abstract Syntax Trees (ASTs) follow the Interpreter Pattern, one of the well-known 23 GoF Software Design Patterns for OOP languages.

Alternative approaches were tried (using a single, or multiple, eval function(s)) but the polymorphic nature of the Interpreter Pattern offers a higher degree of flexibility, also considering the fact that Python functions cannot be overloaded (unless done manually).

The Interpreter Pattern defines a common interface (called "AST") with at least one method (usually called "eval", short for "evaluate"). The classes that implement the AST interface can either be "leafs" or "composites". A leaf (such as a number, a string, or a boolean literal) are typically constants, which means they always evaluate to themselves.

Examples of composite types can be: an arithmetic expression, a logic expression, a function definition, a function invocation (or almost anything else one can think of, for that matter). A composite type typically evaluates its "children" first, then combines them however its logic dictates into a new evaluation result.

The common interface ensures that all of the AST objects can be evaluated the same way: by calling the "eval" method and passing it as an argument the operating context (known as "environment", or "state").

The "eval" method is expected to return the result of the evaluation of the AST object and to write the changes produced by its evaluation (if any) to the environment.

In our case, since we are following a Functional approach, the eval method returns a new object that contains the updated context without changing the original.

== Evolution of Deixiscript

Our idea of what the language had to be (and how it had to be implemented) has changed and evolved significantly throughout the arc of time we had at our disposal. During this period of time we have explored many different ideas, not all of them have made it into the final implementation.

We initially started out with the vague notion of translating basic sentences in natural language to predicate logic (specifically Prolog) clauses, which could be then executed on a Prolog interpreter as either questions or statements. We eventually decided to change strategy when we realized that the process of translation was a little more involved than expected, and that the full power of Prolog's predicate logic was perhaps not really needed for our more modest purposes.

After this initial experiment with predicate logic, we were initially inclined to go back to a more object-oriented approach, attaching both data and behavior to the entities in the world model; however, this comes with its own set of problems. We discussed some of these problems when we talked about Inform 7's approach in a previous chapter.

We where then inspired by projects like Pegasus and by readings such as the book "Machines Like Us" (which we discussed in previous chapters) to take a more "rule-based" approach (though we still hadn't read about Inform 7's implementation to know it was called like that).

As it stands, the current "version" of Deixiscript adopts a kind of rule-based programming. This makes types a little more flexible than classes, because they do not have to be declared as rigidly (or linked to their behavior as tightly) as in class-based programming. 

In the pages that follow, we will describe the current version of Deixiscript, motivating some of the choices that were made and the philosophy behind them. Since Deixiscript is an English-based language, what follows will also incorporate a brief discussion of some (basic) aspects of the English grammar.

// ------------------

We begin from what we think is a central concept in any language (natural or artificial), and that is: propositions and their concrete representation. We came across propositions when discussing logic programming in a previous chapter; as we saw, in predicate logic propositions are represented by Well-Formed Formulas. In natural language, on the other hand, propositions are typically represented by sentences. In English, a sentence can be simple, compound or complex.

=== Simple Sentences

A common example of a simple sentence in English is: "the quick brown fox jumps over the lazy dog". A simple sentence can contain: a subject ("the quick brown fox"), a verb ("jumps"), a direct object (none in this case, since "jump" is typically used as an intransitive verb), and any number of complements ("the lazy dog" could be considered as the "location" of the fox's jump).

The complements of a sentence can help specify the location or time of an action, they can also correspond to any other actors directly or indirectly involved in the action. In English, complements are generally introduced after a preposition such as: "over" (from the example), "to", "from", "by", and so on.

The direct object of a sentence is a little special in English (and many other modern European languages) because, just like the subject, it is not preceded by any preposition. The subject and the object are generally distinguished by their order of appearance in the sentence (the subject typically precedes the object).

Unlike English, some languages (even some modern Indo-European languages) rely more heavily on "case-markings" rather than prepositions and word-order to express grammatical relationships. A case-marking is typically a word inflection (such as a suffix, a prefix or an infix). In many such languages, English's "direct object" corresponds to an inflected noun in the "accusative case".

A vestige of this grammatical case-system (which English inherited from an older proto-language) remains in modern English's personal pronouns, for instance: "I/he/she" are "nominative" (the grammatical case of the subject), "me/him/her" are "accusative" (the grammatical case of the direct object) or "dative" (e.g.: "I give _him_ the book").

In any case, the verbs that require a direct object are known as transitive verbs, for instance the verb "to eat" in the sentence: "the cat eats fish", where "fish" is the direct object. Some verbs do not require a direct object, such verbs are known as intransitive verbs, the verb "to exist" is an example of an intransitive verb in English.

Some verbs are traditionally regarded as optionally accepting two direct objects and are known as ditransitive verbs, such as the verb "to make" in the sentence: "the senate made him consul".

Some other verbs can be seen as requiring no subject at all, and are known as impersonal verbs, such as the verb "to rain" in the sentence "it rains". Since English always (syntactically) requires the subject slot to be filled, except in informal speech, the existence of such verbs isn't so obvious as in other languages which can drop the subject, such as Italian where the translation of the example sentence above would be just "piove", without any visible subject.

Some simple sentences in English can have no verb at all: verbless sentences can be seen as alternative forms of an equivalent sentence with a verb, and are typically used for the sake of brevity or to achieve some special rethorical effect, common examples include exclamations such as: "good job!" in lieu of "you did a good job!" or "excellent choice!" in place of: "this is an excellent choice you are making!"

=== Compound Sentences

A compound sentence is a sentence made up of two or more simple or compound sentences joined together by a conjunction or disjunction. An example is: "the cat meowed loud, but she failed to obtain food"; it is important to note that the two simple sentences incorporated in the larger compound sentence remain "independent" of each other: you can rephrase the previous sentence by changing their order and the meaning is logically equivalent (if you ignore the time factor, at least).

=== Complex Sentences

A complex sentence creates a relation of dependence between two simple sentences, in the example: "the cat failed to obtain food, because she didn't meow loud enough" the two simple sentences cannot be swapped around without changing the logical meaning of the statement. The word "because" is a subordinating conjunction, and in this example it serves to highlight a cause-and-effect relationship between two actions of the cat (meowing loud and obtaining food).

But cause-and-effect relationships aren't the only kind of relationships that can be expressed by a complex sentence; take the example: "the man is a bachelor, because he isn't married", the linguistic structure is similar but the idea is a little different: this is an example of what is known in philosophy as "analytic" or "a priori" knowledge, it isn't knowledge of the laws (observable regularities) that govern the world, but rather of the meanings of the words "bachelor" and "married" and the necessary (and somewhat trivial) relationship between them.

// -----------------

A choice was made in Deixiscript to limit the maximum number of "slots" of a verb in a sentence to only two: a (necessary) subject and an (optional) direct object. The language could be easily extended to include more (optional) complements in a sentence (older "versions" of the language had them indeed), but we chose to avoid them at the end because they may be more confusing than helpful at this stage (how many prepositions do we have to support? Is "in" a synonym of "on"?) and because binary relations (subject, direct object) are already quite powerful and allow one to express a large range of ideas. // cite inform 7

So a proposition (or "Idea") in Deixiscript has: a (necessary) subject, a (necessary) predicate (we will come to this later) and an (optional) object.

From now on, we will speak of "simple sentences", of "Ideas" and of "propositions" almost interchangeably in the context of the Deixiscript language, while keeping in mind that: a proposition is really an abstract (mental) concept, that an English simple sentence is best thought of as a feature of the (concrete) syntax of the English language, and that an "Idea" (as we are using the term) is an element of the abstract syntax (i.e. an Abstract Syntax Tree type) of our implementation of the Deixiscript language. 

Also, we must keep in mind that a proposition is the meaning of any sentence (not just simple sentences), hence the term "atomic proposition" would be more appropriate when referring to the meaning represented by a Deixiscript "Idea" specifically.

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

// ----------

Up until now, we have always generically talked about the "subject" and the "object" of a simple sentence, we will now take some time to explain what we mean by those terms.

In English, the subject and the object of a sentence are "noun phrases". A phrase is a syntactic structure that does not express a complete thought; in particular: a noun phrase is a phrase that performs the same function as a noun.

A general test for whether a part of a sentence counts as a noun phrase is to replace it with a pronoun and to see if the sentence still makes sense; for instance in the sentence "the quick brown fox jumps over the lazy dog" there are two noun phrases: "the quick brown fox" and "the lazy dog", the sentence's structure is equivalent to: "_it_ jumps over the lazy dog" or "the quick brown fox jumps over _it_", or even "_it_ jumps over _it_".

A linguistic head (or nucleus) of a phrase is the part that determines the syntactic category of that phrase, in the case of a noun phrase the head would be a noun (or any smaller noun phrase). In the noun phrase "the lazy dog" the head is "dog".

A key insight from the study of natural language, is that people rarely ever use explicit references (proper nouns, IDs, numbers...) even when talking about individual entities @the80s; they instead make use of the "type" of these individual entities (common nouns) leveraging a phenomenon known as the indexicality of language. 

For instance, if a person refers to "the cat" when they're at home, versus "the cat" when they're visiting a zoo (a different "context"), they may be referring to two very different individuals (a house cat vs a mountain lion, for example). But the phrase they may decide to use in both cases is the same: "the cat".

A noun phrase can be of arbitrary length, and of arbitrary precision (and thus include/exclude a higher number of individuals), the most trivial example is given by a single noun all by itself (e.g.: "cat"), but a noun phrase also typically includes articles, adjectives and even relative clauses with any arbitrary level of nesting, e.g.: "the agile calico cat that leaped on top of my desk holding a fresh kill (which she wanted me to have as a gift) in its fangs".

The kinds of noun phrases supported by Deixiscript are: constants (numbers, strings, Booleans and IDs), "implicit phrases", "genitive phrases", pronouns and variables.

Numbers, strings and Booleans work just like they do in any other programming language. IDs are mainly there for the system's own benefit (we will discuss them further when talking about the world model) and are not accessible to the user of the language. Variables are placeholders names ("x","y" and "z") that match any type, they can be useful when writing some kinds of general Definitions.

What we call "implicit phrases" comprise of a noun and a list of adjectives. A noun is just a string representing a type (which doesn't have to be declared explicitly). The adjectives do not carry an intrinsic meaning, they are tied to the adjectives used in Ideas (simple sentences) we discussed earlier.

An adjective in a noun phrase is referred to as an "attributive" adjective, whereas an adjective in a sentence with a copula is referred to as a "predicative" adjective. In Deixiscript there is an equivalence between the two: once the meaning of an adjective is defined as a predicative adjective in a simple sentence (e.g.: "the cat is calico, means..."), it can be used as an attributive adjective in a noun phrase (e.g.: "the calico cat"). An attributive adjective can also be negated (e.g.: "a non-calico cat").

What we call a "genitive phrase" is a noun phrase that refers to a property of an individual rather than to an individual itself. Syntactically, it is in the form:  "an individual's property" or "x's y" (using English's Saxon Genitive). It is also possible to implement an equivalent form using the preposition "of".

We think that "possession" is an important part of how we model the world. All of the "useful work" that the system really does (everything it boils down to) is setting the value of properties on the dictionary-like data structures the system internally uses to represent "individuals". It is precisely because of this internal representation that the system is able to interface with the outside world (other programming languages, tools and libraries). We will come back to this idea later when discussing the Knowledge Base and World Model.

The last kind of noun phrase we mentioned is the pronoun. This is perhaps the most elusive kind of syntactical element that we take for granted in natural language, but that is actually not so easy to approximate (with a hundred percent accuracy) in an artificial language.

A personal pronoun (e.g.: "I", "you", "he/she", "it", etc) is a specific instance of a linguistic phenomenon known as "deixis". The "deictic" words are highly context-dependent words whose true meaning depends almost entirely on the state of the speaker who uses them. Deixis can be spatial (in words such as: "here", "there"), temporal (in words like: "yesterday", "before", "after") or personal (in words such as the personal pronouns).

Deixiscript really only supports one kind of pronoun (third person singular). Pronouns in Deixiscript are a little special for another reason: they are the only kind of noun phrase that needs some external context to evaluate.

We have already talked about how a simple sentence (Idea) may be treated as a conditional expression or as a statement with side-effects depending on the surrounding (syntactic) context (e.g.: the simple sentence "it is snowing" enclosed in the larger complex sentence: "if _it is snowing_ you put on a heavy coat"), but this is technically easier to achieve: the object that represents the larger syntactic structure (the complex sentence) _knows_ that its own conditional part has to be evaluated in "ASK" mood and not in "TELL" mood.

On the other hand, with a pronoun that behaves somewhat "realistically", one should reserve the right to resolve the pronoun in different ways (to different concrete referents) based on the meaning of the surrounding context (the simple sentence that embeds the pronoun). 

For instance: "the cat saw a table, and it jumped on it", it is obvious that the first instance of the pronoun "it" refers to "the cat" and that the second one refers to "the table", because we live in a world were cats are the sort of entities that can jump on tables, and not vice versa.

Deixiscript supports a limited kind of context-dependent resolution of pronouns,  based on the Short Term Memory (STM) of the interpreter and the stored Definitions of the simple sentences, we will discuss the STM later alongside the Knowledge Base.

Deixiscript does not support realtive clauses, although a previous version of it did support them. The decision to drop their support and focus instead on other aspects of the noun phrase came from the difficulties encountered in their implementation. 

// https://en.wikipedia.org/wiki/English_relative_clauses

A relative clause had to be introduced by a relativizer (such as: "that", "which", "who", etc) followed by a sentence. In English, the prevalent strategy to refer back to the nucleus (or head) of the enclosing noun phrase is that of "gapping", i.e.: leaving a "gap" in the place where the head would have stood had the relative clause been independent.

For example: the noun phrase "the fish that the cat ate" has a relative clause ("that the cat ate") with an apparently missing direct object (the fish). As an independent sentence it would have looked like this: "the cat ate _the fish_".

A possible implementation for this kind of relative clause involves substituting the head (in this example: "the fish") to the "gap" within the relative clause. The problem is that one has to know whether the verb that is used is transitive or not, to determine whether there is a gap in the sentence or not.

While this is not an insurmountable problem in principle (the transitivity of a verb can be deduced from its usage in the Definitions) we thought that this feature (relative clauses) was not too central to our goals. 

At the end of the day, the goal behind implementing noun phrases was to have a system to distinguish types from one another, to recognize some kinds of sub-type and compatibility relationships, and to pick out individuals from the world models based on their properties. For our basic prototyping purposes, one can get along well enough with the syntactic structures we have previously described (nouns, adjectives, genitives).

// --------------------

We have repeatedly mentioned the "Knowledge Base", in the following paragraphs we will discuss the details behind this important component of the system. The Knowledge Base contains all of the state of the Deixiscript interpreter at any point in time, which comprises of: the World Model (WM), the lists of Definitions, Potentials and Orders (we will come to these latter ones later), and the Short Term Memory (STM).

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

// ----------------

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

// ------------

Many of the higher-level operations we have talked about (using simple sentences, using adjectives, searching for relevant Definitions, etc.) depend on the functioning of a more basic low-level operation that we will call "match".

Matching any two noun phrases or any two sentences (or, more generally, any two AST objects even of different types) is a purely syntactic operation that does not depend on the context i.e.: it is completely independent of the state of the Knowledge Base.

Match is implemented as a function that takes two arguments: two Abstract Syntax Tree (AST) objects. The function "match" is "non-symmetric" i.e., the order of the arguments matters, the function cannot be expected to return the same result when the two arguments are swapped around.

When comparing noun phrases, one of the arguments can be thought of as the "super-type" and the other can be regarded as the "sub-type" of the type comparison, to use some class-based programming jargon. For instance: when comparing the structure that represent the noun phrase "the cat" to the one that represents the noun phrase "the red cat", "match" will return a "positive result" if "the cat" is used as the first argument (in the "super-type" position), this is because "the red cat" is regarded as a special case of "the cat".

Obviously, if the arguments are swapped around and "the red cat" takes the argument position reserved to the "super-type" the "match" function returns a "negative result" ("the cat" is obviously _not_ a special case of "the red cat"). 

Used on noun phrases, the match function behaves very much like the "instanceof" operator of some object-oriented languages that produces a Boolean value based on the inheritance hierarchy of the operands. But what the match function actually returns is a mapping (an AST-to-AST dictionary), which is just empty in case of a "negative result".

This is because the two arguments of the match function are not (as we have already hinted to) limited to being noun phrases. They can be simple sentences, compound sentences, etc. The match function needs to return a mapping when comparing together two simple sentences (two Ideas), because the goal is to determine if the subject and the object of the more specific sentence (the "sub-type") can be substituted into the subject and object of the more general sentence (the "super-type").

It is also useful to allow different AST types to compare together, it makes sense for instance to able to compare a "genitive" noun phrase to an "implicit" phrase (they are treated as two different AST types as we have seen before).

It may also make sense to compare a compound sentence (techically an "and expression" or an "or expression") to a simple sentence (an Idea).

Syntactic matching plays a crucial role when the system needs to lookup the definition of an Idea. As we said, an Idea is the sort of AST that does not have an intrinsic meaning: it needs to be defined before it is used, and the Definitions are stored as a list in the Knowledge Base. Each Definition has two parts: a "definendum" (or left-hand side) and a "definition" (or "meaning", or right-hand side).

When an Idea has to be executed, the system goes through the list of Definitions and attempts to match the Idea to a definendum. If the end of the list is reached and no suitable match was found, the system displays an error, telling the programmer that the verb or predicate they have attempted to use is not defined for the given kinds of arguments (it may be defined for others).

If a suitable match is indeed found, then the search stops. The system takes the result of the match function (the dictionary or "mapping") and "plugs it into" the right-hand side of the Definition. 

To do this, a very simple function called "subst" is invoked. The function subst simply takes an "original AST" and an AST-to-AST dictionary, and substitues the keys of the dictionary with the values whenever it finds them on the "original AST" callings itself recursively.

When subst is done, the new AST that it produces is executed, this is akin to running the body of a function. This argument passing strategy is similar to "pass by name", which we discussed in the chapter on programming languages.

A problem with this kind Definition lookup proceudre is this: suppose that the system needs to answer a question like: "the amphibious fish is dead?". Let us suppose that the Knowledge Base contains two Definitions for the predicate "is dead", the first Definition in the list generically applies to any kind of fish (i.e. "a fish is dead means ...") and the second applies specifically to amphibious ones.

Since an "amphibious fish" is a kind of "fish", then the question we are trying to answer ("the amphibious fish is dead?") will match the definendum of the first (general) Definition, the one that applies to a _generic_ kind of fish. This means that the amphibious fish will be (wrongly) treated as any other regular fish. 

The solution we adopted to this problem is to keep the list of Definitions sorted by descending "specificity" of the definendums. To do this, it is possible to define a special "compare function" to be used by the sorting algorithm. This compare function will return a positive number (+1) in case the first argument is more specific than the second, a negative number (-1) in case the opposite is true, and exactly zero in case the two arguments are completely equivalent (or completely unrelated, which makes no difference to the sorting logic).

The compare function we described can be readily built from the match function we previously talked about. One simply needs to invoke match twice, swapping the arguments around the second time, and comparing the two results as Booleans.

Sorting the list of Definitions by descending specificity of the definendums ensures that the most specific Definition will be found first, but only if a sentence that is specific enough is used.

The problem can still present itself if the noun phrase used is too generic for the actual shape of the object in the world model, however, it might be possible to overcome it for good by substituting ambiguous noun phrases by their more specific meaning in the STM before serching for a Definition. For instance, if we ask the system this questions: "the fish is dead?" the system may substitute the noun phrase "the fish" with the more specific noun phrase "the amphibious fish" (depending on the current state of the STM) before attempting to search for a definition of the predicate "is dead".

// --------

Now that we have formed a general idea (of most) of what the Deixiscript language is supposed to be (and before getting to the last aspect of Deixiscript, namely orders and planning) we wish to take a step back and give a short summary of the language's structure.

We have sometimes hinted at the concrete representation that the abstract syntactic structures would take, for instance we have said that Definitions and Potentials would end up looking like complex sentences. In general, the syntax draws inspiration from English; however, it includes some mathematical symbols (like most other programming languages) for the sake of convenience.

Now we will present (a little more formally) the concrete syntax of the Deixiscript language, and to do so we will use a dialect of the popular Backus-Naur Form (BNF) metalanguage for syntax description, we have discussed BNF in a previous chapter when talking about ALGOL 60. 

The following presentation will omit some of the more technical details for the sake of clarity, the actual code that generates the parser is described in Lark's own dialect of BNF (Lark is the Python parsing toolkit we are using), and contains some extra caveats and technicalities compared to the following one.

Firstly, any Deixiscript program contains at least a single statement, or more statements separated by a dot. We will express this in the equivalent BNF-like pseudo-code:

`<program> := <statement> | (<program> "." <statement>)`

A "statement" can be any of the following syntactic structures:

`<statement> := <expression> | <definition> | <potential> | <order> | <question> |<repetition> | <existential-quantifier>`

An "expression" is either a noun, or an idea or a binary expression:

`<expression> := <noun-phrase> | <idea> | <binary-expression>`

A "question" is just a statement followed by a question mark, there is definitely room for improvement on this rule (as we already stated in a previous section):

`<question> := <statement> "?"`

An idea is a fact or an event; we wish to note that the distinction here is a purely syntactical one i.e., after an event or fact is parsed it is transformed into the same Idea abstract tree:

`<idea> := <event> | <fact>`

This is how an event looks like, it is basically an English simple sentence with only a subject and an optional object (the question mark after the second occurrence of the noun means that it is optional):

`<event> := <noun-phrase> <verb> <noun-phrase>?`

A fact instead looks like a simple sentence with a copular verb (i.e. the verb "to be" in English). The first noun phrase is the subject, the second is the predicative adjective, and the third is the (optional) object:

`<fact> := <noun-phrase> <copula> <noun-phrase> noun-phrase>?`

A binary expression is two smaller expressions separated by a binary operator. The binary operator can be a logical operator ("and", "or"), a comparison operator (">", "<", etc.), an arithmetical operator ("+", "-", etc.) or the equal sign ("=") which (as already said) can be interpreted as an assignment or as an equality comparison depending on the surrounding syntactic context. The code below shows the binary expression as a single production rule, but in practice it would be split into several similar-looking rules (logic, arithmetic, comparison, etc.) for the purpose of defining operator precedence:

`<binary-expression> := <expression> <binary-operator> <expression>`

A definition is quite simply an "idea" (a simple sentence) followed by the harcoded verb "to mean", followed by any expression (the "meaning"):

`<definition> := <idea> "means" <expression>`

A potential is a noun followed by the hardcoded modal verb "can", followed by any (non-copular) verb, followed by another (this time optional) noun (the direct object); there are two further optional parts of a potential: a duration in seconds and a condition (in no fixed order). If the condition expression (introduced by an "if") is not explicitly stated, it is assumed to be equal to the Boolean value "true" i.e., the action that the potential describes could be carried out unconditionally (at will, without constraints) by the relevant agent.

`<potential> := <noun-phrase> "can" <verb> <noun-phrase>? ["(" <number> "seconds" ")"] ["if" <expression>]`

An order (which we will discuss in a later section) is composed of a noun (the agent who receives the order), the harcoded verb phrase "should ensure" and an expression (the agents "goal").

`<order> := <noun-phrase> "should ensure" <expression>`

A repetition statement is not really recessary (and we had not really mentioned it before now), but we decided to add it just for convenience; it consists of an idea (a simple sentence) followed by a number, followed by the harcoded word "times". A repetition, exactly as the name says, repeats an action a certain number of times, like in a loop.

`<repetition> := <idea> <number> "times"`

A noun phrase can be any of the following things:

`<noun-phrase> := <constant> | <noun> | <article-phrase> | <genitive-phrase> | <attributive-phrase> | <pronoun> | <variable> | <number> | <parenthesized-phrase>`

Constants are numbers, strings or Booleans; the ID type is not shown here because in principle it should not be accessible to the programmer (the ID of an individual is supposed to be used internally by the system) though the system could be easily extended to include a syntax for an "ID literal" which could be useful for debugging purposes:
  
`<constant> := <number> | <string> | <boolean>`

A `<noun>` is just a simple, basic English noun (actually any "non-verb word") among the ones that the parser recognizes. By itself, it is actually just treated as a string, and could in fact be considered a constant.

A "real" noun (i.e. an implicit reference) is preceded by an English article (definite or indefinite); this is the kind of noun that will resolve to an ID when evaluated by the system:

`<article-phrase> := <article> <noun-phrase>`

An "attributive phrase" adds an adjective to that kind of noun phrase. The adjective itself is another single noun, and can be preceded by a negative particle ("non"):

`<attributive-phrase> := "non-"? <noun> <noun-phrase>`

A "genitive phrase" contains a noun phrase followed by a genitive particle ("apostrophe s") and a simple noun.

`<genitive-phrase> := <noun-phrase> "'s" <noun>`

And finally, a "parenthesized phrase" is also a noun phrase, and it consists of an expression enclosed by parentheses. It can be useful to better specify the order of evaluation in mathematical formulas and the like:

`<parenthesized-phrase> := "(" <expression> ")"`

// ---------

As we have said, we use the Lark parsing toolkit for Python to parse a concrete syntax similar to the one we have just described. Parsing is just the process of converting a linear (monodimensional) representation of language (i.e. written text, or even spoken sound) into a bidimensional, tree-like structure that clearly highlights the hierarchical relationship between the expression's constituents.

Parsing however is just the first step of this process, after an initial (intermediate) "parse tree" is generated, this is in turn converted (transformed) into an abstract syntax tree, which is a more convenient and easier to work with representation of the latter, as it leaves out many of the unimportant details.

These "unimportant details" may specify whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) one.

Another example of "unimportant detail" may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user-intended) precendence of operators.

Lark provides some useful facilities to further transform the parse trees it generates into abstract syntax trees. The "Transformer" class it provides (completely unrelated to the "Transformer" neural network architecture in AI) performs a bottom up traversal of the parse tree, allowing us to define some further logic that converts the parse tree into a proper abstract syntax tree.

// ------

// Orders and Planning
// syntactic compression
// Example program
// problems
// futher work
// conclusions

// ------------------------------------------------------------------------------

// recall

// === Noun Phrases

// A noun phrase generally represents things (material and immaterial objects) or types (categories of objects), and this makes it a good candidate, in the context of programming, to play the role of strings, numbers, records and data structures in general, as was also discussed in a previous section //@verbsasfuncs .

// Besides data structures, we believe that the noun phrase captures a more general programming construct known as the "expression"; an expression in programming languages is any piece of code that evaluates to (or returns) a value. It is generally contrasted to a "statement" (or "instruction"), which does not evaluate to anything, and is hence executed purely for its side-effects (state mutations it produces in the execution environment).

// An important property of expressions is composability: a number, boolean, string, record or object literal is an example of an expression in most programming languages, and so are mathematical expressions, function calls and any combination of the former; just like noun phrases, programming expressions can grow up to an arbitrary length and can contain nested expressions.

// Some programming languages are known as Expression Oriented, because almost every construct they provide returns a value and is composable, even constructs that are traditionally seen as statements such as for loops or if-else "statements", an example of this is the Scala Language @alexander2017functional.

// === Simple and Compound Sentences

// The tendency will be to regard these as either assertions: which add knowledge to the world model or as yes-or-no questions: which evaluate to a truth value, depending on the current state of the knowledge base.

// As we saw, an assertion doesn't precisely correspond to an imperative sentence in English, but it is the closest thing there will be to a "command", we will therefore use these terms interchangeably. 

// === Complex Sentences

// We mentioned the fact that complex sentences allow the speaker to express a relation of subordination between two ideas; and we mentioned the philosophical distinction between "analytic" (or "a priori") and "synthetic" (or "a posteriori") knowledge, and how a valid option to verbalize this kind of knowledge in natural language is indeed through the use of a complex sentence. We think that two useful parallels with the domain of programming can be drawn here.

// The question of whether "analytic" and "synthetic" knowledge really exhaust all of human knowledge is an open issue in philosophy; and there are indications that this is not the case, specifically in the existence of unfalsifiable (like analytic) knowledge that nontheless depends on real world experience (like synthetic), for instance the general notion that "things change"; this third kind of knowledge can't be neatly classified in the binary scheme presented to us by the analytic/synthetic distinction. But regardless of this problem with the distinction, we will assume that all of the knowledge contained in a computer program falls exclusively under one of these two categories.

// When it comes to a priori knowledge, we think that a computer program essentially presents us with defintions: function definitions, type definitions, class definitions; these are all examples of abstractions that the programmer essentially creates for their own comfort: to avoid having to repeat themselves and hence to improve code maintainability; the interpreter or compiler needs to know that when we say `abs(x)` we really mean `-x if x<0 else x`, but it would just as well directly accept `-x if x<0 else x`, or the equivalent machine code.

// On the other hand, we believe that the a posteriori knowledge contained in a program essentially corresponds with the "useful work" done by it, this knowledge is more correlated to the side-effects, intended as the desired output or external behavior of the program: it describes them. A perfect example of this, we think, are event handlers in an Event Driven programming language, when a programmer adds an event handler to a program (eg: "when the button is clicked, the counter increments"), they are essentially teaching the environment a new cause-and-effect relationship. You may also say that they are teaching it to react with a certain response to a given stimulus, or that they are teaching it to expect a certain kind of event to take place after another.

// == Abstract Syntax vs Concrete Syntax

// The abstract syntax of a language is the set of Abstract Syntax Tree (ASTs) that are used internally to carry around meaning, and undergo transformations (symbolic manipulations); the abstract syntax is distinct from the concrete syntax.

// The concrete syntax consists in a set of production rules that describe a Context Free Grammar (CFG) and are captured by meta-languages such as the Extended Backus-Naur Form (EBNF). The concrete syntax  is closely related to the "front end" of the interpreter, therefore to the particular way the user chooses to write/speak (or "linearize") the language. This is manifested, for instance, in the difference between infix and prefix style of writing a mathematical operator, or in the preference of English speakers for the Subject Verb Object (SVO) word order in unmarked sentences, above all other equally available word orders.

// There is obviously a correspondence between the two kinds of syntaxes: a concrete grammar describes how a string of text (a linear representation of an idea) has to be turned into a parse tree (a hierarchical, bidimensional, representation of the same idea); this parse tree can be further transformed, and when the "unimportant" details related to the concrete syntax are discarded, an AST is produced.

// These "unimportant" details may include the fact of whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) construct, with the latter usually being easier for the system to manipulate.

// Another example may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user intended) precendence of operators.

// In this implementation of Deixiscript, we chose to stick to one concrete syntax, inspired by English; but in principle the language could be extended to support multiple concrete syntaxes insipred by different natural languages; this is possible because the underlying abstract syntax, while also inspired by English, is probably general enough to be applicable to many other languages too.

// == Abstract Syntax

// For the types of ASTs supported by Deixiscript we chose to draw inspiration from the linguistic abstractions we discussed earlier: noun phrases, simple sentences and compound sentences. For what concerns complex sentences, we split them into two kinds we call: Defs and Laws, corresponding to the two kinds of knowledge we previously discussed: a priori and a posteriori respectively.

// We chose not to create specific AST types for questions (or commands/assertions) and for negations; instead, these distinctions are signalled by two flags (boolean attributes) that can be used to mark (almost) any AST object as a command/question or as positive/negative.

// === Noun Phrases

// Noun phrases come in different flavors, an initial distinction can be made between explicit and implicit noun phrases. As we have seen, people tend to use implicit references most of the time when speaking naturally, but it was useful for us to include support for explicit references too.

// ==== Explicit References

// An explicit AST type in Deixiscript corresponds to the "leaf" components of the framework described by the traditional Interpreter Pattern; they are constants, and constants (as the name implies) can only ever evaluate to themselves. It would have made little sense, therefore, to allow them to be negated or marked as commands. A constant in Deixiscript can be: a string, a boolean or a number (only integers are supported as of the time of writing).

// Booleans are kept distinct from integers for two reasons: the system needs to have a special value that always syntactically matches anything (we will return to this point later) and another special value which points to no entity whatsoever ("nothing"). These special values are identified with the boolean values of true and false (only false, there is no need for a separate null pointer). To implement these two special constants through integers would mean to force 0 to point to nothing (which is clearly not the desired case, 0 should point to the number zero, which is a thing), and to force 1 to point to the value which syntactically matches any other construct, which again isn't right. Both of these choices would sooner or later lead to bugs, so booleans and integers are kept distinct.

// Strings have a triple purpose in Deixiscript: they all behave the same way as far as the system is concerned, but some of them are supposed to be considered "just strings" and others are supposed to be considered as symbols that represent more complex entities (individuals or concepts). What keeps them apart is the convention that "individual strings" contain a pound sign (`#`), for example: `"cat#1"` or `"puma#33"`, which probably refer to an individual cat and an individual puma respectively. Strings that don't have a pound sign can either be thought of as concepts (especially when they don't contain any spaces, such as: `cat` or `puma`) or as "just strings" (like strings in any other programming language).

// Explicit references are important implementation wise (only Explicits are allowed into the world model), but their direct usage by the end-user (although allowed) is discouraged, as it goes against the principles of naturalistic programming that are hereby being proposed.

// ==== Implicit References

// Implicit references exist to simulate the flexibility of noun phrases in real natural languages; an implicit reference is essentially a description; the basic kind of implicit reference in Deixiscript includes a head, which is usually a common noun, and a relative clause. The relative clause can contain an arbitrarily long sentence which further describes the referent(s). Adjectives are implemented as syntax sugar on top of relative clauses, by expanding them to relative clauses with a copula, for example something like: "the corageous cat" would de-sugar to "the cat that is corageous".

// A basic implicit reference also contains numerical information relative to the cardinality (how many referents should be matched) and to the ordinality (or position in short term memory) which is implemented as a function of the point in time an individual thing was last mentioned, following the simplifying assumption that an individual that was mentioned lately is likely to be mentioned again after a short amount of time.

// A basic implicit reference also supports two distinct flags to mark it as a command or as negative respectively; there are four possible combinations of these two flags' values: positive question (search), negative question (inverted search), positive command (create) and negative command (destroy).

// The life cycle of an individual starts when a "create" statement is made about it, this triggers the creation in the world model of a new node with a pound-sign ID and a connection to a concept node (corresponding to the head of the noun phrase), plus any additional connections (corresponding to the realtive clause of the noun phrase) to other nodes. This is the usage of noun phrases akin to a that of a constructor in OOP languages.

// Once created, an existing entity can be retrieved (hoisted on top of the short term memory, or used as an argument of a simple sentence) by using "search" mode, which will be interpreted as a search over the whole world model for (one or more) individual(s) matching the type constraints specified by the head and relative clause.

// When the "inverted search" option is used, the search will resolve in (one or more of) the individuals which do _not_ match the type constraints. This is defined as the difference between the global set of individuals and the set of individuals matching the positive equivalent of the expression; taking care of the numerical constraints separately.

// When an entity has outlived its usefulness, it can be purged from the world model (or "forgotten") with a negative command about it.

// To increase the flexibility of implicit references, Deixiscript also provides the option to use an "and" or an "or" conjunction to enumerate many basic implicit references; for instance one could refer to "the bobcat and the panther" simultaneously; this "compound implicit reference" of sorts can be used as an argument inside of a simple sentence, and in this case it triggers the automatic expansion of that sentence into multiple sentences based on the number of resolved referents and the kind of conjunction used.




// // ----------------

// // // Edward Sapir (1884-1939) linguist famous for the Sapir-Whorf hypothesis on linguistic relativity once wrote: 

// // // Were a language ever completely "grammatical" it would be a perfect engine of  conceptual expression. Unfortunately, or luckily, no language is tyrannically consistent. All grammars leak @sapir1921language.

// // // == Compositionality

// // // Simple statement: "The meaning of a complex expression is determined by its structure and the meanings of its constituents."
// // // It certainly holds for many artificial languages
// // // variations to account for indexicality (occasional vs standing meaning)
// // // The principle remains controversial
// // // related principles: Substitutivity, 
// // // "If two meaningful expressions differ only in that one is the result of substituting a synonym for a constituent within the other then the two expressions are synonyms." (Ssingular)
// // // this is a stronger assumption than Compositionality, number of planets vs eight example
// // // https://plato.stanford.edu/entries/compositionality/

