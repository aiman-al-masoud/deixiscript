= Programming Languages

When we speak of programming languages in the contemporary sense, we generally refer to a particular kind of computer language (a formal language that can be processed by computers) that is suitable for what we call general purpose programming. This usually involves the property of turing completeness; that is, the ability to emulate certain aspects of a Turing Machine, the epitome of the theoretical general purpose computing device.

Just like there are thousands of natural languages, some of which are used and understood all over the world, and many more of which are only used by a relatively restricted number of speakers; so too there are myriads of programming languages: some of which have achieved world-fame and are widespread in the industry, and many more of which remain relatively esoteric.

The evolution of programming languages also mirrors that of natural languages, to some degree, and some are even critical of this state of affairs. // Programming Languages shouldn't be" too Natural" Mandrioli, Dino and Pradella, Matteo

From a population of original languages, new ones arise, features are transferred from one language or language family to another, and eventually some of them die out, when most of their original user base abandons them and moves on. // chodry

It is usually much easier for a programmer to master multiple programming languages during the course of his or her lifetime, than it is for him or her to master the same number of natural languages. This is at least in part due to the objective complexity of any natural language as compared to any programming language (we just don't notice it as human beings); but it is also in part due to the fact that programming languages (even, possibly, very different looking ones) generally fall into a restricted number of groupings, identified by their dominant programming paradigm.

As we will see, some of the most popular programming paradigms of all times are: procedural programming, object oriented programming, functional programming and logical programming. Some languages tend to stick to a specific paradigm more than other languages, emphasizing the paradigm's "purity" over the possibility of a hybrid approach; other languages are know as "multi-paradigm" because they support or even encourage the use of different paradigms for different kinds of tasks; some paradigms mix well together, and others do so to a lesser degree.

Programming paradigms themselves generally fall into two main categories: imperative and declarative.Broadly speaking: the imperative approach is about instructing the machine on how to do something on a step by step basis, while the declarative approach specifies the requirements and leaves the more open-ended specifics of how to accomplish them to the machine.

The programming paradigms mentioned two paragraphs ago by no means exhaust all of the existing paradigms, let alone all of the possibly existing but not yet discovered ones, but it is nonetheless useful and instructive to take a closer look at the history and evolution of these few, alongside the programming languages that championed them and pioneered their use. This is what we will do in the following pages.

== The Origins

As is usually the case with many things in history, it is unclear who started it all. It is said that the first programmer in history was the British mathematician Ada Lovelace (1815-1852), who showed how it was possible to write programs for the Analytical Engine, a mechanical general purpose computer envisioned by the mathematician Charles Babbage (1791-1871). This machine, however, was never built during the lifetime of the two.

It is said that Babbage, in turn, was inspired in his project by the unlikeliest of sources: a mechanical weaving device built by the French weaver and merchant Joseph Marie Jacquard (1752-1834). This mechanical device allowed even unskilled workers to produce intricate patterns on silk, patterns which could be represented on the so called puched (or "punch") cards, a data storage technology which will be used up until more than a century later to input programs into the first eletronic computers.

// https://sciencehistory.org/stories/magazine/the-french-connection/
// https://www.computerhistory.org/storageengine/punched-cards-control-jacquard-loom/
// (K. R. Chowdhary, Professor)

// https://www.britannica.com/biography/Ada-Lovelace
// Ada: “weaves algebraic patterns, just as the Jacquard-loom weaves flowers and leaves.”

Despite all of this, we will have to wait for half a century until the birth of the man credited as the conventional inventor of the first programming language: German computer scientist Konrad Zuse (1910-1995). His programming language was Plankalkül ("Program Calculus" in German), designed to run on the "Z4" computer, also envisioned by Zuse around the 1940s. Unfortunately, with World War II raging on, and Zuse trapped in Germany and isolated from the rest of the computer engineering community, his work remained for a long time largely unknown to the general audience.

== Machine Language

With the birth of the digital computer in the mid 1940s, the first programming languages that were developed were machine languages. A machine language is a purely numerical representation of an instruction supported by the machine's architecture, that can thus be directly executed by the machine; these instructions are, usually, very simple compared to an instruction in a modern high level language. While it is theoretically possible to design a computer atchitecture that executes a high level language out of the box, in practice this is never done, not even today, for practical and performance related reasons.

There are two problems, from the human user's perspective, with machine languages: they are purely numerical, requiring one to memorize the numerical opcode (operation code) corresponding to a kind of instruction; and, besides that, they also require the human programmer to manually specify the addresses of the memory cells that contain the data or instructions to be referenced; this means that the programmer will have to manually change all of the (many) relevant addresses if he/she decides that an extra instruction has to be inserted right in the middle of the existing ones.

== Assembly Language

This is why assembly languages were invented shortly after that. An assembly language is usually a thin abstraction over the underlying machine code, the latter still being the only language which the bare metal can run out of the box. But assembly languages are much easier to use than machine code, because they provide alphabetical aliases for the numerical opcodes, and because they manage memory addresses automatically, relieving the programmer from the burden of having to keep track of them in their head.

Though it may sound strange to us nowadays, in the early days some of the assembly languages were interpreted rather than compiled. Compilation versus Interpretation are the two main approaches that can be used to implement any programming language, rather than being a real intrinsic feature of the language in question. A compiled language is first translated to machine code, and the machine code (rather than the compiled language's code) is then run on the target computer. On the other hand, an interpreted language requires at least another program to be actively running on the target computer, an interpreter; the latter dynamically translates code in the interpreted language into actions by performing them on the machine.

Needless to say, pure interpretation is slower than compilation due to the extra overhead of the interpreter, but back in the early 1950s this wasn't considered a problem, because the power-hungry floating point operations had to be interpreted anyway (they weren't part of any machnine's native architecture yet).

Back in the day, computers were mostly used to perform scientific computations, and floating point operations, which just means operations on decimal numbers up to a certain level of precision, where consequently one of the most important kinds of operations for most programs written at the time; and we still sometimes measure computing power in FLOPS (Floating Point Operations per Second) nowadays.

== Fortran

Things changed when the IBM 704 computer was introduced; the 704 was the first computer to incorporate native floating point operations. When the 704 was introduced in the mid 1950s, people suddenly realized that interpretation was slow, and the software team at IBM released what came to hold the symbolic title of "first high level programming language": Fortran, "The IBM Mathematical FORmula TRANslating System". 

Fortran survives to this day in some scientific computation communities, with heavy modifications from the language that came out in 1956; the original version of Fortran developed by John Backus and his team at IBM supported basic arithmetics, limited length variable names, subroutines, the do-loop and a construct known as the arithmetic if, which branched to different parts of the program based on the value of an arithmetical expression.

Fortran lacked many of the language facilities we take for granted today. There was no incremental compilation: all of the parts of a program had to be recompiled from scratch all the time, and, given the occasional unreliability and slowness of the 704 /* was it compiled on the same machine it ran on?? */, this meant restricted program sizes. It also didn't have any dynamic memory allocation capabilities, which weren't essential for batch scientific computations anyway.

Overall, Fortran is an example among many of a language born with a specific purpose (doing math efficiently on the IBM 704) that later evolved, incorporating new constructs, and was ported over to numerous platforms. It is also a prime example of an imperative language.

== Lisp and Functional Programming

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

== COBOL

The COmmon Business-Oriented Language, COBOL, is not exactly known for its good reputation among programmers. The Jargon File, a partly-humorous partly-serious dictionary-like compendium of computer related slang, has an entry on the subject that describes COBOL as being: "A weak, verbose, and flabby language used by code grinders to do boring mindless things on dinosaur mainframes."

// http://www.catb.org/jargon/html/C/COBOL.html
// http://www.catb.org/jargon/quoting.html

The Jargon File also reports the following quote by Edsger Dijkstra: "The use of COBOL cripples the mind; its teaching should, therefore, be regarded as a criminal offense."

As the name implies, COBOL was originally intended for data manipulation in business applications; it was designed around the end of the 1950s by a committee sponsored by the US Department of Defense; and the American mathematician, computer scientist and military official Grace Hopper (1906-1992) had an important role in its design.

Interestingly, Grace Hopper is credited with the first attestation of the term "bug" to indicate the malfunctioning of a computer program, back when in 1947 she taped on a report in a log book the remains of a moth that got stuck in a relay inside of a computer that was malfunctioning.

What interests us specifically about COBOL, is that it was one of the earliest languages to be designed with the idea in mind of imitating natural language. This idea was championed by Grace Hopper, who believed that mathematical notation was better suited for scientific computation, but data manipulation was a better match for (naturalistic) English statements, with the characteristic all-caps English-like keywords of the era.

During the proposal process, COBOL was also presented with keywords translated in French and German; we had there the beginnings of the "internationalized" programming language, something that the ALGOL 68 standard went on to do seriously later in that decade; an idea that nonetheless didn't garner much success, as anyone can see today.

COBOL is "naturalistic" in some sense. In COBOL, you don't use the regular addition operator `+`, you rather ADD something TO something else. The naturalness of COBOL statements can push as far as statements like the following example taken from the paper about the PENS ranking for Controlled Natural Languages: // PENS RANKING

`PERFORM P WITH TEST BEFORE VARYING C FROM 1 BY 2 UNTIL C GREATER THAN 10`

Despite this, and as the same paper duly mentions, the statement structure usually doesn't follow English's grammar this closely; moreover, it is too rigid, and its rigidity coupled with its deceptive "naturalness" on the surface creates more confusion to the programmer than it does good.

In closing, we must remember that many mission critical systems to this day depend on large COBOL codebases; this is why, despite the kind of reputation it has earned during the last 60+ years of its existence, COBOL is still a topic of relevance today.

// https://www.linkedin.com/pulse/importance-cobol-2023-bryan-varie/


== PL/I

PL/I (Programming Language One) is perhaps the next most criticised programming language, after COBOL, that we will talk about. Developed in the 1960s at IBM, it was born as a "large" language. 
// guy steele

It included what were seen as the best features of ALGOL 60, Fortran IV and COBOL 60; together with a host of additional new features that were absent from the other three. While this should've made it a good language, unfortunately, as one can imagine, the problem with PL/I is that it was far too complex.

We will quote Dijkstra again, eloquently criticising the language in question:

"I absolutely fail to see how we can keep our growing programs firmly within our intellectual grip when by its sheer baroqueness the programming language—our basic tool, mind you!—already escapes our
intellectual control."

We think that the main lesson to take away from PL/I is that a language shouldn't incorporate too many features that can't be well integrated together, but rather be designed with a minimal set of orthogonal features that allow for future extension by users.


== SIMULA 67, Smalltalk and Object Orientation

Simula is generally recognized as the first Object Oriented Programming (OOP) language, though the term "object-oriented" was coined a little while later by computer scientist Alan Kay (1940-).

// http://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en

Developed during the 1960s at the Norwegian Computing Center in Oslo, Simula was designed to simulate real world events, as the name suggests. Syntactically, it was an extension of ALGOL 60. It was the first language to introduce objects, classes, inheritance and subclasses, virtual procedures and coroutines. A coroutine is a kind of subprogram that is allowed to stop and restart from where it left off, a feature that was found useful in simulating events.

Smalltalk originated in Alan Kay's late 1960s Ph.D. dissertation. Alan Kay, partly inspired by Simula, is credited for putting OOP on a firm theoretical basis. The idea of message passing is paramount to Kay's concept of object orientation: everything is an object, and all objects communicate with each other exlusively by passing messages; he was inspired in this ideal by his knowledge of how cells worked in living organisms; and had envisioned, much before the personal computer really took off, a huge network of computers communicating with each other over a global network. Analogously, the objects he described could be seen as a network of virtual computers.

Simula and Smalltalk were responsible for starting a revolution in the way software was written. This was also reflected in the shift towards Abstract Data Types (ADTs) which hide their implemenation behind the interface they present to the user. Nowadays OOP is still the dominant paradigm in software development, with most of the top programming languages by popularity featured on the annual Stack Overflow developer survey supporting OOP in some form. // https://survey.stackoverflow.co/2023/

At the core of modern OOP is the idea that data and behavior should be combined into a single entity: the object; which hides its data (or "state") and exposes an interface to other such entities, communicating with them through message passing, often understood as method calls. The "traditional" four pillars of OOP are: data abstraction, encapsulation, inheritance, and polymorphism.

Polymorphism and Inheritance aren't among the terms introduced or favored by Alan Kay. Polymorphism originally comes from the mathematical jargon about functions (indeed, a concept of Polymorphism is also present in Functional Programming) and it refers to an interface's ability to apply to different types; for example, the generic possibility of calculating the area of a shape applies equally well to a square, to a circle or to a trapezoid, but the concrete formulas to compute the areas of those three kinds of shapes are quite different.

Inheritance is mainly about code reuse: if a class needs the same methods (functions) and attributes (data fields) defined in another, then making the new class inherit from the old class can help reduce code duplication.

A "class" is a template used to create new objects (or "instances" of a class). OOP doesn't require classes or even inheritance to work; however, class-based programming is the dominant (but not the only) approach in modern OOP.

It seems that Alan Kay considers this, and other aspects of the modern popular approach to OOP, as a significant departure from what he originally envisioned in Smalltalk. For example, in the way many subsequent languages conflated polymorphism (common interfaces) with inheritance (code reuse) through the mechanism of classes; something which has lead to problems, compounded by the existence of codebases with deep and complicated inheritance hierarchies, and has generally turned inheritance into a discouraged construct to use, an idea which is usually manifested in the "composition over inheritance" motto.

Among the most popular object oriented languages is C++, developed in the 1980s by Danish computer scientist Bjarne Stroustrup (1950-) as an extension of the extremely popular C programming language that allowed the use of object oriented constructs. 

It may be said that many of the OOP languages released in the following years (Java, D, Rust...) have partly been attempts at curtailing C++'s complexity while retaining its power; C++ is a very powerful language that, unfortunately, is also a huge hodgepodge of features accumulated over the years, and retained due to backwards compatibility concerns, starting from basically all of the C programming language, which had to be supported from the start.

The early association with languages such as Simula and C++, which were basically procedural languages with object oriented features tacked on top, has lead to the modern impression that OOP is somewhat necessarily an imperative programming paradigm. This is not strictly true, OOP can work even without the need for mutable state and explicit flow control which characterizes imperative languages; in fact, Object Oriented and Functional programming can even coexist relatively well in a language, as is demonstrated by Scala.

A popular criticism of OOP revolves around its reliance on Software Design Patterns to solve a specific set of problems. The natural way to solve a problem in computer science, it is argued, should be to solve it once and for all, and then to abstract away the solution for later re-use. Software Design Patterns on the other hand require rethinking through and reimplementing solutions for a very similar problem everytime it comes up again. It can also be shown that some of the original 23 GoF patterns for OOP languages can be entirely avoided when using languages with a different set of abstractions, for instance: higher order functions and lambdas from Functional Programming. Indeed, many of these functional abstractions have made, and are making, their way into modern OOP languages and common practice. // graham, revenge of nerds

As has become customary for us, we will quote Dijsktra in closing, who once said about OOP that: "Object-oriented programming is an exceptionally bad idea which could only have originated in California."

Despite the fair criticism, some from illustrous critics, OOP is still the dominant approach in the software industry to this day. It has brought programming abstractions a little closer to the human mind, with its insistence on the familiar "object" metaphor, and for this we owe it something.


// https://www.quora.com/What-are-the-main-differences-between-Simula-and-Smalltalk
// http://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en
// https://dzone.com/articles/whats-wrong-with-object-oriented-programming
// https://www.cs.scranton.edu/~mccloske/dijkstra_quotes.html

== Prolog and Logic Programming

Logic Programming is a declarative paradigm based on the use of predicate logic to declare facts and inference rules; its development is closely tied to the development of Prolog during the 1970s by a collaboration between the University of Aix-Marseille and the Department of Artificial Intelligence at the University of Edinburgh. Prolog remains to this day the most widely known, studied and used example of Logic Programming Language.

The strength of logic programming lies in its being, as aforementioned, a highly declarative paradigm. Unlike other more imperative paradigms, where the programmer is required to tell the computer how to use the facts that it is given, in languages like Prolog what is required of the user are the simple declarative facts and inference rules; the way they are used to draw conclusions is entirely up to the system.

Logic Programming is based on a particular form of logic known as predicate logic or First Order Logic (FOL); FOL provides a formal way of expressing propositions and the relationships occurring between them. A proposition corresponds to the meaning of an English sentence, it is something that can have a truth value: true or false; ie: correspond to how the world really is, or contradict the actual state of affairs.

Just like algebra provides a basis for the algorithmic resolution of mathematical equations, FOL provides a basis for proving conclusions from a set of premises in an automated way, something that is otherwise known as "theorem proving".

FOL, or "predicate" logic, includes the predicate as one of its essential concepts. A predicate can be roughly thought of as a boolean function; for instance in the formula `cat(ginger)`, the predicate is `cat` and the individual `ginger`; the formula is stating a fact: the fact that `ginger` is a `cat`.

A predicate, or "relation", may have accept any number of terms; for instance `sleep(ginger, couch)` may mean that ginger is sleeping on the couch; it may also mean that the couch is sleeping on ginger, depending on what conventional order we choose for the terms in the tuple.

FOL also includes conjunctions (logical `and` and logical `or`), the negation operator, quantifiers (existential and universal) and implications.

The existential quantifier declares the existence of at least an individual with the specified properties; for instance `∃X.(cat(X) and red(X))` may mean that there is at least an X such that it is a red cat. 

The universal quantifier declares a global property of all individuals that satisfy a given description; for instance `∀X.(mortal(X) <- man(X))`, where `<-` is an implication arrow, may express the idea that every man is mortal, "X is man implies X is mortal".

For practical reasons, Prolog is based on a restricted dialect of predicate logic, specifically: it is based on a special kind of formula known as the Horn clause, developed by mathematician Alfred Horn (1918-2001); a Horn clause has a left and a right handisde that are separated by an implication. The implication goes from right to left. The left hand side may only contain one single predicate, or be completely empty. When the left handside is empty there is no implication, and the right handside is treated as a fact; for instance the formula `cat(ginger)` from before.

When the left handside contains a predicate, the Horn clause represents an implication; you could think of it as a "definition" of the left handside in terms of the right handside, for instance: `father(X,Y) :- parent(X,Y), male(X)` means that X is the father of Y, when X is the parent of Y and X is male; every variable in a Horn clause is implicitly universally quantified.

Statements in Prolog have two interpretations: they can either be declarations or queries; this typically means two modes: typically the facts and inference rules can be written to a file, which is loaded into an interpreter which then allows the user to make queries using the same syntax. For instance querying for `father(X, john)` will attempt to find John's father using the information declared in the file; `father(harry, john)` will check if Harry is John's father returning `yes` in case the proposition is true, and `no` otherwise. This process of substituting variables and trying to match formulas is known as unification, and its implementation can be rather complicated.

Prolog and similar systems always assume that the information they possess is complete; that anything that is true is also known to be true, and thus: that anything that is not known to be true is false. This is known as the Closed-World Assumption (CWA), and it is generally contrasted with the Open-World Assumption (OWA) used by some other systems. The CWA is closely related to the concept of Negation as Failure, which views negation as the failure to prove the truth of a statement.

// https://www.dataversity.net/introduction-to-open-world-assumption-vs-closed-world-assumption/

Logical Programming has seen periods of greater popularity, especially during the years of the Japanese Fifth Generation Computer Systems (FGCS) initiative, from the early 1980s to the early 1990s. /* history of AI */ It hasn't become more widespread in part because of performance related issues: unification is too slow; there are just no fast solutions to elementary problems such as sorting a list of numbers in pure logical programming, short of explicitly writing the code for a sorting algorithm, which necessarily means being "less declarative".

Logical Programming is nonetheless very interesting paradigm to study, and it certainly has its merits in the implementation of Expert Systems, and in certain kinds of Natural Language Processing and symbolic AI tasks.

== The Scripting Languages

The Scripting Languages aren't a cohesive block; their purpose typically ranges from: quick protytping, to end-user programming (which is related to the customization of a program by the user), to glue code (letting programs written in different languages communicate).

Some scripting languages, however, are also used for scientific computing and data analysis; and some are used on the backend of websites to provide dynamic behavior. Some are domain specific, and some are general purpose.

Eminent examples of scripting languages are: the many variants of the Unix shell, Awk, Perl, Javascript, PHP, Python, Ruby, Lua and many more. Despite this huge level of variation, the Scripting Languages have always shared some common traits that are characteristic of them.

The prototypical scripting language is used in an exploratory setting, as a "quick and dirty" tool to test out an idea or to produce glue code; and, as such, a shortened, concise and convenient syntax is deemed to be essential. Furthermore, a scripting language is usually interpreted, because it is embedded within an existing environment, implemented in some other programming language which does "the heavy lifting". It seems fair to think that, it was as a consequence of these two factors that most scripting languages were born as dynamically typed languages.

Dynamic typing is contrasted with a static typing; in statically typed languages most or all of the variable types are known and checked for correctness at compile-time, before the code ever runs. In purely dynamically typed languages, there are absolutely no compile-time type checks; the code either works at run-time or it fails at run-time.

While Test Driven Development (TDD), a very important concept in its own right, is sometimes proposed as an alternative to static type checking, the last decade has seen the birth and adoption of numerous supersets of the popular dynamically typed scripting languages. 

Such supersets enhace their base languages by providing what is known as "gradual typing", or "optional static typing"; examples of such supersets and/or static type-checkers include: MyPy for Python, Typescript (and others) for Javascript, Sorbet for Ruby, and Hack for PHP.

It is likely that the debate on the online developer community between proponents of dynamic versus static typing will go on indefinitely, as, despite the growing adoption of gradual typing, some high-profile proponents of dynamic typing still exist. // https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01

Another factor to take into account is that the traditional cumbersomeness of static typing (due to lengthy, explicit type declarations) can also be regarded as a thing of the past; today most modern languages and type-checkers have built in support for type inference: the type of a variable can be inferred from the value of its initial assignment, thus cutting down on what was perceived as boilerplate (redundant) code, while also preserving the benefits of static type checking.

But it isn't only about scripting languages becoming statically typed; some of the successful ideas from scripting languages are also making it to the other side. Scripting languages have traditionally had a tool known as a "Read Print Eval Loop" (REPL), also known as an "interactive shell"; this tool allows developers to test out statements and functions interactively on the fly, greatly increasing their productivity. There is a trend where classical compiled programming languages are also getting REPLs: Java has Jshell (and the older BeanShell), Haskell, Kotlin and Scala also all have REPLs.


----------
= Temporary Notes

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

APL
A Programming Language
originally designed in the '60s by Kenneth E. Iverson at IBM, not to be implemented.

Huge number of operators, unreadable


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


Markup Languages

The "ideal" language?????

can it exist?
Are some PLs clearly better/worse than others? (yes according to people like P. Graham)

(the pragmatic programmer)
- believing that something that changed didn't change (as a result of high coupling)
- believing that something that hasn't changed did change (as a result of repetition)

declarative "better"


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