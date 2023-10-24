Natural/istic programming is a broad term that can be applied to all those attempts at using a more or less realistic subset of natural language to write code.

The idea of instructing a computer in natural language (or something similar enough) has, long before the advent of Large Language Models, been a dream and sometimes a nightmare, for people in computer science.

# Motivation

The advantages of programming in natural language haven't always been clear to everyone.

There has been no unanimous agreement on what extent programming in natural language may be advantageous, let alone be a desirable state of affairs in the first place.

Edsger Dijkstra (1930-2002), notable computer scientist, advocate of structured programming and famous for (among the other things): the Dijkstra shortest path algorithm, the Banker's algorithm and the concept of semaphore in multi-threaded computing, was very skeptical to say the least.

Dijkstra wrote a short piece in 1978 lambasting what he called "natural language programming". Not only was "natural language programming" a difficult technical feat to accomplish indeed, but had it ever been accomplished, it would actually do more harm than good [np7](./bib.md#np7)

He argued that simple, elegant and narrow formalisms were and still are the key to past and future progress in fields such as mathematics and computer science, and that natural language would only do harm due to its intrinsic ambiguousness and the ease with which it can produce nonsensical statements. 

It is also quite true that back in the day computers weren't nearly as widespread as in 2023, and people who were using them were more often than not experts trying to solve specialized problems rather than end-users seeking a more intuitive mode of interaction with their machines.

<!-- fox and grapes -->
But taking a step back, even from the point of view of implementation, a tradeoff exists between the naturalness and expressivity on the one side, and the ease of implementation and precision of a formal language on the other [np9](./bib.md#np9).

Within the PENS classification scheme, a set of widely different Controlled Natural Languages (CNLs) based on English are classified by 4 metrics: Precision, Expressiveness, Naturalness and Simplicity.

Or, respectively: the level of independence from context (P), the amount of expressible propositions (E), the similarity to natural language (N) and the ease of (computer) implementation (S).

The study found, among the other results, that Precision and Simplicity are positively correlated, Expressiveness and Simplicity are negatively correlated and Naturalness and Expressiveness are positively correlated. This corresponds to our initial intuitions. 

There is a tradeoff, and this tradeoff is emblematic of problem. The push toward reasearch in naturalistic programming stems in part from the shortcomings of contemporary programming languages [np10](./bib.md#np10), [np3](./bib.md#np3), [np1](./bib.md#np1). 

In these works, it is argued that the abstractions that power the current generation of programming languages, while powerful enough to support general purpose programming, are insufficient for tackling certain kinds of problems concisely.

The example of Aspect Oriented Programming (AOP) is brought up to elucidate the point. AOP, it is argued, offers an elegant and powerful way to express cross-cutting concerns, which traditional Object Oriented Programming (OOP) languages lack. 

An example is logging all of the calls to functions with such and such a name or signature. In a traditional OOP language you would have to insert a call to a logging function in every such function that you wished to track the activity of. In an AOP language this is a concern that can be handled by an Aspect, written as "separate chapters of the imaginary book that describes the application" [np1](./bib.md#np1).

It is further argued that this is a prelude of the evolution of naturalistic traits in programming languages, as the mechanism used by AOP is similar to how we would actually use natural language's referenatial capabilities to describe solutions to a problem.

The need for better abstractions is also reflected in the criticism of design patterns as a poor languages's solution to more powerful abstractions [p1](./bib.md#p1), and in the practice of Literate Programming [p11](./bib.md#p11).

Donald Knuth (1938-), a computer scientist known for his foundational work in time complexity theory, coined the term Literate Programming in 1984 to describe his new approach to writing programs.

Knuth designed a language called "WEB"; apparently back when he chose this name for it, it was "one of the few three-letter words of English that hadn’t al-
ready been applied to computers" [p11](./bib.md#p11).

The language WEB combines a markup language with a traditional general purpose programming language (TEX and PASCAL in Knuth's original work); the idea is that a program is a web of components, and that it is best to describe the links between these components using a mix of natural language descriptions and formal notation.

The idea is that a program should make sense to a human being first and foremost, so
the majority of it is composed of natural language, interspersed with (relatively little) definitions in a formal language. 

This is akin to how a typical math text book is organized, mirroring this observation: "The insight here is that a program should be written primarily in a natural language, with snippets of code in more appropriate syntax as (and only as) required" [pn19](./bib.md#np19).







------------------------------



* I problemi sono: stile, semantica e conoscenza pragmatica del mondo.

* I soggetti preferivano gestire le strutture dati in maniera più astratta ("in massa") rispetto a gestirle con l'iterazione (ciclo for).

* I soggetti si aspettavano che il computer capisse le implicazioni semantiche dei comandi che davano.

* I soggetti facevano uso pesante di riferimenti contestuali.

* I soggetti usavano un lessico abbastanza ristretto (vantaggio).

* I soggetti non controllavano né il formato né la sintassi dei file.

* I soggetti non facevano riferimento a strutture di controllo esplicite (if-then-else, goto, while, for ...), probabilmente sperando di attingere ad un'esperienza procedurale pragmatica del proprio "interlocutore".

* I soggetti non assegnavano esplicitamente valori alle variabili, e non le dichiaravano, e usavano sinonimi.

* I soggetti partivano dal passo più cruciale della procedura, per poi precisare quando NON farlo. Al contrario, nei linguaggi di programmazione si ricorre spesso alle guard clauses, o agli if annidati, e si mette il passo cruciale alla fine, o in mezzo.

-------------

# Natural vs Formal

- [Miller](../../attachments/naturalistic-style-miller-1980s-paper.pdf)
- [Pulido](../../attachments/a-survey-of-naturalistic-programming-techniques.pdf)
- [Fantechi](../../attachments/fantechi.pdf#121)
- [PENS](../attachments/pens-ranking-controlled-langskuhn2014cl.pdf)
- [formal lang wiki](https://en.wikipedia.org/wiki/Formal_language)

<!-- A Survey of Naturalistic Programming Technologies -->
<!-- Natural language programming: Styles, strategies, and contrasts -->
<!-- Language and Communication Problems in Formalization: A Natural Language Approach -->
