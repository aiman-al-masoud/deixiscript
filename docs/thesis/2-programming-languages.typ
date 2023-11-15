When we speak of programming languages in the contemporary sense, we generally refer to a particular kind of computer language (a formal language that can be processed by computers) that is suitable for what we call general purpose programming. This usually involves the property of turing completeness; that is, the ability to emulate certain aspects of a Turing Machine, the epitome of the theoretical general purpose computing device.

Just like there are thousands of natural languages, some of which are used and understood all over the world, and many more of which are only used by a relatively restricted number of speakers; so too there are myriads of programming languages: some of which have achieved world-fame and are widespread in the industry, and many more of which remain relatively esoteric.

It is usually much easier for a programmer to master multiple programming languages during the course of his or her lifetime, than it is for him or her to master the same number of natural languages. This is at least in part due to the objective complexity of any natural language as compared to any programming language (we just don't notice it as human beings); but it is also in part due to the fact that programming languages (even, possibly, very different looking ones) generally fall into a restricted number of groupings, identified by their dominant programming paradigm.

As we will see, some of the most popular programming paradigms of all times are: procedural programming, object oriented programming, functional programming and logical programming. Some languages tend to stick to a specific paradigm more than other languages, emphasizing the paradigm's "purity" over the possibility of a hybrid approach; other languages are know as "multi-paradigm" because they support or even encourage the use of different paradigms for different kinds of tasks; some paradigms mix well together, and others do so to a lesser degree.

Programming paradigms themselves generally fall into two main categories: imperative and declarative.Broadly speaking: the imperative approach is about instructing the machine on how to do something on a step by step basis, while the declarative approach specifies the requirements and leaves the more open-ended specifics of how to accomplish them to the machine.

The programming paradigms mentioned two paragraphs ago by no means exhaust all of the existing paradigms, let alone all of the possibly existing but not yet discovered ones, but it is nonetheless useful and instructive to take a closer look at the history and evolution of these few, alongside the programming languages that championed them and pioneered their use. This is what we will do in the following pages.

== The Origins

As is usually the case with many things in history, it is unclear who started it all. It is said that the first programmer in history was the British mathematician Ada Lovelace (1815-1852), who showed how it was possible to write programs for the Analytical Engine, a mechanical general purpose computer envisioned by the mathematician Charles Babbage (1791-1871). This machine, however, was never built during the lifetime of the two.

It is said that Babbage, in turn, was inspired in his project by the unlikeliest of sources: a mechanical weaving device built by the French weaver and merchant Joseph Marie Jacquard (1752-1834). This mechanical device allowed even unskilled workers to produce intricate patterns on silk, patterns which could be represented on the so called puched (or "punch") cards, a technology which will be used up until more than a century later to input programs into the first eletronic computers.

// https://sciencehistory.org/stories/magazine/the-french-connection/
// https://www.computerhistory.org/storageengine/punched-cards-control-jacquard-loom/
// (K. R. Chowdhary, Professor)

// https://www.britannica.com/biography/Ada-Lovelace
// Ada: “weaves algebraic patterns, just as the Jacquard-loom weaves flowers and leaves.”

Despite all of this, we will have to wait for half a century until the birth of the man credited as the conventional inventor of the first programming language: German computer scientist Konrad Zuse (1910-1995). His programming language was Plankalkül ("Program Calculus" in German), designed to run on the Z1 computer, also envisioned and built by Zuse around the 1940s. Unfortunately, with World War II raging on, and Zuse trapped in Germany and isolated from the rest of the computer engineering community, his work remained for a long time largely unknown to the general audience.

== Machine Language

With the birth of the digital computer in the mid 1940s, the first programming languages that were developed were machine languages. A machine language is a purely numerical representation of an instruction supported by the machine's architecture, that can thus be directly executed by the machine; these instructions are, usually, very simple compared to an instruction in a modern high level language. While it is theoretically possible to design a computer atchitecture that executes a high level language out of the box, in practice this is never done, not even today, for practical and performance related reasons.

There are two problems, from the human user's perspective, with machine languages: they are purely numerical, and require one to memorize the numerical opcode (operation code) corresponding to a kind of instruction; and they also require the human programmer to manually specify the addresses of the memory cells that contain the data or instructions to be used; this means that the programmer will also have to manually change all of the other addresses if he/she decides that an extra instruction has to be inserted in the middle of existing ones.

== Assembly Language

This is why assembly languages were invented, shortly after that. An assembly language is a, usually, thin abstraction over the underlying machine code, the latter still being the only language which the bare metal can run out of the box. But assembly languages are much easier to use than machine code, because they provide alphabetical aliases for the numerical opcodes, and because they manage memory addresses automatically, relieving the programmer from the burden of having to keep track of them manually.

Though it may sound strange to us nowadays, in the early days some of the assembly languages were interpreted rather than compiled. Compilation versus Interpretation are the two main approaches that can be used to implement any programming language, rather than being a real intrinsic feature of the language in question. A compiled language is first translated to machine code, and the machine code (rather than the compiled language's code) is then run on the target computer. On the other hand, an interpreted language requires at least another program to be actively running on the target computer, an interpreter; the latter dynamically translates code in the interpreted language into actions by performing them on the machine.

Needless to say, pure interpretation is slower than compilation due to the extra overhead of the interpreter, but back in the early 1950s this wasn't considered a problem, because the power-hungry floating point operations had to be interpreted anyway (they weren't part of any machnine's native architecture yet).

Back in the day, computers were mostly used to perform scientific computations, and floating point operations, which just means operations on decimal numbers up to a certain level of precision, where consequently one of the most important kinds of operations for most programs written at the time; and we still sometimes measure computing power in FLOPS (Floating Point Operations per Second) nowadays.

== Fortran

Things changed when the IBM 704 computer was introduced; the 704 was the first computer to incorporate native floating point operations. When the 704 was introduced in the mid 1950s, people suddenly realized that interpretation was slow, and the software team at IBM released what came to hold the symbolic title of "first high level programming language": Fortran, "The IBM Mathematical FORmula TRANslating System". 

Fortran survives to this day in some scientific computation communities, with heavy modifications from the language that came out in 1956; the original version of Fortran developed by John Backus and his team at IBM supported basic arithmetics, limited length variable names, subroutines, the do-loop and a construct known as the arithmetic if, which branched to different parts of the program based on the value of an arithmetical expression.

Fortran lacked many of the language facilities we take for granted today. There was no incremental compilation: all of the parts of a program had to be recompiled from scratch all the time, and, given the occasional unreliability and slowness of the 704 /* was it compiled on the same machine it ran on?? */, this meant restricted program sizes. It also didn't have any dynamic memory allocation capabilities, which weren't essential for batch scientific computations anyway.

Overall, Fortran is an example among many of a language born with a specific purpose (doing math efficiently on the IBM 704) that later evolved, incorporating new constructs, and was ported over to numerous platforms. It is also a prime example of an imperative language.

== Lisp

Lisp (List Processor) was born with very different goals in mind. It was designed by the American computer scientist and Artificial Intelligence researcher John McCarthy (1927-2011) in 1958. Incidentally, it is he who coined the term "Artificial Intelligence" (AI) back in those years. His goals back then were to design a language that made it easy to perform symbolic (therefore non-numeric) computations on lists. A list data structure in computer science is a sequence of elements which is not contiguous in memory; each element stores a value and a pointer to the location of the successor. 

McCarthy's real aim was to arrive at an implementation for "Advice Taker", a program he first described in his seminal paper from 1959: "Programs with Common Sense". The hypothetical program would be fed with data in the form of predicate calculus Well-formed formulas (WFFs) or "sentences", and it would be given a concrete goal to accomplish; it then would've had to reason from the premises it had available to arrive at a solution to the problem, drawing immediate conclusions from the premises and taking action in case the conclusions were found to be imperative sentences. 

The dummy problem McCarthy provides us with, in his paper, is about deducing the appropriate steps to get him (McCarthy) to the airport to catch a flight, given such premises as the fact that he (McCarthy) is currently at home, that he has a car, that the airport is in such and such a location, that the car can get him to distant places, etc... This might seem like a trivial problem (or perhaps non-problem) to any "non-feeble-minded human" to use McCarthy's own expression; but the difficulty associated to reliably automating this kind of "trivial" reasoning is what came to be known as: the problem of Common Sense in AI.

In the process of developing a language to implement such program, McCarthy ended up with a very elegant set of language primitives. Lisp has pioneered an incredible number of innovations programmers still appreciate today; it came first at introducing recursion, conditional expressions (logical if), and dynamic (during run-time) allocation and deallocation of memory (with garbage collection).

Recursion is a universal concept found in many places including natural language, mathematics and computer science. In the latter two fields, the term "recursive function" basically refers to a function whose definition contains a reference to itself (the same function being defined). Recursion breaks a problem down into manageable subproblems, and, like iteration, it provides a means to repeat the same computation over and over without duplication of code.

Unlike iteration, recursion doesn't require any reassignment of "counter" variables. Any iterative process (or "loop") must keep (at least) a counter which is incremented/decremented at every step, similar to how a jury may count the loops the athletes run at a sports competition. But a recursive function sidesteps all of that, because it can call a new instance of itself with a different argument, for instance: an incremented/decremented number, and conditionally stop when a condition known as the "base case" is met, finally returning a value.

The introduction of recursion in programming languages meant that (mutable) variables were no longer an unavoidable necessity, and it ushered in a new paradigm known as Functional Programming (FP). Functional Programming is a declarative paradigm centered around the concept of a "pure" or mathematical function, as the name says. Every computation is performed by function application, operators can be seen as functions, a variable assignment (which is immutable) can be seen as the definition of a function without arguments: a function without arguments always returns a constant value, since the output of a function can only change when the input changes, and the "input" of a constant never changes. Furthermore, since there are no side effects, all expressions are "referentially transparent": they always mean what they say, independent of the order or the context of execution, this makes writing code akin to writing mathematical formulas.

// Alvin Alexander, scala

This in turn leads to a host of considerations which culminate in pure functional programming, as exemplified in modern languages such as Haskell, developed in the 1990s. Haskell specifically is what's known as a "lazy" language: all expressions are lazily evaluated, without regards for their order in the source code. After all, if a variable is defined on line 100 and used only at line 500, who needs to evaluate it before line 500, given that its evaluation (or lack thereof) can't ever affect anything else in the least? This has its advantages, but also results in unpredictable memory management, which can be seen as a drawback in some applications.

Returning to Lisp, we need to discuss the issue of variable scoping. The original Lisp had something known as "dynamic scoping", contrasted to static or "lexical" scoping.

// roots of lisp, Paul Graham

In a typical program, it is convenient that the same variable name be used and re-used in many different places, with different values and different meanings. It is therefore paramount to define a precise set of rules regarding the "scope" (region of visibility) of a variable. Moreover, variable scopes can be nested. 

When resolving the variable "X", static scoping takes into account the (lexically, graphically) closest location where a variable with that name has been defined in the code, and it uses that value to resolve "X". Dynamic scoping, on the other hand, takes "X" to be whatever it is in the current execution environment at run-time.

Take the following example to illustrate the concept, suppose that you have a "variable declaration" and a "function definition" such as the following:

`
X is the oven.
to bake a cake: put it inside of X.
...
...
bake the cake.
`

If the language above is statically scoped, then when calling the function "bake" from whichever distant position in the code, "X" will always be "the oven", no matter what. But if the above language is dynamically scoped, well... it depends! If the function "bake" is called from a context where the name "X" has been redefined to mean something else, suppose it's now: "the freezer", then the cake will be baked by placing it in the freezer!

Dynamic versus static scoping thus behave differently in the presence of implicit arguments to a function; ie: when a function reads a variable from the outer scope. The reader can see why dynamic scoping is deemed to be a little less intuitive than static scoping; in spite of this, it is still deemed useful by some programmers in certain cases.

https://www.gnu.org/software/emacs/emacs-paper.html#SEC17

Modern dialects of Lisp (Lisp is not a single language) tend to support both strategies, as do some languages such as Javascript. But static scoping is by far the most popular scoping strategy in modern languages.

All in all, the effect of Lisp on the programming language landscape has been significant, although the dialects of Lisp are not, comparatively, very popular languages, the principles from Functional Programming Lisp helped to shape are still being studied and incorporated in formerly imperative languages; the performance of functional languages has improved through the years, and the debate over the purported "naturalness" of the imperative approach over the functional one, or viceversa, is still a very current one among programmers.

== ALGOL

The first versions of ALGOL were developed during the late 1950s to early 1960s, in an effort to create a machine independent standard for scientific computation, and to provide a universal alternative to Fortran, which initially ran only on IBM hardware.

ALGOL 60 is notable for being the first language to be described using what would come to be known as the Backus Naur Form (BNF), a metalanguage for the description of Context Free Grammars (CFGs), originally introduced by John Backus and later developed with Peter Naur (1928-2016).

BNF, or its variant: Extended BNF (EBNF), remains to this day the most popular means of describing the syntax of programming languages. Born as a notation for the class of grammars known as "Context Free" introduced by linguist and philosopher Noam Chomsky (1928-), BNF describes a grammar as a set of production rules; each rule has a left and a right hand side; on the left is the name of the grammatical element being defined, on the right is the sequence of sub-elements it comprises of. It is reported that a similar formalism had been used by Pāṇini, an ancient Sanskrit grammarian who lived in India between the 6th and the 4th century BCE, to describe the morphology of Sanskrit.

ALGOL 60 was also notable for having introduced the block structure for managing nested scopes, for being the among the first imperative languages to support recursion, and for having, besides the more common "pass by value", an additional peculiar "pass by name" mechanism for argument passing.

// https://www2.cs.sfu.ca/~cameron/Teaching/383/PassByName.html

Passing an argument to a function or procedure (or more generally, to a "routine") is an essential part of invoking it. As is often the case, there are different possible ways to do it. The most common are "pass by reference" and "pass by value"; the first essentially provides the invoked function with a reference (such as a pointer) to the original object, making it possible for the function to change the original object (side-effects). The second (pass by value) copies the value of the object and provides the function with a copy of it. Obviously, these two mechanisms are de facto equivalent if all of the objects are immutable, such as in a pure functional language.

What both of the aforementioned approaches (by reference and by value) always have in common, is that they require the argument expression to be fully evaluated before it is ever used inside of the function's body. On the contrary, pass by name doesn't. Pass by name is akin to a textual substitution, within the function's body, of every appearence of the parameter's name with the argument's text.

The implication of this is, that whole formulas can be passed in as arguments, because they are not evaluated before the function's body is executed, but rather during its execution. This makes it possible to exploit the technique known as Jensen's Device, from Danish computer scientis Jørn Jensen (1925-2007).

For instance, if the formula `w*x[i]` is passed in as a parameter to a function that performs a loop over `i` from `0` to `n` and sums the values, the sum of the weighted values of an array can be computed for any arbitrary value of `w`, or, for that matter, any arbitrary expression that is passed into the same parameter. In modern languages, a lambda expression such as `x->w*x[i]` could be used to a similar effect.

ALGOL 60 wasn't the last version of the language to come out. The year 1968 saw the release of ALGOL 68, which introduced some novelties such as user defined data types. It is also known as a famous example of language were the concept of orthogonality is all too visible, and perhaps carried a little too far.

Orthogonality in the design of programming languages refers to the possibility of combining the constructs of a language in a relatively unconstrained way. For example, a language which allows import statements to appear in any part of the code (such as Python) is more orthogonal in this respect than a language that only allows them to appear in one place, typically at the top of a source file. If done well, orthogonal design helps keep a language free of "exceptions to the rule", and as such more intuitive to use.

The languages in the AGOL family are no longer popular nowadays, but they are worthy of mention for having introduced some of the language design and description criteria that are still in use today.



----------
= Temporary Notes

evolution of programming languages, arisal and transfer of new features, death of obsolete ones


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