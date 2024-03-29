= Programming Languages

When we speak of "programming" languages in the contemporary sense, we generally refer to a particular kind of computer language (a formal language that can be processed by computers) that is suitable for what we call general-purpose programming. This usually involves the property of Turing-completeness; that is, the ability to describe the workings of a Turing Machine, the epitome of the theoretical general-purpose computing device.

Just like there are thousands of natural languages, some of which are spoken and understood all over the world, and many more of which are only used by a relatively restricted number of speakers; so too there are myriads of programming languages: some of which have achieved world-fame, and many more of which remain relatively esoteric to the general public.

The evolution of programming languages also mirrors that of natural languages, at least to some degree. It all begins with a population of original languages, then new ones arise; features are transferred from one language, or language family, to another. Eventually, some of these languages "die out", because people no longer "speak" them @chowdhary2007evolution. Some researchers are even critical about this state of affairs @mandrioli2015programming, as they think the design of new languages should occur on a more principled approach: with more focus on the theoretical principles, with less "organic" growth, and perhaps even with the "forced retirement" of some programming languages and their replacement with newer and better alternatives @douglasCrockfordJS.

// less of these organically (and haphazardly) growing languages, and perhaps the "forced retirement" of some of the worst offenders @douglasCrockfordJS.

It is usually much easier for a programmer to master multiple programming languages during the course of his or her lifetime, than it is for him or her to master a similar number of natural languages. This is at least in part due to the objective complexity of any natural language as compared to any programming language (we just do not notice it as human beings); but it is also in part due to the fact that programming languages (possibly even very different-looking ones) generally fall into a restricted number of groups, identified by their dominant programming paradigm.

As we will see, the most popular programming paradigms of all times are four: procedural, object oriented, functional and logic programming. Some languages tend to stick to a specific paradigm more than other languages, emphasizing the paradigm's "purity" over the possibility of a hybrid approach; other languages are known as "multi-paradigm" because they support, or even encourage, the use of different paradigms for different kinds of tasks; some paradigms mix well together, while others do so to a lesser degree.

Programming paradigms themselves generally fall into two main categories: imperative and declarative. Broadly speaking, the imperative approach is about instructing the machine on how to do something on a step by step basis, while the declarative approach specifies the requirements and leaves the more open-ended specifics of how to accomplish them to the machine.

The four programming paradigms that we mentioned above are by no means the only existing paradigms, let alone all of the possible yet undiscovered ones. It is nonetheless useful and instructive to take a closer look at the history and evolution of these few, alongside the programming languages that championed them and pioneered their use. This is what we shall attempt to do in the following pages. 

The book "Concepts of programming languages", by Robert W. Sebesta @sebesta2012concepts, offers an invaluable historical perspective on the history and evolution of programming languages and language design criteria./* ; we will be often citing information from it. */
// we will often be citing it.
// we will often refer to it for historical facts.

== The Origins

As is usually the case with many things in history, it is unclear who "started it all". It is said that the first programmer in history was the British mathematician Ada Lovelace (1815-1852), who first described an algorithm to compute the Bernoulli numbers on the Analytical Engine, a mechanical general-purpose computer envisioned by the mathematician Charles Babbage (1791-1871). This machine, however, was never built during the lifetime of the two.

It is said that Babbage, in turn, was inspired in his project by the unlikeliest of sources: a mechanical weaving device built by the French weaver and merchant Joseph Marie Jacquard (1752-1834): the Jacquard-loom. Ada Lovelace once wrote, describing the Analytical Engine, that it could: “[weave] algebraic patterns, just as the Jacquard-loom weaves flowers and leaves” @adaLovelace.

The Jaquard-loom allowed even the least skilled of textile workers to produce intricate patterns on silk, patterns which could be _stored_ on the so called punched cards (or "punch" cards), a data storage technology that will be used up until more than a century later to input programs into the first electronic computers @frenchConnection, @punchedCardsLoom, @chowdhary2007evolution.

Despite these precursors in the mid 19th century, it is necessary to wait a little while more to see the birth of the man conventionally credited as the inventor of the first programming language: the German computer scientist Konrad Zuse (1910-1995).

His programming language was called Plankalkül ("Program Calculus" in German), and it was designed to run on the "Z4" computer, also envisioned by Zuse around the 1940s. As a language from that time period, it had some pretty high-level features such as arrays and other data-structures, it also had a peculiar _multi-line_ notation for array indexing @sebesta2012concepts.

Unfortunately, with World War II raging on, and Zuse trapped in Germany, isolated from the rest of the computer engineering community, his work remained for a long time largely unknown to the general audience @sebesta2012concepts.

== Machine Language

With the birth of the digital computer in the mid 1940s, the first programming languages that were developed were machine languages. A machine language is a purely numerical representation of an instruction supported by the machine's architecture. Code in machine language can thus be directly executed by the machine; these instructions are, usually, very simple compared to an instruction in a modern high-level language. While it is theoretically possible to design a computer architecture that executes a high-level language out of the box, this is never done in practice, not even nowadays, for practical and performance-related reasons @sebesta2012concepts.

