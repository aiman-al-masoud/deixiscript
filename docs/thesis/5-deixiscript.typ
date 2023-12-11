= Deixiscript

In this chapter we will present _Deixiscript_, the programming language developed for the thesis work. The name is a _portmanteau_ of the words Deixis (a linguistic concept related to indexicality) and Script (on the model of many other popular programming language names).

== Goals and Non-goals

=== Goals

Our goal in relation to Deixiscript was to design and build a working prototype of a naturalistic language that could showcase some of the ideas from the existing naturalistic languages on the "market". 

We wanted to get a feel of some of the more practical challenges involved in making a naturalistic programming system, and propose (and experiment with) the addition of some slightly more novel features.

=== Non-goals

Our goal was not to implement a production-grade (or even complete) programming environment, a task that would require a higher level of practical expertise in the field of language implementation and much more man-months effort.

We also did not pay much attention to issues related to performance and code-optimization (_"premature optimization is the root of all evil"_ @prematureOptimization); and we were generally more interested in code-readability than in execution speed.

== Evolution of Deixiscript

Our idea of what the language had to be like (and how it had to be implemented) has changed and evolved significantly throughout the arc of time we had at our disposal. During this period, we explored many different ideas and not all of them made it into the final implementation.

=== Initial Stage

We initially started out with the vague notion of translating basic sentences in natural language to predicate logic (specifically Prolog) clauses, which could be then executed on a Prolog interpreter as either questions or statements. We eventually decided to change strategy when we realized that the process of translation was a little more involved than expected, and that the full power of Prolog's predicate logic was perhaps not really needed for our more modest purposes.

=== Rule Orientation

After this initial experiment with predicate logic, we were initially inclined to go back to a more object-oriented approach. This meant rigidly attaching both data and behavior to the entities in the world model. This approach, however, comes with its own set of problems. We discussed some of these problems when we talked about Inform 7's approach in @inform7RuleOrientation.

