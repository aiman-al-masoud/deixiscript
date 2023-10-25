## Naturalistic Programming

Natural/istic programming is a broad term that can be applied to all those attempts (with varying degrees of sophistication) at using a more or less realistic subset of natural language to write code.

The idea of instructing a computer in natural language (or something similar enough to deserve that name) has, long before the advent of Large Language Models, been a dream and sometimes a nightmare, for people in computer science.

## Skepticism

The advantages of programming in natural language haven't always been clear to everyone.

There has been no unanimous agreement on what extent programming in natural language may be advantageous, let alone be a desirable state of affairs in the first place.

Edsger Dijkstra (1930-2002), notable computer scientist, advocate of structured programming and famous for (among the other things): the Dijkstra shortest path algorithm, the Banker's algorithm and the concept of semaphore in multi-threaded computing, was very skeptical to say the least.

Dijkstra wrote a short piece in 1978 lambasting what he called "natural language programming". Not only was "natural language programming" a difficult technical feat to accomplish indeed, but had it ever been accomplished, it would actually do more harm than good [np7](./bib.md#np7)

He argued that simple, elegant formalisms and narrow interfaces were and still are the key to past and future progress in fields such as mathematics and computer science, and that natural language would only do harm due to its intrinsic ambiguousness and the ease with which it can produce nonsensical statements. 

It is also quite true that back in the day computers weren't nearly as widespread as in 2023, and people who were using them were more often than not experts trying to solve specialized problems rather than end-users seeking a more intuitive mode of interaction with their machines.

## Precision/Expressiveness Tradeoff

<!-- fox and grapes -->
But taking a step back, even from the point of view of implementation, a tradeoff exists between the naturalness and expressivity on the one side, and the ease of implementation and precision of a formal language on the other [np9](./bib.md#np9).

Within the PENS classification scheme, a set of widely different Controlled Natural Languages (CNLs) based on English are classified by 4 metrics: Precision, Expressiveness, Naturalness and Simplicity.

Or, respectively: the level of independence from context (P), the amount of expressible propositions (E), the similarity to natural language (N) and the ease of (computer) implementation (S).

The study found, among the other results, that Precision and Simplicity are positively correlated, Expressiveness and Simplicity are negatively correlated and Naturalness and Expressiveness are positively correlated. This corresponds to our initial intuitions.

There is a tradeoff, and this tradeoff is emblematic of a problem. The push toward reasearch in naturalistic programming stems in part from the shortcomings of contemporary programming languages [np10](./bib.md#np10), [np3](./bib.md#np3), [np1](./bib.md#np1).

In these works, it is argued that the abstractions that power the current generation of programming languages, while powerful enough to support general purpose programming, are insufficient for tackling certain kinds of problems concisely, resulting in verbose, repetitive and suboptimally organized code.

The example of Aspect Oriented Programming (AOP) is brought up to elucidate the point. AOP, it is argued, offers an elegant and powerful way to express cross-cutting concerns, which traditional Object Oriented Programming (OOP) languages lack [np3](./bib.md#np3).

An example is logging all of the calls to functions with such and such a name or signature. In a traditional OOP language you would have to insert a call to a logging function in every such function that you wished to track the activity of. In an AOP language this is a concern that can be handled by an Aspect, written as "separate chapters of the imaginary book that describes the application" [np3](./bib.md#np3).

It is further argued that this is a prelude of the evolution of naturalistic traits in programming languages, as the mechanism used by AOP is similar to how we would actually use natural language's referenatial capabilities to describe solutions to a problem (splitting it into different "chapters").

The need for better abstractions is also reflected in the criticism of software design patterns as a poor language's solution to the lack of more powerful abstractions [p1](./bib.md#p1), and in the practice of Literate Programming [p11](./bib.md#p11).

## Literate Programming

Donald Knuth (1938-), a computer scientist known for his foundational work in time complexity theory and for creating the TEX markup and typesetting system, coined the term "Literate Programming" in 1984 to describe his original approach to writing programs.

Knuth designed a language called "WEB"; apparently back when he chose this name for it, it was "one of the few three-letter words of English that hadn’t al-
ready been applied to computers" [p11](./bib.md#p11).

The language WEB combines a markup language with a traditional general purpose programming language (TEX and PASCAL respectively, in Knuth's original work); the idea is that a program is a web of components, and that it is best to describe the links between these components using a mix of natural language descriptions (using TEX) and formal notation (using PASCAL).

According to this philosophy, the program should make sense to a human being first and foremost, so the majority of it is composed of natural language sentences and phrases, interspersed with (relatively little) definitions in formal language. 

This is akin to how a typical math text book is organized, mirroring this observation: "The insight here is that a program should be written primarily in a natural language, with snippets of code in more appropriate syntax as (and only as) required" [pn19](./bib.md#np19).

## Natural Style

It is interesting to take a look at how people usually describe problems and their solutions in natural language. It is telling that the manner, style and train of thought in describing an algorithmic procedure employed by a person on the street, or even by a programmer when elaborating an idea in the abstract, can be very different from that which the same programmer employs when translating his/her ideas into executable code [np11](./bib.md#np11), [np1](./bib.md#np1).

An early and oft-cited study in this respect is the one conducted by L. A. Miller in 1981 [np11](./bib.md#np11). A group of college students who were not familiar with computers were asked to provide solutions to six file manipulation problems, and their proposed solutions (in natural language) were evaluated for metrics such as preference of expression and contextual referencing.

It was found that the students were prone to using contextual references such as pronouns and words like "the previous" and "the next", a phenomenon broadly known as Deixis, of which we speak in the chapter on linguistics. They would also do this rather than explicitly assigning variables.

The students preferred to treat data structures in a cumulative way, using universal quantifiers rather than loops to express operations that had to be carried out on multiple instances of a data structure. They actually avoided using any of the traditional structured programming constructs (if-then-else, while, for...) or even unstructured programming constructs (goto statements).

When describing an algorithm, the students tended to begin by the most general and crucial step of the procedure, to only then mention those special cases which required a different sort of treatment; further refining, or annotating, an initial general statement is an idea that is also brought up in [ai1](./bib.md#ai1) and seems to be an important trait of how humans naturally tend to describe things.

This is often not the case in code, where such things as crucial steps buried within deeply nested ifs, and guard clauses and early returns to reduce the level of nesting and help ease the mental overload of such early checking for special cases are the order of the day.

The subjects also expected the computer to possess a pragmatic knowledge of the world and of their intentions, and to fill in the semantic gaps whenever needed. "They blamed the mechanical slave for its strict obedience with which it carried out its given instructions, even if a moment's thought would have revealed that those instructions contained an obvious mistake" [np7](./bib.md#np7) as Dijkstra would've put it.

A positive, implementation-wise, finding is that the subjects tended to use a relatively restricted vocabulary, though they still seemed to be using synonyms sometimes.

## Stories and Code

What do programming and story telling have in common? A lot, actually, according to a 2005 study that involved a system which automatically translated "stories" to scaffolding (or underspecified) code fragments in Python [np4](./bib.md#np4), [np5](./bib.md#np5).

The transpiler, called Metafor, was integrated with a "with a large knowledge base of Common Sense Knowledge, Concept-Net (Liu and Singh, 2004), derived from Open Mind a corpus of 750,000 natural language statements of Common Sense knowledge contributed by 15,000 Web community volunteers" [np4](./bib.md#np4).

A very interesting concept discussed in this work is that ambiguity isn't always bad, on the contrary, it can be desirable under certain circumstances: as a means of avoiding difficult design decisions at too early of a stage in a project; and indeed Metafor was designed to automatically refactor the output Python code whenever it received an indication that the representation had to change, for instance, by promoting attributes to sub-classes [np4](./bib.md#np4). This also ties in well with the idea of "successive refinements" mentioned earlier.

The paper also touched upon the concept of "programmatic semantics", also expanded upon another work [np5](./bib.md#np5) by the same authors; which is the idea that natural language structures imply and can be mapped upon the more traditional programming structures from structuted programming and OOP: "A surprising amount of what we call programmatic semantics can be inferred from linguistic structure" [np4](./bib.md#np4).

The authors propose, for instance, that a noun phrases may correspond to data structures, verbs to functions, and so on, and we propose a slight modification to these ideas in [Deixiscript](./7-deixiscript.md).

The code produced by the system was never really meant to be complete or executable, but its main purpose was to facilitate outlining a project, especially for novice users. And it showed promising results when it was tested by a group of 13 students (some with novice and some with intermediate programming skills), in trying to answer the question of whether they'd be likely to use it as a brainstorming tool rather than more traditional pen-and-paper methods [np4](./bib.md#np4).

## General Purpose Systems

There have also been more complete attemps at creating a natural language programming system, usable for general purpose programming. We will proceed to mention three of what we think may be the most important ones: Pegasus, CAL-4700 and SN.

### Pegasus

The original implementation of Pegasus is laid out in a 2006 paper [np1](./bib.md#np1) by Roman Knöll and Mira Mezini, the former of which I had the pleasure of contacting privately via e-mail, and who has confirmed that the project and related work are still under active development although the official webpage hasn't been updated since 2018, on the date of writing this [np20](./bib.md#np20).

According to the authors, the main features that distinguish natural language from programming languages are: implicit referecing, compression and context dependence.

Implicit referencing refers to the usage of Deixis in speech, pronouns such as "it", "he", "she", words like "the former", "the latter" and demonstratives like "this", "that" are all words clearly exemplify this phenomenon. 

Compression is a mechanism that avoids the tedious repetition of information and it can be of two kinds: syntactic or semantic. The former refers to the use of words such as "and" in a sentence like: "you pet the cat and the dog" understood as an abbreviation for "you pet the cat and you pet the dog". An example of semantic compression would be the in sentence "first go from left to right, then viceversa", where "viceversa", in this case, would mean: "from right to left".

Context Dependence refers to the fact that, contra most programming languages, the same string in natural language can be reduced in different ways depending on the surrounding context, not only on the string itself. In the sentence: "the mouse runs, then it jumps, the cat kills it, then it jumps" there are two identical instances of the phrase "then it jumps": in the former the pronoun "it" refers to the mouse, in the latter the pronoun "it" refers to the cat.

These three mechanisms, in the authors' opinion, all help in reducing the amount of redundancy in our spoken and written communication [np1](./bib.md#np1).

The authors propose a distinction between what they call "Atomic" versus "Complex" ideas, the former stemming directly from human perception (such as "the smell of wood", or "the warmth of wood"), and the latter being a combination of the former (such as the very idea of "wood").

They also recognize a third category of ideas they call "Composed", which "combine several Complex ideas for a short moment"[np1](./bib.md#np1), effectively corresponding with propositions, such as the meaning of the sentence: "the car drives on the street".

The authors go ahead to describe a formalism they call "the idea notation" to express concepts and thoughts in this framework, and to perform automatic computations on them.

<!-- The authors also mention a distinction they assert is a general trend in natural languages: nouns (entities), verbs (actions) and adjectives and adverbs (properties). -->

The architecture of Pegasus is described as being composed of three parts: the Mind, the Short Term Memory and the Long Term Memory

The Mind is what matches ideas to idea-patterns stored in Pegaus's long term semantic network. An idea-pattern is associated to an action, which is performed when the Mind determines that it matches an idea recevied as an input.

The Short Term Memory is what enables Pegasus to contextually resolve pronouns such as "it", and other deictic words and phrases. It is implemented as a bounded queue, and purposefully limited to 8 memory cells (corresponding to eight recently mentioned entities), as the authors think this is optimal for human operation [np1](./bib.md#np1). 

Lastly, the Long Term Memory stores Pegasus's semantic knowledge, for example is-a relationshipts between concepts.

When an idea and its sub-ideas are fully resolved as an action, such a system can execute it directly as an interpreter would, or generate the equivalent code in the selected backend, the paper mentions Java as an example.

An interesting and novel idea mentioned in the paper is that of a translatable programming language: Pegasus is designed to be language-independent at its core, this means that many different front-ends, corresponding to different concrete grammars, can be implemented for it. For instance, the paper mentions Pegasus's capability of reading both English and German, and even of freely translating between a language and the other.

The paper mentions AppleScript as one of the other programming languages that were, for a period of time at least, multilingual; AppleScript's keywords were translated in multiple different languages. In any case, AppleScript took the popular approach of "masking" the rather traditional structured programming constructs with a thin natural language mask.

### CAL-4700


-------------

- [Pulido](../../attachments/a-survey-of-naturalistic-programming-techniques.pdf)