There are two problems, from the human-user's perspective, with machine languages: they are purely numerical, requiring one to memorize the numerical opcode (operation code) corresponding to a kind of instruction; and, besides that, they also require the human programmer to manually specify the addresses of the memory cells that contain the data or instructions to be referenced; this means that the programmer will have to manually change all of the (many) relevant addresses if he/she decides that an extra instruction has to be inserted right in the middle of the existing ones @sebesta2012concepts.

== Assembly Language

The problems of machine languages are precisely the reason why assembly languages were invented shortly after that. An assembly language is usually a thin abstraction on top of the underlying machine code, the latter still being the only language which the processor can run out of the box. But assembly languages are much easier for a human to understand than machine code, because they provide alphabetical aliases for the numerical opcodes, and because they manage memory addresses automatically, thus relieving the programmer from the burden of having to keep track of them in his/her head @sebesta2012concepts.

== Compilation vs Interpretation

Though it may sound strange to us contemporaries, in the early days of programming some of the assembly languages were interpreted rather than compiled. Compilation versus Interpretation are the two main approaches that can be used to implement any programming language, rather than corresponding to any real intrinsic feature of the language in question. 

A compiled language is first translated to machine code, and the machine code (rather than the compiled language's code) is then run on the target computer. On the other hand, an interpreted language requires at least another program to be actively running on the target computer: an interpreter; the latter dynamically translates code in the interpreted language into actions by performing them on the machine.

Needless to say, pure interpretation is slower than compilation due to the extra overhead of the interpreter; but back in the early 1950s this wasn't considered a problem, because the power-hungry floating point operations had to be interpreted anyway (they weren't part of any machine's native architecture yet).

Back in the day, computers were mostly used to perform scientific computations, and floating point operations (which just means operations on decimal numbers up to a certain level of precision) were thus one of the most important kinds of operations for most programs written at the time; and nowadays we still sometimes measure computing power in FLOPS (Floating Point Operations per Second) @sebesta2012concepts.

== Fortran

Things changed when the IBM 704 computer was introduced; the 704 was the first computer to incorporate native floating point operations. When the 704 was introduced in the mid 1950s, people suddenly realized that interpretation was slow, and the software team at IBM released what came to hold the symbolic title of "first high-level programming language": Fortran, "The IBM Mathematical FORmula TRANslating System". 

Fortran survives today in some scientific computation communities, with heavy modifications from the language that originally came out in 1956; the original version of Fortran developed by John Backus (1924-2007) and his team at IBM supported basic arithmetic, limited length variable names, subroutines, the do-loop, and a construct known as the "arithmetic if", which branched to different parts of the program based on the value of an arithmetical expression.

Fortran lacked many of the language facilities we take for granted today. There was no incremental compilation: all of the parts of a program had to be recompiled from scratch all the time, and, given the occasional unreliability and slowness of the 704 computer /* was it compiled on the same machine it ran on?? */, this meant restricted program sizes. It also did not have any dynamic memory allocation capabilities (which were not essential for batch-processing scientific computations anyway).

Overall, Fortran is an example, among many, of a language born with a specific purpose (doing math efficiently on the IBM 704) that later evolved, incorporating new constructs, and getting ported over to numerous platforms. It is also a first example of an imperative, procedural language @sebesta2012concepts.

== Structured vs Unstructured Programming

A characteristic feature of machine code, assembly languages, and the early high-level languages is perhaps their classification as "unstructured" or "non-structured" programming languages. Unstructured programming simply means having one single huge code block, and using GOTO statements to manage control flow.

A GOTO (or GO TO), as the name implies, instructs the machine to pause the current linear execution flow, and jump to a wholly different location in the program instead. The destination of the jump is usually marked with a label (a name).

The extensive use of GOTOs was famously criticised by Dijkstra in his 1968 letter titled: "Go To Statement Considered Harmful" @dijkstra1968letters. He argued that humans are better suited at understanding static processes, while they have a poor grasp of those processes that evolve in time.

Given these human limitations, it is better for us to try to shorten the conceptual gap between the textual representation of a program and the spread in time of the process it describes. Of course, the GOTO statement complicates this much more than structured programming's solutions: loops and conditionals.

In a for-loop, for example, the iteration variable clearly acts like a "coordinate" in helping the programmer to orient him/herself through the iterative process; but with an unconstrained use of GOTOs it is hard to find a suitable set of such "coordinate" variables.

Moreover, Dijkstra cites the theoretical findings of Corrado Böhm (1923-2017) and Giuseppe Jacopini (1936-2001), namely: the Böhm-Jacopini theorem @bohm1966flow, which proves that the three basic constructs of structured programming: sequence, selection and iteration are enough to write any program that could be written in the "traditional way" using labels and GOTOs.

Nowadays, unstructured programming is (mostly) a defunct paradigm in all but the most low-level languages (assembly); some of its vestiges still survive in the "break" and "continue" instructions still in use in some high-level languages, to exit early out of a loop or skip an iteration, respectively.

== Lisp and Functional Programming

Lisp (List Processor) was born with very different goals in mind than languages preceding it. It was designed by the American computer scientist and Artificial Intelligence researcher John McCarthy (1927-2011) in 1958. Incidentally, McCarthy coined the term "Artificial Intelligence" (AI) back in those years. He wanted to design a language that made it easy to perform symbolic computations on lists. A list data-structure in computer science is a sequence of elements, which is not contiguous in memory; each element stores a value and a pointer to the location of the successor.

=== Advice Taker

McCarthy's aim at the time was to describe "Advice Taker", a hypothetical program he first introduced in his seminal paper from 1959: "Programs with Common Sense" @mccarthy1959programs. The program would be fed with data in the form of predicate calculus Well-Formed Formulas (WFFs) or "sentences", and it would be given a concrete goal to accomplish; it would have then had to reason from the premises it had available to arrive at a solution to the problem, drawing immediate conclusions from the premises and "taking action" in case the conclusions were found to be imperative sentences.

The example problem McCarthy provides us with, in his paper, is about deducing the appropriate steps to get him (McCarthy) to the airport to catch a flight, given such premises as the fact that he (McCarthy) is currently at home, that he has a car, that the airport is in a certain location, that the car can get him to distant places, etc. This might seem like a trivial problem (or perhaps a non-problem) to any "non-feeble-minded human", to use McCarthy's own words; but the difficulty associated to reliably automating this kind of "trivial", everyday reasoning is what came to be known as the problem of Common Sense in AI.

In the process of developing a language that made it easy to describe Advice Taker, McCarthy ended up with a very elegant set of language primitives. Lisp has pioneered a large number of innovations programmers still appreciate today; it came first at introducing: recursion, conditional expressions (logical if), and dynamic (during run-time) allocation and deallocation of memory (with garbage collection) @lisproots, @sebesta2012concepts.

=== Recursion

Recursion is a universal concept recognizable in many places, including: natural language, mathematics and computer science. In the latter two fields, the term "recursive function" basically refers to a function whose definition contains a reference to itself (to the very function being defined). Recursion breaks a problem down into manageable subproblems, and, like iteration, it provides a means to repeat the same computation over and over without duplication of code.

Unlike iteration, recursion does not require any reassignment of "counter" variables. Any iterative process (or "loop") must keep (at least) one counter which is incremented/decremented at every iterative step, similar to how a jury may count the loops the athletes run at a sports competition. 

But a recursive function circumvents that, because it can call a new instance of itself with a different argument, such as an incremented (or decremented) number. At some point, a recursive invocation with the suitable value will reach the "base case", or condition of termination, which will cause it (the latest invocation) to return a plain value. Following that, the function call stack will begin "unwinding", as older and older invocations begin returning values as well; until control is handed back to the original invocation, and it finally returns the global result.

#figure(
  grid(columns: 2, image("figures/recursion.dot.png", width: 90%), image("figures/iteration.dot.png", width: 80%)),
  caption: "Calculating the factorial of n, recursive (left) vs iterative (right) approach.",
) <recvsiter>