We were then inspired by projects like Pegasus (@pegasus) and by readings such as the book "Machines Like Us" (which we also discussed in @commonSenseACentralProblem) to take a more "rule-based" approach (though we still had not read about Inform 7's implementation to know it was called like that there).

As it stands, the current version of Deixiscript adopts a kind of rule-based programming approach. This makes types a little more flexible than classes, because they do not have to be declared as rigidly (or linked to their behavior as tightly) as in class-based programming.

=== Automated Planning (limited)

The current version of Deixiscript also tries to introduce a limited kind of automatic planning (we have encountered the topic of automated planning in  @automaticPlanning) in the context of a rule-based naturalistic programming language. This capability (as we will see) can be used to issue declarative "orders" to individuals in the world model known as "agents", who will have to figure out how to execute these orders.

== Implementation Details

In the current section, we will begin by discussing some high-level implementation details, including the programming language, libraries, code style and software design pattern that were used.

In the later sections, we will then move on to describe the current version of Deixiscript, detailing and motivating the choices that were made and the philosophy behind them. Since Deixiscript is an English-based language, what follows will also inevitably include digressions into some (basic) aspects of the English grammar.

=== Implementation Language

The implementation language is Python 3 (specifically version 3.10 or higher), annotated with type-hints and type checked by the Pyright @pyright static type checker. Unit tests are performed with the help of the Pytest @pytest testing framework.

We have experimented for some time with other programming languages (TypeScript/JavaScript) for the implementation of Deixiscript, but we decided to stick to Python at the end. We think that Python is a great language for prototyping, due to its flexibility and regularity, the abundance of third-party libraries that help perform a wide variety of complex tasks easily, and also the richness of its standard library.

=== Parser

The Lark @larkwebsite parsing toolkit for Python is used for the "front end" of the Deixiscript interpreter to turn the strings of source code into parse trees and to further apply some transformations, obtaining Abstract Syntax Trees (ASTs) which the "back end" of the interpreter can then process.

The Lark parsing toolkit is available for free under the terms of the MIT opensource software license.

=== Graphical Tools

The Graphviz @graphviz graph visualization software and related Python wrapper  @graphvizPythonWrapper were used as a testing tool, to visually inspect the world models produced as a side effect of the interpreter's operation.

The Matplotlib @matplotlib visualization tool and Python library was used to graphically display the evolution of some simulated processes.

=== Licensing

All the software that was used to develop Deixiscript is available for free and under the terms of (different) opensource licenses. Other than the aforementioned ones, the core components of Deixiscript require no further dependencies outside of Python's own standard library.

Deixiscript itself is free software, and its code will be made available under the terms of the GPLv3 license. We will suggest some possible further developments for the language in the next chapter.

=== Functional Style

Regarding the code general style, an effort was made to follow (when possible) the Functional Paradigm approach of data-immutability and function (or method) purity.

We perceive that the advantage gained from following this style was a more predictable semantics in the business-logic. Most method calls do not modify an object directly: they return a copy if necessary. This immutability of objects reduces the chances of an unforeseen side-effect happening (an unpredicted state mutation within an object which can be a cause for bugs).

On the other hand, the disadvantage of this approach is that method return types can become a little too elaborate, because, due to the lack of side-effects, all changes have to be propagated through the mechanism of function returns.

=== Interpreter Pattern

The classes that represent the Abstract Syntax Trees (ASTs) follow the Interpreter Pattern, one of the well-known 23 GoF Software Design Patterns for OOP languages.

Alternative approaches were tried (using a single or multiple "eval" functions), but the polymorphic nature of the Interpreter Pattern offers a higher degree of flexibility, also considering the fact that Python functions cannot be overloaded (unless this is done manually).

The Interpreter Pattern defines a common interface (called "AST") with at least one method (usually called "eval", short for "evaluate"). The classes that implement the AST interface can either be "leaves" or "composites". A leaf (such as a number, a string, or a Boolean literal) is a constant, which means it always evaluates to itself.

Examples of composite types can be: an arithmetic expression, a logic expression, a function definition, a function invocation, or almost anything else one can imagine. A composite type typically evaluates its "children" first, then combines them (however its logic dictates into a new evaluation result, which it returns).

The common interface ensures that all of the AST objects can be evaluated in the same way, by calling the `eval()` method with an operating context (known as "environment", or "state") as an argument.

The `eval()` method is expected to return the result of the evaluation of the AST object and to write the changes produced by its evaluation (if any) to the environment.

In our case, since we are following a Functional approach, the `eval()` method returns a new object (that contains the updated context) without changing the original object.

== Representing Propositions

We think that a central theme in any language (natural or artificial) is about propositions and their concrete representation. We came across propositions when discussing logic programming in a previous chapter; as we saw, in predicate logic propositions are represented by Well-Formed Formulas. In natural language, on the other hand, propositions are typically represented by sentences. In English, a sentence can be simple, compound or complex.

=== Simple Sentences

A common example of a simple sentence in English is: "the quick brown fox jumps over the lazy dog". A simple sentence can contain: a subject ("the quick brown fox"), a verb ("jumps"), a direct object (none in this case, since "jump" is typically used as an intransitive verb), and any number of complements ("the lazy dog" could be considered the "location" of the fox's jump).

=== Complements and Grammatical Cases

The complements of a sentence can help specify the location or time of an action, they can also correspond to any other actors directly or indirectly involved in the action. In English, complements are generally introduced after a preposition such as: "over" (from the example), "to", "from", "by", and so on.

The direct object of a sentence is a little special in English (and in other modern European languages) because, just like the subject, it is not preceded by any preposition. The subject and the object are generally distinguished by their order of appearance in the sentence (the subject typically precedes the object).

Unlike English, some languages (even some modern Indo-European languages) rely more heavily on grammatical cases rather than prepositions and/or word-order to express grammatical relationships. A case-marking is typically a word inflection (such as a suffix, a prefix or an infix). In many such languages, English's direct object corresponds to an inflected noun in the accusative case.

A vestige of the system of grammatical cases (which English inherited from an older proto-language) remains in modern English's personal pronouns. For instance, "I/he/she" are "nominative" (the grammatical case of the subject), "me/him/her" are "accusative" (the grammatical case of the direct object) or "dative" (e.g., "I give _him_ the book").

=== Verbs and Transitivity

In any case, the verbs that require a direct object are known as transitive verbs, such as, for instance, the verb "to eat" in the sentence "the cat eats fish" (where "fish" is the direct object). Some verbs, known as intransitive verbs, do not require a direct object (the verb "to exist" is an example of an intransitive verb in English).

Some verbs are traditionally regarded as optionally accepting two direct objects and are known as ditransitive verbs, such as the verb "to make" in the sentence "the senate made him consul".

Some other verbs can be seen as requiring no subject at all, and are known as impersonal verbs, such as the verb "to rain" in the sentence "it rains". Since English always (syntactically) requires the subject slot to be filled (except in informal speech), the existence of such verbs is not so obvious as in languages that can drop the subject. An example of such language is Italian, where the translation of "it rains" would just be "piove", without any visible subject.

Some simple sentences in English can have no verb at all: a verbless sentence can be seen as an alternative form to an equivalent sentence with a verb. They are typically used for the sake of brevity or to achieve some special rhetorical effect, and common examples include exclamations such as "good job!" in lieu of "you did a good job!", or "excellent choice!" in place of "this is an excellent choice you are making!".

=== Compound Sentences

A compound sentence is a sentence made up of at least two or more simple sentences, joined together by a conjunction or disjunction ("and", "but", "or", etc.). An example is: "the cat meowed loud, but she failed to obtain food".

It is important to note that the two simple sentences incorporated in the larger compound sentence remain "independent" of each other: you can rephrase the previous sentence by changing their order and the meaning is logically equivalent (if you ignore the time factor, at least).

=== Complex Sentences

A complex sentence creates a relation of dependence between two simple sentences. For example, in "the cat failed to obtain food, because she did not meow loud enough" the two simple sentences cannot be swapped around without changing the logical meaning of the statement. The word "because" is a subordinating conjunction, and in this example it serves to highlight a cause-and-effect relationship between two actions of the cat (meowing loud and obtaining food).

But cause-and-effect relationships are not the only kind of relationships that can be expressed by a complex sentence. Take for example the sentence "the man is a bachelor, because he is not married": the linguistic structure is similar but the idea is a little different: this is not knowledge of the laws (observable regularities) that govern the world, but rather of the meanings of the word "bachelor" and of the word "married", and the necessary (and somewhat trivial) relationship between them. 

This is an example of the (somewhat disputed) philosophical distinction between "analytic" (or "a priori") knowledge and "synthetic (or "a posteriori") knowledge @sep-analytic-synthetic.


=== Simple Sentences in Deixiscript

Now we have a feeling for how propositions are represented in English. In Deixiscript, a "simple sentence" has: a (necessary) subject, a (necessary) predicate (we will come to this later) and an (optional) object. The choice was made in the current version of Deixiscript to limit the maximum number of "slots" of a verb in a simple sentence to only two (the subject and the object).

The language could be easily extended to support multiple (optional) complements in a simple sentence (early "versions" of the language had them indeed), but then the choice was made to avoid them, for two reasons: because they may be more confusing than helpful at this stage of development (there are many prepositions in English, so how many do we choose to support? Is "in" always a synonym of "on"? Is "on" a synonym of "over"?); and because binary relations (such as between a subject and a direct object) are already quite powerful and allow one to express a sufficiently large range of ideas @nelson2006natural.

From now on, we may occasionally speak of "simple sentences" and of "propositions" almost interchangeably in the context of Deixiscript. However, we must keep in mind that a proposition is really an abstract (mental) concept, and a simple sentence in English is usually seen as a feature of the (concrete) syntax of the English language, which includes word order and other (concrete) features of a physical string of text (or sound).

What we are really referring to when we use both of these two terms loosely is the abstract syntactic structure of the implementation of Deixiscript (the type of Abstract Syntax Tree) that corresponds to a simple sentence in English and a proposition (the meaning of that sentence).

Another thing that we must keep in mind is that a proposition is the meaning of any sentence (not just a simple sentence), hence the term "atomic proposition" would be even more appropriate when referring to the meaning of a simple sentence in Deixiscript.

In any case, there are two complementary ways to interpret a simple sentence, as we shall see, one related to "statements" (we will clarify what we mean by that term) and the other related to "questions" or "conditions".

=== Statements versus Questions

We think that natural language "statements" (i.e., "acritical" declarations of knowledge assumed to be true) and programming language "statements" (i.e., those syntactic constructs that are executed primarily for the side-effects they produce in the environment) are actually quite similar, not just in name, because (at least at a first approximation) they both cause the "recipient" to change its "internal state" in some way.

A programming statement (such as a variable assignment) primarily causes a change of state in the system, for instance by binding the name of a new variable to some value in a variable scope.

Analogously, a natural language statement in the indicative mood usually causes a person who hears it to change his/her beliefs. A person "Alice" who hears a statement made by another person "Bob" will change some of her beliefs.

Of course, she may not actually believe in the "content" of the statement (perhaps Bob is a liar, or a deluded individual), but she will certainly (at least) come to believe that Bob made the statement.

However, if Bob happens to be some kind of authoritative figure (a doctor, a professor, etc.) Alice may indeed change her beliefs according to the actual "content" of the statement made by Bob, accepting it (maybe just partially) as a true fact about the world.

On the other hand, a question is an expression of the desire to learn about a specific fact or facts in the world, and a condition represents a piece of knowledge whose truth value is not asserted, but rather just taken as hypothetical.

We think that questions (and conditions) are more akin to programming language expressions, because their primary effect on the recipient (barring rhetorical questions of course) is not that of modifying the recipient's beliefs about the world, but rather of eliciting a response from the interlocutor.

In natural language, this response can be a simple "yes" or "no" (a condition also typically "evaluates" to a "yes" or a "no"), or it can be a "pointer to a thing" (such as in a reply to a "what", a "where" or a "who" question), or it can be an explanation of some phenomenon or behavior (such as in response to a "why" question).

=== Statements versus Conditions

"C-like languages" (i.e., languages that have a C-like syntax, such as: C++, Java, JavaScript, etc.) tend to blur the distinction between an expression and a statement: they allow some expressions to have side effects and they treat some "statements" like expressions.

For example: function invocations (expressions) and procedure invocations (statements) can look (and sometimes even behave) similarly, and variable assignments (which are best thought of as statements) are usually allowed to return a value (the value of the right-hand side of the assignment).

This sometimes leads to the necessity of having special syntax to distinguish some constructs with side-effects from some "similar" constructs without them. For instance, since a variable assignment (which uses a "single equals") is treated like an expression, it could appear within the condition of an if-statement, and hence there is a need to distinguish it syntactically from a comparison (which uses a "double equals"):

`if (x == 1) do_something();`

The one above is an example of a conditional statement in a C-like language. `x == 1` is a comparison, so the function `do_something()` will be invoked if and only if the value of variable `x` is equal to the integer `1`.

#pagebreak()

Let us consider:

`if (x = 1) do_something();`

This second statement is (de facto) _not_ a conditional statement in a C-like language. The expression `x = 1` is an assignment. An assignment expression evaluates to the value of the right-hand side (i.e., to the integer `1`). Any number that is not equal to `0` is considered to be "truthy". Hence, the function `do_something()` will always (unconditionally) be executed.

Some programming languages (e.g., Java) mitigate this source of errors by stipulating that only Booleans appear in the condition of an if-statement; in such languages, only Booleans can be "true/false".

Some other programming languages completely lack this somewhat "tricky" distinction between the "two kinds of equal", such as the "GW-BASIC" dialect of the BASIC (Beginners' All-purpose Symbolic Instruction Code) programming language developed by Microsoft, and first released in 1983. In GW-BASIC, the same symbol (a single equal sign) is used both as an assignment operator and as a comparison operator (depending on the syntactic context of its usage) @gwBasic.

We think that this kind of distinction is also mostly absent from English (e.g., the simple sentence "it is alive" remains unchanged when embedded in the bigger complex sentence "if _it is alive_, then run away!").

=== ASK/TELL Distinction

In Deixiscript, we want a sentence like "it is alive" to be interpreted either as a statement (i.e., "let it be known that it is alive") or as a question or condition (i.e., "is it alive right now, yes or no?").

These two different interpretations, which we will call "TELL" and "ASK", respectively, are triggered by syntactic context. For instance, if a simple sentence is embedded within the condition part of a conditional statement (as we saw before), then it will be interpreted in "ASK" mood.

A simple sentence all by itself (e.g., "it is snowing") is interpreted in "TELL" mood, unless ended by a question mark (e.g., "it is snowing?"). This syntax diverges from the syntax of a "real" question in English, which in this case would require swapping the verb "to be" with the dummy subject "it" (i.e., "is it snowing?"), but we think that the two forms are similar enough, and this issue could probably be fixed in the future by some slight additions to Deixiscript's concrete syntax.

In general, almost all syntactic elements of Deixiscript can be interpreted as either "TELL" statements or "ASK" expressions. 

However, concerning some syntactic elements, only one or the other kind of behavior makes any real sense; for instance, strings, numbers and Booleans are only meant to evaluate to themselves (they are constants after all), so they do not have a TELL mood.

The way this is technically handled is through the addition of an extra component to a Deixiscript simple sentence (and to the other AST types that need it): a Boolean attribute that we will call the "TELL flag". Depending on its value, an AST object's `eval()` method will behave in one way (TELL) or in the other (ASK). A brand-new copy (following the code's functional approach) of an AST object can be made with a different value of the TELL flag.

=== Other Grammatical Moods

Both statements and questions in English are expressed in the same grammatical mood, known as the indicative mood. There are other grammatical moods in English, such as subjunctive (to express unreal or hypothetical situations) and imperative (to give orders). 

We will not be needing an explicit subjunctive mood (as it is rarely used in modern English anyway), and we will be using a different kind of sentence all together (the "Order") to express a kind of "imperative mood", as we shall see in the next sections.

=== Defining Meaning

Simple sentences do not have any predefined meaning in the current version Deixiscript: just like functions in other programming languages, they must be defined before they can be used, this can be done through the "Definition" syntactic construct that looks a lot like a complex sentence in English (as we will see). 

For instance, a Definition could look like this: "a tablecloth is red means the color = red", and this would define the meaning of the predicate "red" in relation to the subject "tablecloth", which could be very different from the meaning of the same predicate applied to some other kind of entity (e.g., "a guard is red means the political-affiliation = USSR").

Most other AST types have an intrinsic meaning which cannot be overridden/overloaded, such as arithmetic operators, logic operators, comparison operators, the equal sign (which works either as a comparison operator or as an assignment depending on the syntactic context). All of these operators have a fixed meaning (for the sake of simplicity).

As a side note, the copula (i.e., the verb "to be") is _not_ treated the same as the equal sign. The equal sign strictly compares identity, while the copula can be used with "various meanings" (with adjectives) as we will see.

== Representing Entities

Until now, we have always generically talked about the "subject" and the "object" of a simple sentence, but it is now time to explain exactly what we mean by those terms.

=== Noun Phrases

In English, the subject and the object of a sentence are "noun phrases". A phrase is a syntactic structure that (unlike a sentence) does not express a complete thought; in particular, a noun phrase is a phrase that performs the same function as a noun.

A general test for whether a part of a sentence counts as a noun phrase is to replace it with a pronoun and to see if the sentence still makes sense; for instance, in the sentence "the quick brown fox jumps over the lazy dog" there are two noun phrases: "the quick brown fox" and "the lazy dog", and the sentence's structure is equivalent to: "_it_ jumps over the lazy dog" or to: "the quick brown fox jumps over _it_", or even to: "_it_ jumps over *_it_*".

A linguistic head (or nucleus) of a phrase is the part that determines the syntactic category of that phrase, and in the case of a noun phrase the head would be a noun (or any smaller noun phrase). In the noun phrase "the lazy dog", the head is "dog".

=== Implicit References

A key insight from the study of natural language is that people rarely use explicit references (proper nouns, IDs, numbers, etc.) even when talking about individual entities (as we saw in @the80s); they instead make use of the "type" of these individual entities (common nouns) leveraging a phenomenon known as the indexicality of language. 

For instance, if a person refers to "the cat" when they are at home, versus "the cat" when they are hiking across a mountain range in the Americas (two different "contexts"), they may be referring to two very different individuals (a house cat vs a mountain lion, for example). But the phrase they may decide to use in both cases is the same: "the cat".

A noun phrase can be of arbitrary length, and of arbitrary precision (and thus include/exclude a higher number of individuals); the most trivial example is given by a single noun all by itself (e.g., "cat"), but a noun phrase also typically includes articles, adjectives and even relative clauses with any arbitrary level of nesting, e.g., "the agile calico cat that leaped on top of my desk holding a fresh kill (which she wanted me to have as a gift) in its fangs".

=== Deixiscript Noun Phrases

The kinds of noun phrases supported by Deixiscript are: constants (numbers, strings, Booleans and IDs), "implicit phrases", "genitive phrases", variables and pronouns.

==== Constants

Numbers, strings and Booleans work just like they do in any other programming language. IDs are there mainly for the system's own benefit (we will discuss them in a further section when talking about the world model) and are not accessible to the user of the language. 

==== Variables

Variables are single-letter placeholder names (such as "x", "y" and "z") that "match" any type (see @syntaxMatch on syntactic matching) and they can be useful when writing some kinds of general Definitions, but we will not have much more to say about them.

==== Implicit Phrases <implicitPhrases>

What we call an "implicit phrase" comprises a "head" and a list of adjectives. The head (or noun) is just a string representing a type (which does not have to be declared explicitly).

The (attributive) adjectives do not carry an intrinsic meaning, they are tied to the adjectives used in simple sentences that we discussed earlier. An adjective in a noun phrase is referred to as an "attributive" adjective, whereas an adjective in a sentence with a copula is referred to as a "predicative" adjective. 

In Deixiscript there is an equivalence between the two kinds of adjectives: once the meaning of a predicative adjective is defined in a simple sentence (e.g., "the cat is calico, means..."), it can be used as an attributive adjective in a noun phrase (e.g., "the calico cat"). An attributive adjective can also be negated (e.g., "a non-calico cat").

When used inside of a sentence or by itself, an implicit phrase evaluates to (at most) a single ID, as we shall see later.

==== Genitives and Possession <genitivePhrases>

What we call a "genitive phrase" is a noun phrase that refers to a property of an individual rather than to the individual itself. Syntactically, it is in the form:  "an individual's property" or "x's y" (using English_'s_ Saxon Genitive). It is also possible to implement an alternative syntactic form using the preposition "of".

We think that "possession" is an important part of how we model the world. All of the "useful work" that the system really does (everything it really boils down to) is setting the value of properties on the dictionary data structures that the system internally uses to represent "individuals". It is precisely because of this internal representation that the system is able to interface with the outside world (other programming languages, tools and libraries). We will come back to this idea later when discussing the Knowledge Base and World Model.

==== Pronouns

The last kind of noun phrase we mentioned is the pronoun. This is perhaps the most elusive kind of syntactic element. We take pronouns for granted in natural language, but they are actually not so easy to approximate (with a hundred percent accuracy) in an artificial language.

A personal pronoun (e.g., "I", "you", "he/she", "it", etc.) is a specific instance of a more general linguistic phenomenon known as "deixis". The "deictic" words are highly context-dependent words whose referent depends entirely on the state of the speaker who uses them. Deixis can be spatial (in words such as "here" and "there"), temporal (in words like "yesterday", "before", "after") or personal (in words such as the personal pronouns).

Deixiscript only supports one kind of pronoun (third person singular). Pronouns in Deixiscript are a little special for a reason: they are the only kind of noun phrase that needs some external context to evaluate.

We have already talked about how a simple sentence may be treated as a conditional expression or as a statement with side-effects depending on the surrounding (syntactic) context (e.g., the simple sentence "it is snowing" enclosed in the larger complex sentence "if _it is snowing_ you put on a heavy coat"). 

This is technically easy to achieve: the object that represents the larger syntactic structure (the complex sentence) obviously _knows_ that its own conditional part has to be evaluated in "ASK" mood and not in "TELL" mood.

On the other hand, a pronoun that behaves somewhat "realistically" reserves the right to resolve to different values (to point to different things) based on the _meaning_ of the surrounding context (the simple sentence that embeds the pronoun).

For instance, in the sentence "the cat saw a table, and it jumped on it" the first instance of the pronoun "it" obviously refers to "the cat" and the second refers to "the table". This is obvious to us, because we live in a world were cats are the sort of entities that can jump on tables, and not vice versa.

Deixiscript supports a limited kind of context-dependent resolution of pronouns,  based on the Short Term Memory (STM) of the interpreter and the stored Definitions of the simple sentences; we will discuss the STM later alongside the Knowledge Base.

==== Relative Clauses (not included)

Deixiscript does not support relative clauses, although a previous version of it did support them. The decision to drop their support and focus instead on other aspects of the noun phrase (e.g., adjectives) came from the difficulties encountered in their implementation.

A relative clause is introduced by a relativizer (such as "that", "which", "who", etc.) followed by a sentence. In English, the prevalent strategy to refer back to the nucleus (or head) of the enclosing noun phrase is that of "gapping", i.e., leaving a "gap" in the place where the head would have stood, if the relative clause had been independent.

For example, the noun phrase "the fish that the cat ate" has a relative clause ("the cat ate") with an apparently missing direct object (_what_ did the cat eat?). As an independent sentence, it would have looked like "the cat ate _the fish_".

A possible implementation for this kind of relative clause involves substituting the head (in this example, "the fish") to the "gap" within the relative clause. The problem is that one has to know whether the verb is transitive or not, to determine whether there is a gap in the sentence or not.

While this is not an insurmountable problem in principle (the transitivity of a verb can be deduced from its usage in the Definitions), we thought that this feature (relative clauses) was not too central to our goals. 

In any case, the goal behind implementing noun phrases was to have a system to distinguish types from one another, to recognize some kinds of sub-type and compatibility relationships, and to pick out individuals from the world models based on their properties. For our basic prototyping purposes, one can get along well enough with the syntactic structures we have previously described (nouns, adjectives, genitives).

== Knowledge Base (KB)

We have repeatedly mentioned the "Knowledge Base", and in the following paragraphs we will discuss the details behind this important component of the system. The Knowledge Base contains all of the state of the Deixiscript interpreter at any point in time, which comprises of the World Model (WM), the lists of Definitions, Potentials and Orders (we will talk about these two in a next section), and the Short Term Memory (STM).

=== World Model (WM)

As we already said, the world is modelled as individual entities (or "individuals") and their associated properties. To the World Model, an "individual" is nothing more than a bundle of properties stored in a dictionary (associative array) data structure. 

Anyone of these individuals (or bundles of properties) must contain at least one essential property that we call the "type". The world model is essentially a list of these individuals, and the index in the list of an individual is its "ID". For instance, we could have a world model like the following one (represented in JavaScript Object Notation (JSON)):

#linebreak()

`[{"type":"cat", "color":"red", "age":10}, {"type":"cat", "claws":"sharp"}, {"type":"dog", "color":"brown"}]`

#linebreak()

This world model contains three individuals (two cats and one dog), and describes the property "color" of the first cat (`ID#0`) as "red" and the same property of the only dog (`ID#2`) as "brown". The second cat (`ID#1`) does not have a property "color" (the model does not have any information about it) but it has a property "claws" set to the value "sharp". The first cat (the red one, `ID#0`) also has a property "age" that is set to the value 10.

The "keys" are the names of the properties of the individuals ("type", "color", etc.) and they are strings. The values assigned to the properties can be strings, numbers or Boolean values. One might also imagine to set the value of a property to an ID value (which is distinct from the number type in Deixiscript).

Setting the value of a property to an ID type might be useful for those properties that involve a permanent bond (more stable than an ephemeral interaction during an Event) between two individuals.

==== Limitations of the World Model

Of course, this way of representing the world has its big limitations. For example, given that the value of a property can only be a scalar (string, number, Boolean, and maybe ID) it cannot hold more than one value at a time. For instance, a cat may not have two colors simultaneously (unless, of course, one decides to model that as a "color-one" and a "color-two" properties, which would then count as two distinct properties).

This limitation (ensuring that any given property has one single value at a time) is however useful for interfacing with the outside world (other programming languages and software tools) because they (the external tools) can more easily read values from the properties of individuals in the world model, for instance to redraw a graphical component of some user interface based on the state of the world model. 

An external tool could also write to the world model, for instance to update the value of an input buffer after the user of a Deixiscript program enters some new input.

Another limitation put in place on the world model is the following: the world model must not contain (at any time) any pair of individuals that are undistinguishable from their properties alone (and the ID, which is just an index in the list, does _not_ count as a property).

This property has to be enforced by a check that is made whenever a new individual is about to be created with some properties: the system checks whether there is already an individual with all of the mentioned properties in the world model, and displays an error in case it already does.

One might say that the system cannot "conceive" of any two "identical" individuals unless it (the system) is told of some actual (even slight) difference in their properties (and again, the ID does not count). The rationale behind this limitation is related to how the Short Term Memory (STM) works.

=== Short Term Memory (STM)

The Short Term Memory (STM) is a part of the Knowledge Base and its purpose is essentially to disambiguate the implicit references and pronouns that may be used by the programmer in a given context.

The STM behaves like a bounded queue (with some caveats, as we will see). The STM can hold up to N (we set N=4) noun phrases at any time (the size N of the STM should not be too big). This approach was inspired by the project Pegasus (discussed in @pegasusArchitecture).

The system tries updating the STM whenever a "noun phrase is used by the programmer", but the STM may have to remain unchanged in some cases. 

==== Example of STM working

We will illustrate the behavior of the STM with a simple example: suppose that there are two cats, one with color=red and the other with color=black (the two individuals can co-exist in the same world model because they are distinct by one property); suppose also that the STM is initially empty.

When we (the programmers) say "the cat", the system displays an error. This is because there are currently two individuals in the world model to whom the noun phrase "the cat" applies; furthermore, the STM is initially empty and cannot provide any help (yet) at disambiguating this ambiguous phrase ("the cat").

We can try being more specific. Suppose that we have already defined what it means for a cat to be red (as having the "color" property set to the value "red"), so we say: "the red cat", using an attributive adjective to narrow down on the individual we would like to talk about. 

Now the system does not display an error, because the noun phrase we used is precise enough to pick out one single entity unambiguously from the world model. The system also adds the noun phrase "the red cat" to the queue.

Now the STM contains the noun phrase "the red cat". Suppose we _now_ say "the cat". The system does not display any error, because it is now able to use the STM to disambiguate, i.e., the system will assume that we are referring to "the red cat" in the STM. It is worth noting that, in this case, the system will _not_ insert the ambiguous phrase we just used ("the cat") into the STM, because it already contains a more precise one, i.e., "the red cat".

Suppose we now say "the non-red cat" to the system. This will pick out the other cat in the world model, the one that does not have "red" as its color. The system will insert the new noun phrase "the non-red cat" into the queue; and, from now on, the ambiguous noun phrase "the cat" will be intended as "the non-red cat".

One can then mention "the red cat" again and the STM will be updated accordingly. When the STM grows to its maximum length, the oldest element (noun phrase) will be removed from the queue to make space for the newest one.

==== One ID per Noun Phrase

A limitation of the latest version of Deixiscript is that a noun phrase can only "point to" a single individual at a time; in other words, a noun phrase may resolve at most to a single ID, given one state of the Knowledge Base. Early versions of Deixiscript did not have this limitation. This entailed that noun phrases had to specify a cardinality (to distinguish singular from plural). The automatic expansion of a sentence (while a useful feature in some cases, to carry out the same action over multiple individuals) introduced complexity to the code: the system had to check (for any sentence) if any of the noun phrases it contained would resolve to multiple IDs, and, if that was the case, "expand" the original sentence into multiple similar sentences each with a different ID.

==== STM and pronouns

The STM is also useful for the resolution of pronouns. The assumption here is that any pronoun must refer exclusively to some noun phrase that is currently in the STM. As we have said previously when talking about pronouns, a pronoun should be able to resolve differently based on the meaning of the sentence or phrase that surrounds it. 

The simple technique we use to resolve pronouns is to try executing a sentence (or phrase) that contains a pronoun multiple times, each time after having substituted the pronoun with a different noun phrase taken from the STM (they are very few, owing to the STM's limited capacity). 

When the sentence (or phrase) finally works (does not produce an error) then we stop, and we consider the pronoun to be resolved. Of course, it may be that none of the noun phrases in the STM succeeds at making sense of the sentence containing a pronoun; in that case, the system just displays an error, complaining that the pronoun is used ambiguously in that context.

== Syntactic Matching <syntaxMatch>

Many of the higher-level operations we have talked about (using simple sentences, using adjectives, searching for relevant Definitions, etc.) depend on the functioning of a more basic low-level operation that we will call "match".

Matching any two noun phrases or any two sentences (or, more generally, any two AST objects) is a purely syntactic operation that does not depend on the semantic context, i.e., it is completely independent of the state of the Knowledge Base.

=== The `match()` Function

Match is implemented as a function that takes two arguments, namely two Abstract Syntax Tree (AST) objects. The function `match()` is non-symmetric, i.e., the order of the arguments matters. The match function cannot be expected to return the same result when the two arguments are swapped.

When comparing noun phrases, one of the arguments can be thought of as the "super-type" and the other can be regarded as the "sub-type" of the comparison, to use some class-based programming jargon. For instance, when comparing (the abstract structure of) "the cat" to "the red cat", `match()` will return a _positive result_ if "the cat" is used as the first argument (in the "super-type" position) because "the red cat" is regarded as a special case of "the cat".

Obviously, if the arguments are swapped and "the red cat" takes the argument position reserved to the "super-type", the `match()` function returns a _negative result_ ("the cat" is obviously _not_ a special case of "the red cat"). 

Used on noun phrases, the `match()` function behaves very much like the `instanceof` operator of some object-oriented languages. The `instanceof` operator produces a Boolean value based on the inheritance hierarchy of the operands. But what the match function actually returns is a mapping (an AST-to-AST dictionary), which just happens to be empty in case of a _negative result_.

The return type is a mapping, because the two arguments of the `match()` function are not (as we have hinted to) limited to being noun phrases. They can be simple sentences, compound sentences, etc. The `match()` function needs to return a mapping when comparing together two simple sentences, because its job is to determine if the subject (or object) of the more specific sentence can be substituted into the subject (or object) of the more general sentence.

Sometimes it is also useful to allow different AST types to compare together: for example, it makes sense to compare a "genitive phrase" (@genitivePhrases) to an "implicit phrase" (@implicitPhrases).

It may also make sense to compare a compound sentence (implemented as an "and/or expression") to a simple sentence.

=== Definition Lookup

Syntactic matching plays a crucial role when the system needs to lookup the definition of an simple sentence. As we said, a simple sentence is the sort of AST that does not have an intrinsic meaning: it needs to be defined before it is used, and the Definitions are stored as a list in the Knowledge Base. Each Definition has two parts: a "definiendum" (the left-hand side, what has to be defined) and a "definition" (or "meaning", or right-hand side).

When a simple sentence has to be executed, the system goes through the list of Definitions and attempts to match the simple sentence to a definiendum. If the end of the list is reached and no suitable match was found, then the system displays an error, telling the programmer that the verb or predicate they have attempted to use is not defined for the given kinds of arguments (it may be defined for others).

=== Argument Passing

If a suitable match is indeed found, then the search stops. The system takes the result of the match function (the dictionary or "mapping") and "plugs it into" the right-hand side of the Definition. 

To do this, a very simple function called `subst()` is invoked. The function `subst()` simply takes an "original AST" and an AST-to-AST mapping, and replaces any sub-AST that is included in the keys of the mapping by the values of the mapping, calling itself recursively.

When `subst()` is done, the new AST that it produces is executed, which is akin to running the body of a function. This argument passing strategy is similar to "pass by name", which we discussed in @algolAndArgumentPassing.

=== Specificity and Matching

A problem with this Definition lookup procedure is this: suppose that the system needs to answer a question like "the amphibious fish is dead?". Let us suppose that the Knowledge Base contains two Definitions for the predicate "is dead", the first one in the list generically applies to any kind of fish (i.e., "a fish is dead means ...") and the second applies specifically to amphibious fish (i.e., "an _amphibious_ fish is dead means ...").

Since an "amphibious fish" is a kind of "fish", then the question we are trying to answer ("the amphibious fish is dead?") will match the definiendum of the first (general) Definition ("a fish is dead means...") which applies to a _generic_ kind of fish. This means that the amphibious fish will be (wrongly) treated as any other regular fish.

The solution we adopted to this problem is to keep the list of Definitions sorted by descending "specificity" of the definiendums. To do this, it is possible to define a special "comparison function" to be used by the sorting algorithm. 

This comparison function will return a positive number (+1) in case the first argument is more specific than the second, a negative number (-1) in case the opposite is true, and exactly zero in case the two arguments are completely equivalent (or completely unrelated, which makes no difference to the sorting logic).

The comparison function we described can be readily built from the match function we previously talked about. One simply needs to invoke match twice, swapping the arguments the second time, and comparing the two results as Booleans.

Sorting the list of Definitions by descending specificity of the definienda ensures that the most specific Definition will be found first, but only if a sentence that is specific enough is used.

The problem can persist if the noun phrase that is used is too generic for the actual shape of the object in the world model (e.g., "the fish" for "the amphibious fish"). It may be possible to overcome the problem for good by substituting ambiguous noun phrases by their more specific meaning in the STM _before_ searching for a Definition. 

For instance, if we ask the system the question "the fish is dead?", the system may substitute the noun phrase "the fish" with the more specific noun phrase "the amphibious fish" (because of what the STM contains) before even attempting to search for a definition of the predicate "is dead".

== Orders and Planning

We have seen how it is possible to add Definitions that determine the effects of executing a simple sentence. This makes the execution of a simple sentence akin to a function invocation (and sometimes to a _procedure_ call) in more traditional languages.

One must always keep in mind that any simple sentence may be subject to two interpretations ("ASK" mood and "TELL" mood) with the difference we discussed before: that the former (ASK) thinks of the simple sentence as an expression, i.e., it tries to verify if the condition it describes is true in the world model; and the latter (TELL) treats it as a statement, procedurally changing the world model according to what the sentence says it should look like.

Given the analogy we have made with procedures, and despite the actual "dual" nature (ASK versus TELL) of a Deixiscript AST, one could nonetheless conclude that Deixiscript is a kind of procedural (or imperative) language.

In a way this is true, as one can even define the meaning of a simple sentence as a sequence of steps, which can be achieved by joining together (through the `and` operator) multiple atomic statements (like simple sentences or variable assignments). The comma symbol (',') can also be used for the same purpose, and it behaves exactly like (indeed, it is aliased to) the `and` operator.

This however would overlook the last aspect of the language that we still need to discuss: automatic planning.

=== Facts versus Events

We will now introduce a distinction between two kinds of simple sentences. The two kinds are formally very similar (they are all represented by the same abstract syntax tree), but they have different syntax and semantics. We will call these two categories of simple sentences "Facts" and "Events". 

We think of a Fact as just a regular proposition (a statement about how the world is at any particular point in time), and we instead think of an Event as an action that can be performed by an agent (the grammatical subject of the sentence, for simplicity).

Syntactically speaking, we will represent Facts as simple sentences with a copular verb (i.e., the verb "to be"). For instance, the sentence: "the fish is dead" falls under this category. 

A Fact is a "static" state of affairs. A sentence representing a Fact describes the presence or absence of a particular situation "here and now" in the world model and always refers to the present tense (there are no other tenses in Deixiscript).

Events, on the other hand, will be represented by simple sentences with any verb other than the copula (i.e., other than the verb "to be"); for instance, "the player moves right".

An Event does not describe a static state of affairs, but rather a dynamic action (performable by an agent) that causes certain kinds of changes to the world model when it is performed by the agent.

As a side note, we should say that both the ASK and TELL moods make sense when applied to Facts; the system can "learn" (TELL) a fact, or it can "check" (ASK) a Fact. But the same distinction does not make much sense (in our current system) when applied to Events; the purpose behind performing an Event is purely to cause side-effects (TELL).

We already said that the abstract structure behind Facts and Events is the same; they both have a subject, an object and a "predicate". In case of an Event this predicate is a non-copular verb (e.g., to eat, to drink, to run), whereas in case of a Fact this predicate is an adjective (e.g., red, dead, near).

Some "adjectives" such as "near" (we will treat it as an adjective) are binary predicates because they require an object (e.g., "the cat is near _the mat_"); they are akin, in this sense, to transitive verbs (such as the verb "to eat").

=== Potentials

There are two kinds of simple sentences, as we have seen; so how does the system tell a "Fact" from an "Event"? The Potential AST type was introduced just for this: to mark certain kinds of simple sentences as a _potential_ action for a certain kind of agent, under a certain kind of circumstance.

A Potential specifies the condition under which a kind of Event can occur. A Potential also specifies the duration of this kind of Event, which is useful for the purposes of time-bounded planning and simulation, as we will see later. Syntactically, a Potential is (like a Definition) a kind of complex sentence.

Facts, Events and Potentials are the three basic ingredients for Deixiscript's limited notion of automated planning. The fourth ingredient is the "Order". An Order is a syntactic structure that consists of a noun phrase that represents an agent and of an expression (such as a Fact) that represents a goal to be accomplished by the aforementioned agent. Syntactically speaking, an Order will also end up looking like a complex sentence of sorts.

=== Search Heuristic

The search heuristic tries to find a finite sequence of Events (actions) that can be performed by an agent and that will result in (or at least get the agent "closer" to) the accomplishment of a goal.

This search relies on the presence in the Knowledge Base of: (1) Definitions that detail the effects of an Event alongside the kind of doer, and also on (2) the presence of Potentials that specify the possibility of an Event under a given circumstance and its duration.

=== The `plan()` function <planFunction>

The `plan()` function is responsible for carrying out this kind of heuristic search when needed; `plan()` takes an Order (agent and goal), a Knowledge Base, and a maximum duration (in seconds) of the plan to be found.

Searching for the plan's steps works as follows: 

(1) The goal expression is applied to the Knowledge Base (TELL) to produce a new "target" Knowledge Base that represents the world "as it should be". 

(2) A numerical error term is computed, which represents the difference between the desired state of the world model (contained in the target Knowledge Base) and the current state of the world model (contained in the old, original Knowledge Base).

(3) All of the actions that the agent could perform are retrieved. For simplicity, it is assumed that they coincide with the Potentials where the (kind of the) agent appears as a subject. 

(4) Each of these (possibly useful) actions is tried separately for effectiveness. An action is applied to the old Knowledge Base (TELL) and the error term is recomputed. If the new error term is less than the old one, then the action is deemed "useful", else it is not. 

(5) If the list of "useful" actions is empty, then the function returns an error value (because the possibility of generating any plan is precluded).

(6) If the _precondition_ for any of the "useful" actions is still false, then the _precondition_ is issued as an intermediate order (`plan()` is a recursive function).

(7) Otherwise, every "useful" action can already be performed by the agent. The list of steps, the duration of the plan, and the Knowledge Base are all updated.

The `plan()` function also has to foresee two special (but important) cases: (1) if the goal is already accomplished then the function returns the list of accumulated steps, this is the base case of the recursive algorithm; and (2) if the maximum duration set for the plan is ever exceeded, then the function also returns the accumulated list of steps, even if they do not accomplish the goal in this case.

#pagebreak()

The following pseudo-code better summarizes the operation of the `plan()` function, omitting the technical details and some of the error handling:

```

if goal is accomplished then: return steps.
if duration > max_duration then: return steps.

compute target kb (by TELLing goal to kb).
compute error term between target kb and kb.

for each potential in kb:
	
	action = potential.action.
	compute "new kb" (by TELLing action to kb).
	compute new error term between target kb and "new kb".
	
	if new error term < old error term then:
		the potential is useful.
		
if there are no useful potentials then: error out.

if for some useful potentials precondition is still false in kb then:
	try planning for the preconditions.
	then resume planning for the terminal (main) goal.
else:
	add each potential.action to the list of steps.
	then resume planning for the terminal goal.
```

=== Error Term ("Cost Function")

The reader will note that we have skipped over a few details, specifically the details of how the "error term" between two Knowledge Bases (between the respective two World Models) is computed.

It is to be recalled that a World Model (for us) just means a list of dictionary objects containing key-value pairs. Therefore, the error term is computed by cycling through each individual in the World Model and each key in an individual.

The error term is the sum of the absolute values of the differences between the values of each key in target World Model versus its value in the current World Model:

#linebreak()

$ sum_(i=0,k=0)^(i="#individuals", k="#keys") abs("WM"_("target")[i][k] - "WM"_("current")[i][k]) $


=== Offline versus Online Planning

As can be evinced, there are two ways in which the `plan()` function can be used. One way is analogous to what Hector Levesque calls "offline execution" in his book "Programming Cognitive Robots" @programmingCognitiveRobots (which we mentioned in @chapterFourCognitiveRobots), and the other is analogous to what he calls "online execution".

In offline execution, all of the steps of the plan (the whole plan) are computed in advance, whereas in online execution only one step (the next) is computed at a time. Actually, in our case, more than one step is computed even in online mode, but the computation stops as soon as the maximum tolerated duration is reached (the duration of the sequenced actions, not of the time taken to compute them).

In our prototype, offline execution is mostly intended for debugging purposes, to test whether a plan can be successfully computed, while online execution is useful to graphically simulate the interaction between agents.

=== The Main Loop

The kind of graphical simulations we have tried out involve a 2D world, where the individuals that have an x and a y coordinate as properties are displayed as colored points on a 2D Cartesian graph (we use the Matplotlib Python library to plot the graphs).

Before the simulation starts, "time is frozen". As soon as the simulation starts, the individuals in the World Model that have been given orders start behaving accordingly. Two numbers $M$ and $N$ are associated with the loop.

The number $N$ is the period of the loop, it determines the frequency with which the graphics are updated. Decreasing $N$ means increasing the frame rate of the simulation; for instance, setting $N$ to 100 milliseconds (0.1 seconds) means the frame rate will be $frac(1, 0.1) = 10$ Frames Per Second (FPS).

$M$ is the maximum tolerated planning time, it is used as a parameter for the `plan()` function which uses it as an upper bound for the duration of a computed partial plan. $M$ does not represent an objective time interval in seconds, because the simulation can be sped up and down by tweaking the number $N$. However, $M$ is important because setting a higher value of $M$ will allow the individuals to execute longer partial plans during a single iteration of the main loop, and vice versa for lower values of $M$.

To summarize: each partial plan should not exceed in "duration" the number $M$; and after the partial plans are computed, they are executed, the graphics are updated, and the loop waits for $N$ (actual) milliseconds before proceeding to the next iteration.

#pagebreak()

The main loop is approximately described by the following pseudo-code:

```
while true:
	for each order:
		steps=plan(order, kb, M)
		tell(steps, kb)
	
	for each individual in kb.world_model:
		draw(individual)
	
	wait(N)
```

=== REPL

The simulation can be started from the interpreter's custom Read Eval Print Loop (REPL) using the `:start-simulation` metacommand. Also within the REPL, the programmer can load a text file that contains Deixiscript source code using the `:load` metacommand (which takes the file path as an argument); or he/she can directly "inject" Deixiscript code into the environment by simply writing it to the command line and hitting enter. The programmer can also go back to a previous state of the Knowledge Base (actually, to a previous Knowledge Base) using the `:undo` metacommand.

== Concrete Syntax

Now that we have painted a picture of what each part of the Deixiscript language is supposed to do, we wish to take a step back and look at the whole from a different perspective.

We have sometimes hinted at the concrete representation that the abstract syntactic structures would take; for instance, we have said that Definitions, Potentials and Orders would end up looking like complex sentences. We have also said that (in general) the syntax would draw inspiration from English. However, we will say that it should also include some mathematical symbols (like most other programming languages) for the sake of convenience.

=== Backus-Naur Form (BNF)

We will now present (in a slightly more formal fashion) the concrete syntax of the Deixiscript language, and to do so we will use a dialect of the popular Backus-Naur Form (BNF) metalanguage for syntax description; we have discussed BNF in @algol, when talking about ALGOL 60.

The following presentation will omit some of the more technical details for the sake of clarity. The actual code that generates the parser is written in Lark's own dialect of BNF (Lark, as we said at the beginning of this chapter, is the parsing toolkit for Python that we are using), and contains some extra caveats and technicalities compared to the following simplified one.

==== Program

Firstly, any Deixiscript program contains at least a single statement, or more statements separated by a dot. We will express this in the equivalent BNF-like pseudo-code:

`<program> := <statement> | (<program> "." <statement>)`

==== Statement

A "statement" can be any of the following syntactic structures:

`<statement> := <expression> | <definition> | <potential> | <order> | <question> |<repetition> | <existential-quantifier>`

==== Expression

An "expression" is either a noun, or a simple sentence, or a binary expression:

`<expression> := <noun-phrase> | <simple-sentence> | <binary-expression>`

==== Question

A "question" is just a statement followed by a question mark (there is definitely room for improvement on this rule, as we have already observed in a previous section):

`<question> := <statement> "?"`

==== Simple Sentence

A simple sentence is a fact or an event; we wish to note that the distinction here is a purely syntactical one, i.e., after an event or fact is parsed it is transformed into the same simple sentence abstract tree:

`<simple-sentence> := <event> | <fact>`

An event is basically an English simple sentence with only a subject and an optional object (the question mark after the second occurrence of the noun indicates that it is optional):

`<event> := <noun-phrase> <verb> <noun-phrase>?`

A fact, instead, looks like a simple sentence with a copular verb (i.e., the verb "to be" in English). The first noun phrase is the subject, the second is the predicative adjective, and the third is the (optional) object:

`<fact> := <noun-phrase> <copula> <noun-phrase> noun-phrase>?`

==== Binary Expression

A binary expression is formed of two smaller expressions separated by a binary operator. The binary operator can be a logical operator ("and", "or"), a comparison operator (">", "<", etc.), an arithmetical operator ("+", "-", etc.) or the equal sign ("="), which (as already said), can be interpreted as an assignment or as an equality comparison depending on the surrounding syntactic context. 

The BNF code below shows the binary expression as a single production rule, but in practice it would be split into several similar-looking rules (logic, arithmetic, comparison, etc.) for the purpose of defining operator precedence:

`<binary-expression> := <expression> <binary-operator> <expression>`

==== Definition

A definition is a simple sentence followed by the harcoded verb "to mean", followed by any expression (the "meaning"):

`<definition> := <simple-sentence> "means" <expression>`

==== Potential

A potential is a noun followed by the hardcoded modal verb "can", followed by any (non-copular) verb, in turn followed by another (this time optional) noun (the direct object). There are two further optional parts of a potential: a duration in "seconds" and a condition (in no fixed order). If the condition expression (introduced by an "if") is not explicitly stated, it is assumed to be equal to the Boolean value "true", i.e., the action that the potential describes could be carried out unconditionally (at will, without constraints) by the relevant agent.

`<potential> := <noun-phrase> "can" <verb> <noun-phrase>? ["(" <number> "seconds" ")"] ["if" <expression>]`

==== Order

An Order is composed of a noun (the agent who receives the order), the hardcoded verb phrase "should ensure" and an expression (the agent's "goal").

`<order> := <noun-phrase> "should ensure" <expression>`

==== Repetition

A repetition statement is not really necessary (and we had not really mentioned it before), but we decided to add it just for convenience; it consists of a simple sentence followed by a number, in turn followed by the hardcoded word "times". A repetition, exactly as the name says, repeats an action a certain number of times, like in a loop.

`<repetition> := <simple-sentence> <number> "times"`

==== Existential Quantifier

The existential quantifier consists of the hardcoded string "there is" followed by a noun phrase:

`<existential-quantifier> := "there is" <noun-phrase>`

The existential quantifier supports both moods (ASK and TELL). In the case of ASK, it will return true if an individual corresponding to the noun phrase's description exists. In the case of TELL, it will attempt creating such an individual in the world model (acting like a "constructor" of sorts).

==== Noun Phrase

A noun phrase can be any of the following things:

`<noun-phrase> := <constant> | <noun> | <article-phrase> | <genitive-phrase> | <attributive-phrase> | <pronoun> | <variable> | <number> | <parenthesized-phrase>`

Constants are numbers, strings or Booleans; the ID type is not shown here because in principle it should not be accessible to the programmer (the ID of an individual is supposed to be used internally by the system), though the system could be easily extended to include a syntax for an "ID literal" which could be useful for debugging purposes:

==== Constant
  
`<constant> := <number> | <string> | <boolean>`

A `<noun>` is just a simple, basic English noun (actually any "non-verb word") among the ones that the parser recognizes. By itself, it is actually just treated as a string, and could in fact be considered a constant.

==== Article Phrase

A "real" noun (i.e., an implicit reference) is preceded by an English article (definite or indefinite); this is the kind of noun that will resolve to an ID when evaluated by the system:

`<article-phrase> := <article> <noun-phrase>`


==== Attributive Phrase

An "attributive phrase" adds an adjective to that kind of noun phrase. The adjective itself is another single noun, and can be preceded by a negative particle ("non"):

`<attributive-phrase> := "non-"? <noun> <noun-phrase>`

==== Genitive Phrase

A "genitive phrase" contains a noun phrase followed by a genitive particle ("apostrophe s") and a simple noun.

`<genitive-phrase> := <noun-phrase> "'s" <noun>`

==== Parenthesized Phrase

A "parenthesized phrase" is also a noun phrase, and it consists of an expression enclosed by parentheses. It can be useful to better specify the order of evaluation in mathematical formulas and the like:

`<parenthesized-phrase> := "(" <expression> ")"`

=== AST Transformations

As we have said, we use the Lark parsing toolkit for Python to parse a concrete syntax similar to the one we have just described. Parsing is just the process of converting a linear (monodimensional) representation of language (i.e., written text, or even spoken sound) into a bidimensional, tree-like structure that clearly reflects the hierarchical relationship between the expression's constituents.

Parsing, however, is just the first step of the process of obtaining an Abstract Syntax Tree (AST). After an initial (intermediate) "parse tree" is generated, this has to be converted (transformed) into an AST, which is a more convenient and easier to work with representation of the latter, as it leaves out many of the unimportant details.

These "unimportant details" may specify whether the user took advantage of the "sugared" version of a construct or not; syntax sugar is a more appealing (terser, more expressive, easier to read) syntax that is usually implemented on top of a less appealing (more verbose, less expressive, harder to read) one.

Another example of "unimportant detail" may be the presence or absence of parentheses in an expression, which outlive their usefulness as soon as the syntax tree has been built with the correct (user-intended) precedence of operators.

Lark provides some useful facilities to further transform the parse trees it generates into abstract syntax trees. The "Transformer" class it provides (completely unrelated to the "Transformer" neural network architecture in AI) performs a bottom-up traversal of the parse tree, allowing to define some further logic that converts the parse tree into a proper abstract syntax tree.

== Example Programs

We will now discuss three short example programs that showcase some of Deixiscript's capabilities, as well as some of its current weaknesses. We shall have more to say about those weaknesses and some proposed solutions in the next chapter, about the possible improvements to the language.

For the sake of convenience, we will assume that the following two Definitions have already been loaded (or typed) into the interactive environment, and are always available:

```
x's y increments means: x's y = x's y + 1.0.
x's y decrements means: x's y = x's y - 1.0.
```

=== 1. Envelope

The first example demonstrates the existential quantifier's uage as a "constructor" with the following code:

```
an envelope is sealed means the state = closed.
an envelope is red means the color = red.
there is a sealed red envelope.
```

Two rules are introduced that apply to envelopes: the first defines what it means for an envelope to be "sealed" and the second defines what it means for it to be "red". An envelope is then created with these two properties, and the resulting world model will contain an envelope that has a "state" property set to "closed" and a "color" property set to "red".

=== 2. Pronouns

The second example showcases the functioning of pronouns in Deixiscript. The following is the code:

```

a player moves right means: the x-coord increments.
a door opens means: the state = open.

there is a player.
the player's x-coord = 0.0.
there is a door.
he moves right and it opens.
```

The previous code defines the meaning of two kinds of actions (Events), one of which applies to a player, and the other applies to a door. In the sentence `he moves right and it opens`, the first pronoun ("he") resolves to the player because "he" is used as the subject of the verb "to move", whereas the second pronoun ("it") resolves to the door because "it" is used as the subject of the verb "to open".

As a side note: as of now there is no distinction between the pronouns (between the strings) "he" and "it", they are just synonyms to the interpreter. The example would have worked the same if those two pronouns had been swapped.

The world model's state after the execution of that last sentence will be one where the door has the property "state" set to the value "open", and the player has the property "x-coord" set to the numerical value 1.0.

=== 3. Fish

The third example showcases revisable rules, by defining a general rule and a specific one, and checking that they correctly apply to the relevant individuals.

#linebreak()

```

a fish is amphibious means the kind = amphibious.
a fish is dead means the location != water.
an amphibious fish is dead means the health <= 0.0.

there is a fish.
there is an amphibious fish.
the amphibious fish's health = 10.0.
the non-amphibious fish's location = land.
```
#linebreak()

Here we are defining three rules. The first is just a "dummy rule" to enable us to talk of the category of "amphibious" fish; the system needs a way (i.e., a property) to recognize an amphibious fish in the world model, and we could not think of anything nicer than just a somewhat boring "kind = amphibious" key/value pair.

The second rule defines "what it means to be dead for a generic fish" as being a fish out of the water (`location != water`). The third rule overrules the second by defining the death of an amphibious fish in other terms, in terms of a new "health" attribute having a value less than or equal to 0.

A fish and an amphibious fish were created. The amphibious fish's health was set to a positive number and the (normal) fish's location was set to "land". Now, if we asked the interpreter the following question: `the amphibious fish is dead?` it would return a `false`, and if we asked it whether `the non-amphibious fish is dead?`, it would return a `true`.

Of course, changing the values of their attributes (e.g., setting the normal fish's location to "water") would change the values of the answers to the previous questions.

=== 4. Player/Enemy <playerEnemy>

The fourth example concerns the automated planning of a (very simple) strategy that (only) one of the two individuals will "carry out" to fulfil its goal. The code is the following:

#linebreak()

```
an enemy can hit a player, if the enemy is near the player.

an enemy is near a player means: 
    the enemy's x-coord = the player's x-coord, 
    the enemy's y-coord = the player's y-coord.

an enemy hits the player means: 
    the player's health decrements.

a player is dead, means the health = 0.0.

an enemy moves right means the x-coord increments.
an enemy moves left means the x-coord decrements.
an enemy moves down means the y-coord increments.
an enemy moves up means the y-coord decrements.
an enemy can move right.
an enemy can move left.
an enemy can move up.
an enemy can move down.

there is an enemy.
there is a player.
the player's health = 400.0.
the player's x-coord = 350.0.
the enemy's x-coord = 150.0.
the player's y-coord = 300.0.
the enemy's y-coord = 100.0.
the enemy's color = red.

the enemy should ensure the player is dead.
```

#linebreak()

The program declares several capabilities of an "enemy". An enemy can move in a variety of directions (left, right, up, down) at will; an enemy can also "hit" a player, but only if it is "near the player". The interpreter is told what it means for the enemy to be near the player (in terms of x and y coordinates) and what it means for it to hit the player (the player's health decreases). The interpreter is also told what it means for a player to be dead (in terms of its "health"). Then the enemy is given the order to "ensure the player is dead".

One thing to note, unfortunately, is that this code is quite verbose and there seem to be a lot of unnecessary repetitions; we will try addressing this problem in the next chapter.

The overall effect of the program, when run in simulation mood, is to show a static black dot (the player), and a moving red dot (the enemy) that attempts to reach the black dot, changing direction if necessary (for example when the position of the player is changed by modifying its x-coord or y-coord attributes through the REPL). Once the enemy reaches the player, it will "hit" it until the player's health becomes zero. At that point (when the player is "dead"), if it changes position again, the enemy will not move; unless of course the health of the player is incremented through the REPL, which will cause the enemy to "reawaken" and resume "chasing" the player.

This behavior of the enemy is achieved without telling the enemy explicitly what to do, as it is rather the `plan()` function (@planFunction) under the hood that computes a strategy for the enemy.

A strategy is expressed in terms of the actions that are available to the enemy. For instance, `the enemy moves right, the enemy moves up, the enemy hits the player, the enemy hits the player`, would work (for example) if the enemy was at position (1,2) on the Cartesian plane and the player was at position (2,3) and had 2 health points. 

Of course, as we have said before, what is actually computed during a simulation session is generally a partial plan, that only gets the enemy closer to accomplishing the goal (and, in this case, this literally means getting _closer_ to the player).

Another thing to note about the program is that the way the rule for the predicate "near" is defined introduces a problem that we will also discuss (also proposing a tentative solution for it) in the next chapter.

Figures 2-5 show four commented screenshots that illustrate the execution of this program in the interactive environment (REPL).

#figure(
	image("figures/repl1.png", width: 80%),
	caption: "Before loading the program into the interactive environment, the cartesian graph is empty.",
)

#figure(
	image("figures/repl2.png", width: 80%),
	caption: "When the program is loaded, two colored dots appear on the graph. We can also inspect the state of the world model with the appropriate metacommand. As we can see, the player initially has a positive health and is located away from the enemy."
)

#figure(
	image("figures/repl3.png", width: 80%),
	caption: "When the simulation is started, the red dot (representing the enemy) begins moving toward the black dot (representing the player)."
)

#figure(
	image("figures/repl4.png", width: 80%),
	caption: "After a while, the enemy reaches the player and begins 'hitting' it, decreasing its health. We can see here the final stage of the process: the enemy's location is the same as the player's location, and the player's health is zero."
)

=== 5. Player/Enemy/Defender <playerEnemeyDefender>

The last example is an extension of the fourth, it demonstrates automated planning in the presence of two individuals with different (clashing) goals. In this example a new individual (the "defender") is added to the mix, who will oppose the enemy.

Unfortunately, ordering the defender to ensure that the player stays alive (i.e, player's life > 0) will not work in the present version of Deixiscript. This is due to the simplicity (and limitation) of the current plan-finding heuristic (described in @planFunction).

Hence, to achieve the same effect, we will instead have to order the defender to "ensure the enemy is dead" (thus implicitly _defending_ the player).

To achieve this, we will have to add some more rules to the program we already had (and modify some existing ones), the resulting code is the following:

#linebreak()

```
an enemy can hit a player, if the enemy is near the player.
a defender can hit an enemy, if the defender is near the enemy.

an enemy is near a player means: 
    the enemy's x-coord = the player's x-coord, 
    the enemy's y-coord = the player's y-coord.

a defender is near an enemy means: 
    the defender's x-coord = the enemy's x-coord, 
    the defender's y-coord = the enemy's y-coord.

an enemy hits the player means: 
    the player's health decrements.

a defender hits an enemy means: 
    the enemy's health decrements.

a player is dead, means the health = 0.0.
an enemy is dead, means the health = 0.0.
a player is alive, means the health > 0.0.
an enemy is alive, means the health > 0.0.

an enemy moves right means the x-coord increments.
an enemy moves left means the x-coord decrements.
an enemy moves down means the y-coord increments.
an enemy moves up means the y-coord decrements.

an enemy can move right if the enemy is alive (0.2 seconds).
an enemy can move left if the enemy is alive (0.2 seconds).
an enemy can move up if the enemy is alive (0.2 seconds).
an enemy can move down if the enemy is alive (0.2 seconds).

a defender moves right means the x-coord increments.
a defender moves left means the x-coord decrements.
a defender moves down means the y-coord increments.
a defender moves up means the y-coord decrements.
a defender can move right.
a defender can move left.
a defender can move up.
a defender can move down.

there is an enemy.
there is a player.
there is a defender.

the player's x-coord = 350.0.
the player's y-coord = 300.0.
the player's health = 400.0.

the enemy's x-coord = 50.0.
the enemy's y-coord = 100.0.
the enemy's health = 10.0.
the enemy's color = red.

the defender's x-coord = 300.0.
the defender's y-coord = 450.0.
the defender's color = blue.

the enemy should ensure the player is dead.
the defender should ensure the enemy is dead.
```

#linebreak()

We essentially had to add rules to make sure that the defender could move and hit the enemy (just like the enemy can hit the player). We also modified the enemy's potentials to move: now the enemy can only move if it is alive (health > 0), this is to ensure that it (the enemy) will stop "dead in its tracks" when it is "killed" by the defender. Obviously, the code now has to declare an initial health for the enemy too, not just for the player.

The enemy was also made a little slower than the defender, by specifying that the time taken for it to move in any direction is 0.2 "seconds", which is more than the (default) of 0.1 "seconds" of the potentials where the Event's duration is undeclared.

Figures 6-9 show some more commented screenshots that illustrate the execution of this program in the REPL.

#figure(
	image("figures/defender1.png", width: 80%),
	caption: "The program is loaded into the interactive environment. The graph shows three points with different colors. As before, the red point is the enemy and the black point is the player. A blue points appears as well, representing the defender. For the sake of better illustrating the paths taken by the moving points on the graph, we will execute the show-trail metacommand, which will plot some red points in any spots where the individuals have been.",
)

#figure(
	image("figures/defender2.png", width: 80%),
	caption: "As soon as the simulation is started, the enemy (red) will try approaching the player, and the defender (blue) will in turn move towards the enemy. We have currently put the simulation on hold using the pause-simulation metacommand",
)

#figure(
	image("figures/defender3.png", width: 80%),
	caption: "While the simulation is paused, we will \"teleport\" the enemy downwards by manually setting its y-coordinate to a lower value.",
)

#figure(
	image("figures/defender4.png", width: 80%),
	caption: "As soon as we resume the simulation (using the start-simulation metacommand) the enemy from its new position will still try getting to the player, while the defender takes a sharp turn to its left to intercept the enemy coming from a new angle. We have put the simulation on hold once more, using the pause-simulation metacommand.",
)

#figure(
	image("figures/defender5.png", width: 80%),
	caption: "After resuming the simulation once more, the defender finally intercepts the enemy and hits it. The enemy's health suddenly drops to zero, so it stops moving; the defender halts too, because it no longer has any reason to move. We can inspect the current state of the world model with the show-model metacommand. As we can see, the enemy's health is zero, and the player's health is still intact. The player was successfully defended.",
)
