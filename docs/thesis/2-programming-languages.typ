When we speak of programming languages in the contemporary sense, we generally refer to a particular kind of computer language (a formal language that can be processed by computers) that is suitable for what we call general purpose programming. This usually involves the property of turing completeness; that is, the ability to emulate certain aspects of a Turing Machine, the epitome of the theoretical general purpose computing device.

Just like there are thousands of natural languages, some of which are used and understood all over the world, and many more of which are only used by a relatively restricted number of speakers; so too there are myriads of programming languages: some of which have achieved world-fame and are widespread in the industry, and many more of which remain relatively esoteric.

It is usually much easier for a programmer to master multiple programming languages during the course of his or her lifetime, than it is for him or her to master the same number of natural languages. This is at least in part due to the objective complexity of any natural language as compared to any programming language (we just don't notice it as human beings); but it is also in part due to the fact that programming languages (even, possibly, very different looking ones) generally fall into a restricted number of groupings, identified by their dominant programming paradigm.

As we will see, some of the most popular programming paradigms of all times are: procedural programming, object oriented programming, functional programming and logical programming. Some languages tend to stick to a specific paradigm more than other languages, emphasizing the paradigm's "purity" over the possibility of a hybrid approach; other languages are know as "multi-paradigm" because they support or even encourage the use of different paradigms for different kinds of tasks; some paradigms mix well together, and others do so to a lesser degree.

Programming paradigms themselves generally fall into two main categories: imperative and declarative.Broadly speaking: the imperative approach is about instructing the machine on how to do something on a step by step basis, while the declarative approach specifies the requirements and leaves the more open-ended specifics of how to accomplish them to the machine.

The programming paradigms mentioned two paragraphs ago by no means exhaust all of the existing paradigms, let alone all of the possibly existing but not yet discovered ones, but it is nonetheless useful and instructive to take a closer look at the history and evolution of these few, alongside the programming languages that championed them and pioneered their use. This is what we will do in the following pages.

== 

As is usually the case with many things in history, it is unclear who started it all. It is said that the first programmer in history was the British mathematician Ada Lovelace (1815-1852), who showed how it was possible to write programs for the Analytical Engine, a mechanical general purpose computer envisioned by the mathematician Charles Babbage (1791-1871). This machine, however, was never built during the lifetime of the two.

It is said that Babbage, in turn, was inspired in his project by the unlikeliest of sources: a mechanical weaving device built by the French weaver and merchant Joseph Marie Jacquard (1752-1834). This mechanical device allowed even unskilled workers to produce intricate patterns on silk, patterns which could be represented on the so called puched (or "punch") cards, a technology which will be used up until more than a century later to input programs into the first eletronic computers.

// https://sciencehistory.org/stories/magazine/the-french-connection/
// https://www.computerhistory.org/storageengine/punched-cards-control-jacquard-loom/
// (K. R. Chowdhary, Professor)

// https://www.britannica.com/biography/Ada-Lovelace
// Ada: “weaves algebraic patterns, just as the Jacquard-loom weaves flowers and leaves.”

Despite all of this, we will have to wait for half a century until the birth of the man credited as the conventional inventor of the first programming language: German computer scientist Konrad Zuse (1910-1995). His programming language was Plankalkül ("Program Calculus" in German), designed to run on the Z1 computer, also envisioned and built by Zuse around the 1940s. Unfortunately, with World War II raging on, and Zuse trapped in Germany and isolated from the rest of the computer engineering community, his work remained for a long time largely unknown to the general audience.

With the birth of the digital computer in the mid 1940s, the first programming languages that were developed were machine languages. A machine language is a purely numerical representation of an instruction supported by the machine's architecture, that can thus be directly executed by the machine; these instructions are, usually, very simple compared to an instruction in a modern high level language. While it is theoretically possible to design a computer atchitecture that executes a high level language out of the box, in practice this is never done, not even today, for practical and performance related reasons.

There are two problems, from the human user's perspective, with machine languages: they are purely numerical, and require one to memorize the numerical opcode (operation code) corresponding to a kind of instruction; and they also require the human programmer to manually specify the addresses of the memory cells that contain the data or instructions to be used; this means that the programmer will also have to manually change all of the other addresses if he/she decides that an extra instruction has to be inserted in the middle of existing ones.

This is why assembly languages were invented, shortly after that. An assembly language is a, usually, thin abstraction over the underlying machine code, the latter still being the only language which the bare metal can run out of the box. But assembly languages are much easier to use than machine code, because they provide alphabetical aliases for the numerical opcodes, and because they manage memory addresses automatically, relieving the programmer from the burden of having to keep track of them manually.

Though it may sound strange to us nowadays, in the early days some of the assembly languages were interpreted rather than compiled. Compilation versus Interpretation are the two main approaches that can be used to implement any programming language, rather than being a real intrinsic feature of the language in question. A compiled language is first translated to machine code, and the machine code (rather than the compiled language's code) is then run on the target computer. On the other hand, an interpreted language requires at least another program to be actively running on the target computer, an interpreter; the latter dynamically translates code in the interpreted language into actions by performing them on the machine.

Needless to say, pure interpretation is slower than compilation due to the extra overhead of the interpreter, but back in the early 1950s this wasn't considered a problem, because the power-hungry floating point operations had to be interpreted anyway (they weren't part of any machnine's native architecture yet).

Back in the day, computers were mostly used to perform scientific computations, and floating point operations, which just means operations on decimal numbers up to a certain level of precision, where consequently one of the most important kinds of operations for most programs written at the time; and we still sometimes measure computing power in FLOPS (Floating Point Operations per Second) nowadays.

Things changed when the IBM 704 computer was introduced. The 704 was the first computer to incorporate native floating point operations 




----------
= Temporary Notes

evolution of programming languages, arisal and transfer of new features, death of obsolete ones


machine code bad:
  - numerical codes
  - absolute addressing: must modify when refactoring

interpreted vs compiled
early assembly languages (late 40s early 50s), some interpreted (shortcode...)

HW didn't have floating point intructions, those had to be simulated, so interpreting was a negligible overhead. IBM 704 had indexing and floating point.

the first widely accepted compiled high-level language was Fortran, developed at IBM, John Backus (the guy from Backus Naur Form)

The IBM Mathematical FORmula TRANslating System:
Fortran I 1956, it had var names, user defined subroutines, arithmetic if ( which passed control to one of three locations in the program depending on whether the result of the arithmetic statement was negative, zero, or positive) and do (while?)

no independent compilation per file (had to recompile everything from scratch) and 704 unreliability put a limit on size of program

designers were being HW specific, heavily geared towards performance, no dynamic vars

LISP born out of desire to process symbolic data in lists (most prior computations were numerical). Introduced recursion and contional expressions (logical if), dynamic alloc and garbage collection. Advice Taker This application became the impetus for the development of the list-processing language LISP

LISP's syntax is extremely simple.
LISP is a functional language, discuss FP, discuss declarative vs imperative.
issue of naturalness vs ease of efficient implementation.

original lisp had dynamic scope (roots of lisp, Paul Graham)

static (lexical) vs dynamic scoping. In static scoping (Java, C, C++) it depends on program text (nearest def wins), independent of runtime call stack. In dynamic scoping ... Mixed scoping in some languages like JS.

ML then (Miranda and Haskell purely functional)... Haskell also has lazy eval

ALGOL (late 50s, early 60s) effort to design machine independent scientific computation lang. generalized fortran

John Backus, a programming language designer at IBM, proposed a metalanguage of "metalinguistic formulas" to describe the syntax of the new programming language IAL, known today as ALGOL 58 (1959). His notation was first used in the ALGOL 60 report.

BNF is a notation for Chomsky's context-free grammars. Backus was familiar with Chomsky's work

ALGOL also introduced block structure, pass by value and "pass by name"
https://www2.cs.sfu.ca/~cameron/Teaching/383/PassByName.html

symbolic/textual substitution

Implications of the pass-by-name mechanism:
- The argument expression is re-evaluated each time the formal parameter is accessed.
- The procedure can change the values of variables used in the argument expression and hence change the expression's value. 

ALGOL allowed recursion (probably first imperative lang to do so)

ALGOL 60 lacked native input and output statements in the language, was another major
reason for its lack of acceptance (no hello world!)

COBOL
Grace Hopper: “mathematical programs should be written in mathematical
notation, data processing programs should be written in English statements”.
during the proposal process English, French and German keywords, UNIVAC, Remington-Rand (company) UNIVAC... but not "naturalistic", has been very widespread but not very "respected"

Many critical systems that still use COBOL exist nowadays
https://www.linkedin.com/pulse/importance-cobol-2023-bryan-varie/


BASIC

BASIC (Beginner's All-purpose Symbolic Instruction Code) was originally

1963 to
design a new language especially for liberal arts students.

The most important aspect of the original BASIC was that it was the first
widely used language that was used through terminals connected to a remote
computer. Terminals had just begun to be available at that time. Before then,
most programs were entered into computers through either punched cards or
paper tape.

The resurgence of BASIC in the 1990s was driven by the appearance of
Visual BASIC (VB). VB became widely used in large part because it provided
a simple way of building graphical user interfaces (GUIs), hence the name
Visual BASIC.

PL/I

Perhaps the best single-sentence description of PL/I is that it included what
were then considered the best parts of ALGOL 60 (recursion and block struc-
ture), Fortran IV (separate compilation with communication through global
data), and COBOL 60 (data structures, input/output, and report-generating
facilities), along with an extensive collection of new constructs, all somehow
cobbled together.

“I absolutely fail to see how we can keep our growing
programs firmly within our intellectual grip when by its sheer baroqueness
the programming language—our basic tool, mind you!—already escapes our
intellectual control.” Dijkstra

APL
A Programming Language
originally designed in the '60s by Kenneth E. Iverson at IBM, not to be implemented.

Huge number of operators, unreadable

SIMULA 67

- extension of ALGOL 60
- support for data abstractions
- first OOP lang
- using computers for simulation
- coroutines: subprograms that are allowed to restart at the position where they previously stopped
- class construct, OOP, data abstractions

https://www.quora.com/What-are-the-main-differences-between-Simula-and-Smalltalk

ALGOL 68

orthogonality

user defined data types

ALGOL 68 extended the elegant simplicity of
ALGOL 60, whereas PL/I simply threw together the features of several lan-
guages to attain its goals.

Pascal, C

LOGIC PROGRAMMING & PROLOG

- declarative paradigm
- programming based on predicate logic
- data specification AND inference method

https://www.sciencedirect.com/topics/computer-science/resolution-principle

During the early 1970s,
The first Prolog interpreter was developed at Marseille in 1972
University of Aix-Marseille
Department of Artificial Intelligence at the University of Edin-
burgh


intelligent database, facts and rules

two major reasons why logic programming has
not become more widely used. First, as with some other nonimperative
approaches, programs written in logic languages thus far have proven to
be highly inefficient relative to equivalent imperative programs. Second, it
has been determined that it is an effective approach for only a few relatively
small areas of application: certain kinds of database management systems and
some areas of AI.

Prolog++

https://wiki.c2.com/?DesignByCommittee: Ada, COBOL, Haskell


Smalltalk

Ph.D. dissertation work of Alan Kay in the late 1960s at the University of Utah (Kay,
1969).

http://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en

everything is an object, all the way down
sending a message to an object to invoke one of its methods. inspired by cells in living organisms, or network of intercommunicating virtual computers.

Alan Kay's OOP emphasized message passing, dynamic types, NOT inheritance.
If an object accepts the same kind of messages, it has the same interface.
code reuse must not be conflated with common interfaces

C++

discussion of general OOP approach

On the negative side, because C++ is a very large and complex language,
it clearly suffers drawbacks similar to those of PL/I. It inherited most of the
insecurities of C, which make it less safe than languages such as Ada and
Java.

Java

The Scripting Langs
(Ba)sh, awk, Perl, Javascript, PHP, Python, Ruby, Lua

originally interpreted

many of these langs were born with dynamic typing, but later evolved (one or multiple) static typing subset(s), 

Markup Languages

The "ideal" language?????

can it exist?
Are some PLs clearly better/worse than others? (yes according to people like P. Graham)

(the pragmatic programmer)
believing that something that changed didn't change (as a result of high coupling)
believing that something that hasn't changed did change (as a result of repetition)



// growing a lang, Guy Steele


----------------------


= Programming Languages

The naturalistic approach can be seen as a new programming paradigm, albeit one which the principles of which aren't still well defined much less well established; it may be of some help to briefly review the main (most popular) programming paradigms as of today, before trying to formulate any ideas specific to naturalistic programming.


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