The factorial of a positive integer number is the product of that number and all of the integers that precede it and are greater than one. The flowcharts in @recvsiter illustrate the difference between computing this simple function recursively vs iteratively. Notice how iteration needs to keep two variables updated: the one that stores the value of n (which gets decremented at every iteration); and the variable that accumulates the result (the factorial of the original number n). In the recursive approach there is no need for mutable variables; the factorial function repeatedly calls itself for smaller and smaller integer values, until it reaches the base case (n < 1); at that point the latest call returns a value, and the call stack begins unwinding, until eventually the oldest call is reached, and that finally returns the full value of `factorial(n)`.

=== Pure Functional Programming

The introduction of recursion in programming languages meant that (mutable) variables were no longer an unavoidable logical necessity, and it ushered in a new paradigm known as Functional Programming (FP). Functional Programming is a declarative paradigm. It is declarative because it abstracts away control flow, and severely limits the scope of mutable state; two pervasive aspects of the program that have to be managed manually in imperative programming.

FP is centered around the concept of a "pure" or mathematical function @alexander2017functional. A "pure" function is a function that has no side-effects; this means that it does not mutate any state, and it does not depend on any mutable state; a pure function's output only depends on its input and its logic. A function that returns the current date and time is not pure, because its output depends on a mutable external factor (the state of the computer's clock). 

A function that adds an element to a list in-place (modifying the original list) is also not pure; but a function that creates a new list with the added element, not modifying the original list can be called a pure function.

In FP, every computation is performed by function application, operators can be seen as "infix" functions, and a variable assignment (which is immutable) can be seen as the definition of a function without arguments: a function without arguments always returns a constant value, since the output of a function can only change when the input changes, and the "input" of a constant never changes. 

