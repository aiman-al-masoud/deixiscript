= Programming Languages

The naturalistic approach can be seen as a new programming paradigm, albeit one which the principles of which aren't still well defined much less well established; it may be of some help to briefly review the main (most popular) programming paradigms as of today, before trying to formulate ideas 

== Procedural Programming

Procedural programming is a kind of Imperative programming, because it lets the programmer handle state and control flow explicitly.

There are other kinds of Imperative programming such as unstructured programming which makes use of goto statements, but Procedural programming relies on structured programming techniques (control flow structures such as loops and if statements rather than gotos) and procedures (a kind of routine) to modularize the program.

Procedural programming is an old and well established idea. Most of the popular general purpose programming languages nowadays (2023) fully support procedural programming, although none of them is "purely procedural". 

It is fair to say that it's the way most programmers first learn to code.

A Procedure is a kind of Routine (a distinct block/sequence of code intended to be reused) which, unlike a Pure Function, can have side-effects.

Procedural programming typically conceives data (primitives, structs/records) and instructions/behavior (statements, functions) as separate entities.

The natural language parallel of procedural programming is something like detailing the steps of a recipe.

// % https://survey.stackoverflow.co/2023/#technology
// % https://en.wikipedia.org/wiki/Procedural_programming
// % https://medium.com/codex/procedural-programming-was-procedural-programming-is-procedural-programming-will-be-a26131cb463f


== Object Oriented Programming

An extremely popular programming paradigm, supported to some degree by all of the most popular languages (2023), usually used in conjunction with [procedural programming](./1-procedural.md), and thus being often described as an imperative style of programming, though this need not be the case.

The core of OOP is the idea that objects should combine data and behavior into a single entity, which interacts with other entities through message passing. 

The traditional four pillars of OOP are: data abstraction, encapsulation, inheritance, and polymorphism.

An object should manage their state internally, hiding it from the others.

In practice, message passing is usually though of and implemented as a procedure call, though purely object oriented languages (and "actor-oriented" languages) do in fact exist.

Computer scientist Alan Kay, creator of the language Smalltalk, is usually cited as the "father" of OOP, albeit his own conception of the paradigm differs somewhat from the more popular procedural-based version.

Most OOP languages are class-based, a class is a template that is used to create instances of objects. This again, however, isn't the sole approach: a minority of languages are instead prototype-based: a prototype is a fully functioning object of its own, that can be cloned later if more instances of it are needed.

Inheritance is a moderately controversial topic among modern programmers, due to the rigidity of hierarchies, the problems related to refactoring, and the danger inherent to multiple inheritance (MI). Mixins and traits are slightly different modern alternative to MI.

Another important concept of (though not exclusively of) OOP is polymorphism: the idea that the same interface can apply to different underlying implementations.

The natural language parallels of OOP are many and varied: the concept of agents or efficient causes (data+behavior), the idea of these agents interacting together to achieve a common goal (message passing), and the subdivision of the world into concepts and subconcepts (classes and inheritance).

// % https://www.merriam-webster.com/dictionary/agent
// % https://survey.stackoverflow.co/2023/#technology
// % https://en.wikipedia.org/wiki/Object-oriented_programming
// % https://medium.com/nerd-for-tech/the-four-pillars-of-object-oriented-programming-39efe4e87afc


== Functional Programming

While it is a tenet of OOP that state should be hidden behind objects, Functional Programming takes the more radical approach of abolishing state (aka: mutable state) altogether from most of the codebase, isolating it from the core logic.

Pure functional programming is a declarative...

A very concise way of defining pure FP is that it is about: Pure Functions and immutable data structures.

A pure function is a function whose output depends entirely on its inputs (referential purity) and whose evaluation does not alter the state of any data structure (absence of side-effects).

An example of an impure function would be, for example, anything that has to do with I/O, like even a simple print function.

As a consequence of this, FP bans the use of iteration and iterative control flow strcutures such as loops: because they require mutable variables, and only makes use of recursion as the basic way of repeating instructions; but it builds numerous higher level abstractions on top of it, many of which (functions as first class citizens and higher order functions) have since made it into most mainstream programming languages.

In theory, FP and OOP are compatible to a large extent (cf. Scala) and it is possible to write a program using immutable objects which respects the rules of both paradigms to a large degree.

Functional programming takes most of its ideas from lambda calculus, a field of pure mathematics.

// % https://en.wikipedia.org/wiki/Functional_programming
// % https://www.amazon.com/Functional-Programming-Simplified-Alvin-Alexander/dp/1979788782

== Logic Programming

Logic Programming is based on a different branch of mathematics: formal logic, mostly predicate logic, though a few higher order logic based languages exist.

It is, not unlike FP, a declarative style of programming: logical implications are declared, usually in the form of a horn clause, and then are used to formally prove statements.

// % https://en.wikipedia.org/wiki/Logic_programming


== The End of Programming

Computer Scientist Matt Welsh has argued that traditional programming done by humans will become obsolete as a result of the advancement of AI systems that can be told what to do in natural language and come up with solutions for problems they were never explicitly taught how to deal with (zero-shot learning).

However, the proliferation of guides on how to best use modern LLMs and the birth of Prompt Engineering suggests that a certain level of experience will be still needed to make effective use of these new "executable English" systems.

Natural language thus seems to be the new frontier of programming, and a decent understanding of natural language, its style at describing problems, its advantages over traditional programming languages and its limitations will be crucial over the next decades, as LLMs grow more powerful and useful.


// % https://www.promptingguide.ai/
// % https://it.wikipedia.org/wiki/Matt_Welsh
// % https://cacm.acm.org/magazines/2023/1/267976-the-end-of-programming/fulltext
// % https://www.tcg.com/blog/on-the-wisdom-of-natural-language-programming/