Furthermore, since there are no side effects, all expressions are "referentially transparent": any sub-expression can be replaced with an equivalent one in value, without worries that the replacement will cause the program to break due to some unexpected dependence on "context" (opaque mutations of state). The order of execution becomes irrelevant, to a large extent. This also makes writing code akin to writing mathematical formulas.

All of this culminates in the pure functional programming languages such as Haskell, developed in the 1990s. Haskell specifically is also what's known as a "lazy evaluation" language: all expressions are lazily evaluated, without regards for the order in which they were declared in the source code. After all, if a variable is defined on line 100 and used only at line 500, who needs to evaluate it before the formulas on line 500 are? (Given that its evaluation, or lack thereof, can't ever affect anything else in the least). This has its big advantages: for the human and for the compiler; but it may also result in unpredictable memory management, which can be seen as a drawback in some applications @alexander2017functional.

=== Variable Scoping

The original Lisp had something known as "dynamic scoping", which is contrasted to static or "lexical" scoping @lisproots.

In a typical program, it is convenient that the same variable name be re-used in many different places, with (possibly) different values and different meanings. Moreover, variable scopes can be nested. It is therefore paramount to define a precise set of rules regarding the "scope" (region of visibility) of a variable. 

When resolving the variable "X", static scoping takes into account the (lexically, graphically) closest location where a variable with that name has been defined in the code, and it uses that value to resolve "X". Dynamic scoping, on the other hand, takes "X" to be whatever it is in the current execution environment at run-time.

Take the following example to illustrate the concept: suppose that you have a "variable declaration", a "function definition", some unspecified code in the middle (`...`), and then a function invocation:

`
X is the oven.
to bake a cake: put it inside of X.
...
bake the cake.
`

If the language above is statically scoped, then when calling the function "bake" from whichever distant position in the code, "X" will always be "the oven". But if the above language is dynamically scoped, then it depends. If the function "bake" is called from a different context (a different scope) where the name "X" means something else (suppose it is now: "the freezer"), then the cake will be baked by placing it in the freezer.

Dynamic versus static scoping thus behave differently in the presence of implicit arguments to a function, i.e., when a function reads a variable from the outer scope. The reader can see why dynamic scoping is thought to be a little less intuitive than static scoping; in spite of this, it is still deemed useful by some programmers in certain situations @emacspaper.

Modern _dialects_ of Lisp tend to support both strategies, as do some languages such as JavaScript. But static scoping is by far the most popular scoping strategy in modern languages.

=== The impact of Lisp

All in all, the effect of Lisp on the programming language landscape has been significant; although the dialects of Lisp are not (by today's standards) very popular languages, the principles from Functional Programming that Lisp helped to shape are still being studied and incorporated in formerly imperative languages.

The performance of purely functional languages has improved over the years, making them a viable alternative to their imperative counterparts in many cases. The debate over the purported "naturalness" of the imperative approach over the functional one, or vice versa, is still very much alive today.

== ALGOL <algol>

The first versions of ALGOL were developed during the late 1950s to early 1960s, in an effort to create a machine-independent standard for scientific computation, and to provide a universal alternative to Fortran, which initially ran only on IBM hardware @sebesta2012concepts.

ALGOL 60 is notable for being the first language to be described using what would come to be known as the Backus Naur Form (BNF), a metalanguage for the description of Context Free Grammars (CFGs), originally introduced by John Backus and later developed with Peter Naur (1928-2016).

BNF, and its variants such as Extended BNF (EBNF), still remains the most popular means of describing the syntax of programming languages. Born as a notation for the class of grammars known as "Context Free" introduced by linguist and philosopher Noam Chomsky (1928-), BNF describes a grammar as a set of production rules; each rule has a left and a right hand-side; on the left is the name of the grammatical element being defined, on the right is the sequence of sub-elements it comprises of. It is reported that a similar formalism had been used by Pāṇini, a Sanskrit grammarian who lived in ancient India between the 6th and the 4th century BCE, to describe the morphology of Sanskrit.

ALGOL 60 is also notable for having introduced the block structure for managing nested scopes, for being among the first imperative languages to support recursion, and for having had (alongside the more common "pass by value") an additional and peculiar "pass by name" mechanism for argument passing @passbyname.

=== Argument Passing <algolAndArgumentPassing>

Passing an argument to a function or procedure (or more generally, to a "routine") is an essential part of invoking it. As is often the case, there are different possible ways to do it. The most common are: "pass by reference" and "pass by value".

The first (pass by reference) essentially provides the invoked function with a reference (such as a pointer) to the original object, making it possible for the function to change the original object (side-effects). 

The second (pass by value) makes a copy of the argument, and provides the function with the copy (not the original). 

Obviously, these two mechanisms are de facto equivalent if all of the objects are immutable, such as in a pure functional language. What both of these two approaches (by reference and by value) always have in common, though, is that they require the argument expression to be fully evaluated before it is ever used inside of a function's body. 

On the contrary, pass by name does not. Pass by name is akin to a textual substitution, within the function's body, of every appearance of the parameter's name with the argument's text.

The implication of this, is: that formulas can be passed in as arguments. They are not evaluated before the function's body is executed, but rather during its execution. This makes it possible to exploit a technique known as Jensen's Device, from Danish computer scientist Jørn Jensen (1925-2007) @passbyname.

For instance, if the formula `w*x[i]` is passed in as a parameter to a function that performs a loop over `i` from `0` to `n` and sums up the values, the sum of the weighted values of an array can be computed for any arbitrary value of `w`, or, for that matter, any arbitrary expression that is passed into the same parameter. In modern languages, a lambda expression (anonymous function) may be used to a similar effect.

=== ALGOL 68 and Orthogonality

The year 1968 saw the release of ALGOL 68, which introduced some novelties such as user-defined data types. It is also known as a famous example of language were the concept of orthogonality is clearly visible, and perhaps carried a little too far @sebesta2012concepts.

Orthogonality in the design of programming languages refers to the possibility of combining the constructs of a language in a relatively unconstrained way. For example, a language which allows import statements to appear in any part of the code (such as Python) is more orthogonal in this respect than a language that only allows them to appear in one place, typically at the top of a source file. If done well, orthogonal design helps keep a language free of "exceptions to the rule", and as such more intuitive to use.

=== Impact of ALGOL

After decades of being a favored algorithmic "lingua-franca" in academia, ALGOL and the ALGOL language family are no longer popular nowadays. But they are still a worthwhile subject of study, for having pioneered some of the language design and description criteria that we take for granted today.

== COBOL

The COmmon Business-Oriented Language, COBOL, is not exactly known for its good reputation among programmers or academics. The Jargon File, a half-humorous/half-serious Internet compendium of computer related slang, has an entry on the subject that describes COBOL as: "A weak, verbose, and flabby language used by code grinders to do boring mindless things on dinosaur mainframes." @coboljargonfile.

The Jargon File also attributes the following quote to Edsger Dijkstra: "The use of COBOL cripples the mind; its teaching should, therefore, be regarded as a criminal offense."

As the name ("Business-Oriented") implies, COBOL was originally intended for data manipulation in business applications; it was designed around the end of the 1950s by a committee sponsored by the US Department of Defense (DoD); the American mathematician, computer scientist and military official Grace Hopper (1906-1992) had an important role in its design.

On an unrelated note, Grace Hopper is credited with the first attestation of the term "bug" to indicate the malfunctioning of a computer program; back when, in 1947, she taped on a report in a log book the remains of a moth that got stuck in a relay, inside of a computer that had been malfunctioning @computerBug.

=== COBOL was "naturalistic" 

What interests us specifically about COBOL is that it was one of the earliest languages to be designed with the idea of imitating natural language. This idea was championed by Grace Hopper, who believed that mathematical notation was better suited for scientific computation, but that data manipulation was a better match for English-like statements, with the characteristic all-caps English keywords of the era. There was also a concern that managers and business people would not have easily understood mathematical notation.

During the proposal process, COBOL was also presented with keywords translated in French and German @sebesta2012concepts: we had there the beginning of the "internationalized" programming language; something that the ALGOL 68 standard went on to do seriously later on in that decade (ALGOL 68 was also available in Russian keywords, among its other "translations"). Of course, this is an idea that did not catch on, as anyone can see today by looking at contemporary languages.

There is a sense in which COBOL is "naturalistic". In COBOL, you do not use the regular addition operator `+`, you rather ADD something TO something else. The naturalness of COBOL statements can push as far as statements like the following example taken from the paper about the PENS ranking for Controlled Natural Languages @kuhn2014survey:

`PERFORM P WITH TEST BEFORE VARYING C FROM 1 BY 2 UNTIL C GREATER THAN 10`

Despite this, and as the same paper duly mentions, the statement structure usually does not follow English's grammar this closely; moreover, it is too rigid, and its rigidity, coupled with its deceptive "naturalness" on the surface, creates more confusion to the programmer than positive effects.

=== COBOL today

In closing, we must remember that many mission critical systems to this day depend on large COBOL codebases; this is why, despite the kind of reputation it has earned during the last 60 and more years of its existence, COBOL is still a hot topic today @cobolImportance.

== PL/I

PL/I (Programming Language One) is perhaps the second most criticised programming language, after COBOL, that we will consider. Developed in the 1960s at IBM, it was born as a "large" language, that no single programmer at the time could wrap their head around @steele1998growing.

It included what were seen as the best features of ALGOL 60, Fortran IV and COBOL 60; together with a host of additional new features that were absent from the other three. While this should have made it a good language (in "theory"), unfortunately, as one can imagine, it ended up making PL/I far too complicated to understand.

Quoting the eloquent Dijkstra (who speaks of the language PL/I):

"I absolutely fail to see how we can keep our growing programs firmly within our intellectual grip when by its sheer baroqueness the programming language—our basic tool, mind you!—already escapes our
intellectual control." @theHumbleProgrammer

We think the main lesson to take away from PL/I is that a language should not incorporate too many features that cannot be well integrated together. It is best to design with a minimal set of orthogonal features, that allow for future extension by the users.

== SIMULA 67, Smalltalk and Object Orientation

=== Simula

Simula, developed during the 1960s at the Norwegian Computing Center in Oslo, is generally recognized as the first Object-Oriented Programming (OOP) language, though the term "Object-Oriented" itself was coined a little while later by computer scientist Alan Kay (1940-) @alankayoop.

Simula, as the name can suggest, was designed to simulate real world events. Syntactically, it was an extension of ALGOL 60. It was the first language to introduce objects, classes, inheritance and subclasses, virtual procedures and coroutines. A coroutine is a kind of subprogram that is allowed to stop and restart from where it left off, a feature that was found useful in simulating events @sebesta2012concepts.

=== Smalltalk

Smalltalk originated in Alan Kay's late 1960s Ph.D. dissertation. Alan Kay, partly inspired by Simula, is credited for putting OOP on a firm theoretical basis. The idea of message passing is paramount to Kay's concept of object orientation: everything is an object, and all objects communicate with each other exclusively by passing messages. 

Kay was inspired by his knowledge of how cells worked in living organisms; and had envisioned, much before the personal computer really took off, a huge global network of intercommunicating computers. Analogously, the objects he described could be seen as a network of virtual computers.

=== Object Oriented Programming

Simula and Smalltalk were responsible for starting a revolution. Nowadays OOP is still the dominant paradigm in software development, with a majority of the most popular programming languages, featured on the annual Stack Overflow developer survey, supporting OOP in some form @stackoverflow2023survey.

At the core of modern OOP lies the idea that data and behavior should be combined into a single entity: the object. The object hides its data (or "state") and exposes an interface to other objects, communicating with them through message passing, often understood as method calls. The "traditional" four pillars of OOP are: data abstraction, encapsulation, inheritance, and polymorphism.

Modern OOP is also related to the concept of the Abstract Data Type (ADT), which hides the specifics of its implementation behind an interface.

=== Polymorphism

Polymorphism and Inheritance are not among the terms introduced or favored by Alan Kay. Polymorphism originally comes from the mathematical jargon about functions @alankayoop (indeed, a similar concept of Polymorphism is also present in Functional Programming) and it refers to an interface's ability to apply to different types; for example, the generic possibility of calculating the area of a shape applies equally well to a square, to a circle or to a trapezoid, but the concrete formulas to compute the areas of those three kinds of shapes are quite different.

=== Inheritance

Inheritance is mainly about code reuse: if a class needs the same methods (functions) and attributes (data fields) defined in another, then making the new class inherit from the old class can help reduce code duplication.

A "class" is a template used to create new objects (or "instances" of a class). OOP does not require classes or even inheritance to work; however, class-based programming is the dominant (but not the only) approach in modern OOP.

It seems as though Alan Kay considers this, and other aspects of the modern popular approach to OOP, as a significant departure from what he originally envisioned in Smalltalk. For example, in the way many subsequent languages conflated polymorphism (common interfaces) with inheritance (code reuse) through the mechanism of classes @alankayoop. 

This is something that has led to problems, compounded by the possibility of creating deep and complicated inheritance hierarchies that are hard to maintain. This has generally turned inheritance into a discouraged construct, an idea which is usually manifested in the "composition over inheritance" motto @hunt2003inheritance.

=== C++ and its legacy

Among the most popular and oldest object-oriented languages is C++, developed in the 1980s by Danish computer scientist Bjarne Stroustrup (1950-), as an object oriented extension to the vastly popular C programming language @sebesta2012concepts.

It may be said that many of the OOP languages released in the following years (Java, D, Rust...) have partly been attempts at curtailing C++'s complexity while preserving some of its power; C++ is a very powerful language that, unfortunately, is also a huge hodgepodge of features accumulated over the years, and retained due to backwards compatibility concerns, starting from basically all of the C programming language, which had to be supported right from the start.

The early association with languages such as Simula and C++, which were basically procedural languages with object-oriented features tacked on top, has led to the modern impression that OOP is somewhat necessarily an imperative programming paradigm; this is not strictly true, as OOP can work even without the need for the mutable state and the explicit flow control which characterizes imperative languages; in fact, Object Oriented and Functional programming can even coexist relatively well in a language, as is demonstrated by languages like Scala @alexander2017functional.

=== Criticism of OOP

The problem of state management is a recurrent theme in software engineering; it may be said that while Functional Programming tries to minimize and isolate the state of a program, OOP's strategy, instead, is to simply hide it behind the curtain of an object's interface.

A popular criticism of OOP revolves around its reliance on Software Design Patterns to solve a vast set of problems. The natural way to solve a problem in computer science, it is argued, should be to solve it once and for all, and then to abstract away the solution for later re-use. Software Design Patterns, on the other hand, require rethinking through and reimplementing solutions for a very similar problem every time it comes up again @revengenerds. 

Moreover, it can be argued that some of the original 23 GoF patterns for OOP languages can be entirely avoided when using languages with a different set of abstractions, for instance: higher order functions and lambdas from Functional Programming @revengenerds. Indeed, many of these functional abstractions have made, and are making, their way into modern OOP languages and common practice.

We will again quote Dijsktra in closing, who once said about OOP that: "Object-oriented programming is an exceptionally bad idea which could only have originated in California." @dijkstraOOp

Despite the fair criticism, from illustrious critics, OOP remains the dominant approach in the software industry. It has brought programming abstractions a little bit closer to the human mind, with its insistence on the familiar "object" metaphor, and on the integration of data with behavior.

== Prolog and Logic Programming

Logic Programming is a declarative paradigm based on the use of predicate logic to declare facts and inference rules; its development is closely linked to the development of Prolog during the 1970s as a result of a collaboration between the University of Aix-Marseille and the Department of Artificial Intelligence at the University of Edinburgh. Prolog remains to this day the most widely known, studied and used example of Logic Programming Language @sebesta2012concepts.

The strength of logic programming lies in its being, as aforementioned, a highly declarative paradigm. Unlike imperative programming (where the programmer is required to explicitly manage control flow and deal with mutable state) or even functional programming (where the programmer still has to explicitly write out an algorithm) in pure logic programming what is required from the programmer are just the plain facts and the inference rules; the way those two are used to make computations and draw conclusions is entirely up to the system.

=== First Order Logic

Logic Programming is based on a particular form of logic known as "predicate logic" or "First Order Logic" (FOL); FOL is a formal way of expressing propositions and the relationships occurring between them. A proposition corresponds to the meaning of an English sentence, it is something that can have a truth value: true or false. In other terms, it can correspond to how the world really is (true), or contradict its actual state of affairs (false).

Just like algebra provides a basis for the algorithmic manipulation of mathematical equations, FOL provides a basis for proving conclusions from a set of premises in an automated way, a task that is also known as "theorem proving".

FOL, or "predicate" logic, includes the "predicate" as one of its essential concepts. A predicate is a property or a relation, and it can be (roughly) compared to a Boolean function; for instance, the formula `cat(luna)` may be translated in English as: "Luna is a cat"; "to be a cat" is a predicate (represented by the symbol `cat`), and `luna` is a constant term representing an individual cat.

A predicate, or "relation", may accept any number of terms; for instance, `sleep(luna, couch)` may mean that "Luna is sleeping on the couch"; it may also mean that "the couch is sleeping on Luna", depending on what conventional order we choose to adopt for the terms.

FOL also includes conjunctions (logical `and` and logical `or`), the negation operator, quantifiers (existential and universal) and implications.

The existential quantifier declares the existence of at least an individual with the specified properties; for instance, `∃X.(cat(X) and red(X))` may mean that "there is at least an X such that it is a red cat". 

The universal quantifier declares a global property of all individuals that satisfy a given description; for instance, `∀X.(mortal(X) <- man(X))`, where `<-` is an implication arrow, may express the idea that every man is mortal, i.e.: "X is a man, implies X is mortal".

=== Horn clauses

For practical reasons, Prolog is based on a restricted dialect of predicate logic, specifically it is based on a special kind of formula known as the "Horn clause", developed and studied by mathematician Alfred Horn (1918-2001).

A Horn clause has a left- and a right-hand sides that are separated by an implication. The implication goes from right to left. The left-hand side may only contain one single predicate or be completely empty. When the left-hand side is empty, there is no implication, and the right-hand side is treated as a fact; for instance, the formula `cat(luna)` from before, which states the simple fact that "Luna is a cat".

When the left-hand side is _not_ empty, then the Horn clause is actually what we would think of as an implication; you could also roughly think of it as a "definition" of the meaning of the left-hand side in terms of the meaning of the right-hand side; for instance: `father(X,Y) :- parent(X,Y), male(X)` means that: "X is the father of Y, when X is the parent of Y and X is male"; every variable in a Horn clause is implicitly universally quantified @sebesta2012concepts.

=== Rules and Queries

Statements in Prolog have two interpretations: they can either be declarations or queries; this usually means that there are two "modes": typically, the facts and inference rules can be written to a Prolog source file and stored in there, then the file can be loaded into an interactive interpreter which allows the user to make queries using the same syntax as declarations. 

For instance, querying for `father(X, luke)` will attempt to find Luke's father using the information contained in the source file; `father(walker, luke)` will check if Walker is Luke's father, returning `yes` in case this is supported by the information available, and `no` otherwise. This process of substituting variables and trying to match formulas is known as Unification, and its implementation can be rather complex @sebesta2012concepts.

=== Closed-World Assumption

Prolog and similar systems always assume that the information they possess is complete; that anything that is true is also known to be true, or equivalently that anything that is not known to be true has to be false. This is known as the Closed-World Assumption (CWA), and it is generally contrasted with the Open-World Assumption (OWA) used by some other systems. The CWA is related to the concept of "Negation as Failure", which views negation as the failure to prove the truth of a statement @sebesta2012concepts.

=== The impact of Prolog 

Logic Programming has seen periods of greater popularity, especially during the years of the Japanese Fifth Generation Computer Systems (FGCS) initiative, from the early 1980s to the early 1990s @smith2006history. This paradigm has not become more widespread, in part because of performance related issues; Unification is relatively slow: there are still no known fast solutions in pure Logic Programming to elementary problems such as sorting a list of numbers, short of explicitly writing the code for a sorting algorithm, which means abandoning pure Logic Programming @sebesta2012concepts.

Logic Programming is nonetheless a very interesting paradigm to study, and it certainly has its merits in the field of Expert Systems, and in certain kinds of Natural Language Processing and symbolic AI applications.

== Scripting Languages

Scripting Languages are not a cohesive block; their purpose ranges from quick prototyping to end-user programming (related to the customization of a program by the user) and to glue code (letting programs written in different languages interact with each other).

Some scripting languages are also used for scientific computing, data exploration and data analysis; and some are used on the backend of websites to provide dynamic behavior tailored to each individual user. Some are domain specific and have a restricted set of use cases; some are general purpose, and can be used to build pretty much anything, and fast.

Eminent examples of scripting languages are: the many variants of the Unix shell, Awk, Perl, JavaScript, PHP, Python, Ruby, Lua and many more. Despite this huge amount of diversity, Scripting Languages have always shared some common traits that are characteristic of them.

The prototypical scripting language is used in an exploratory setting, as a "quick and dirty" tool to test out an idea or to produce glue code; and, as such, a shortened and convenient syntax is deemed to be essential to a good scripting language. 

Furthermore, a scripting language is usually interpreted, because it is embedded within an existing environment, in turn implemented in some "real" programming language which does the "heavy lifting". 

It seems fair to think that it was partly as a consequence of these two factors that most scripting languages were born as "dynamically typed" languages.

=== Dynamic vs Static Typing

Dynamic typing is contrasted with Static typing; in statically typed languages most or all of the variable types are known in advance and checked for correctness at compile-time, before the code ever runs. In purely dynamically typed languages, there are absolutely no compile-time type checks; the code either works at run-time or fails at run-time.

While thorough testing, which is very important also in a statically typed setting, is sometimes presented as an alternative to static type checking altogether, the last decade has seen the emergence and wide adoption of numerous supersets of popular scripting languages that were born as dynamically typed.

=== Gradual Typing

Such supersets enhance their base languages by providing what is known as "gradual typing", or "optional static typing"; examples of such supersets and/or static type-checkers include: MyPy for Python, Typescript (and others) for JavaScript, Sorbet for Ruby, and Hack for PHP @whyStaticCameBack.

It is likely that the debate between proponents of dynamic versus static typing will go on indefinitely; despite the growing trend of gradual typing (a step in the direction of static typing), there are still some high-profile proponents of dynamic typing @turbo8DropTS.

=== Type Inference

Another factor to take into account is that the traditional cumbersomeness of static typing (due to lengthy, explicit type declarations) can be regarded as a thing of the past; today most modern languages and type-checkers have built-in support for type inference: the type of a variable can be deduced from the value of its initial assignment, thus cutting down on what was perceived as boilerplate (redundant) code, while also preserving the benefits of static type checking @whyStaticCameBack.

=== Feature exchanges

It it not only about scripting languages becoming "statically" typed; some of the successful ideas from scripting languages are also making it to the other side. Scripting languages have traditionally had a tool known as a "Read Eval Print Loop" (REPL), also known as an "interactive shell"; this tool allows developers to test out statements and functions interactively on the fly, greatly increasing their productivity. There is a trend where classical compiled programming languages are also getting REPLs: Java now has Jshell (as well as the older BeanShell @beanshell), Haskell, Scala and Kotlin also all come with REPLs.

== The Ideal Language

In our brief analysis of the evolution of programming languages, we left out a lot of important names, and we barely did justice to the ones we covered; it would be preposterous to try and answer the question of whether an ideal programming language exists, let alone try describing it.

We saw how these languages can vary wildly in purpose; and, as the engineering adage: "form follows function" goes, it is therefore quite improbable that a single _best_, perfect programming language fit for all problems may ever exist (though the _worst_ could, and probably already does @bslang).

Nonetheless, we investigated the most popular programming paradigms, their merits and their flaws, and we did come across some generally accepted principles of design (like orthogonality), and some broadly applicable ideas; we also did see that certain languages are criticized for their design decisions somewhat more than others. 

In other words, while it is certainly true that all programming languages serve the purpose they were designed for the best, not all programming languages were created equal, and good design is still an important factor to keep in mind; this, we think, is also the opinion of computer scientist Paul Graham (1964-) @revengenerds.

As Guy Steele (1954-), computer scientist and language designer, explains (and shows) in his talk "Growing a Language" @steele1998growing, planning for (organic, user directed) growth is the best strategy a modern language designer can take. Starting with a large set of primitives (like PL/I) is as bad as starting without the proper facilities to let the language users themselves define new constructs, that integrate well with the language's native ones.

