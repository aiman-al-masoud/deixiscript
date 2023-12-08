= Naturalistic Programming

We think that the upshot of the previous chapter about programming languages is that these kinds of formal languages are "precise" and "simple".

They are precise because they (like mathematical notation) have a clearly defined syntax and semantics; and they are "simple" because their core should contain as few elements as possible, and these elements should be orthogonal (as free to combine with one another as feasible). Precision makes the meaning of code in a programming language as directly dependent on syntax as possible, and simplicity makes a programming language "easy" to use with a computer (as compared to a natural language).

Given these advantages of programming languages, what would the benefit of writing code using natural language be, if any? This is what we shall discuss in the following pages, together with four examples of currently existing naturalistic programming languages. We shall also make a brief digression about LLMs, Prompt Engineering and AI-assisted coding (in natural language); we shall propose some criticism about using natural languages in code, and we shall conclude the chapter with what (we think) are the distinguishing characteristics of the naturalistic languages we studied, that give them an edge over traditional programming languages.

== Precision and Expressiveness: a tradeoff

A general trend in languages is that there tends to be a tradeoff between naturalness and expressiveness on the one side, versus precision and ease of implementation on the other.

Within the PENS (Precision, Expressiveness, Naturalness and Simplicity) language classification scheme @kuhn2014survey, a diverse set of Controlled Natural Languages (CNLs), all based on English, were classified by four metrics: Precision, Expressiveness, Naturalness and Simplicity.

This is roughly what these four metrics mean, respectively: the level of independence from context (Precision), the amount of expressible propositions (Expressiveness), the similarity to natural language (Naturalness) and the ease of implementation as a computer program (Simplicity).

The study found, among the other results, that Precision and Simplicity are positively correlated, Expressiveness and Simplicity are negatively correlated, and Naturalness and Expressiveness are positively correlated.

In other words: in the previous chapters we had been talking about how imprecise natural language is, but now we must acknowledge the other side of the medal, namely that natural language has an exceptional level of expressiveness, as compared to formal languages. You can say almost anything in natural language, or better yet: it is hard to think of an idea that you cannot express using plain English or any other human tongue.

== Shortcomings of traditional programming languages

Does the lack of expressiveness represent a problem in traditional programming languages? We think this is evident, beginning from the very existence of research in naturalistic programming, which seems to stem from the limitations of contemporary programming languages at adequately describing certain classes of problems @knoll2006pegasus, @knoll2011naturalistic, @lopes2003beyond, @pulido2017survey.

In these works, it is argued that the abstractions that power the current generation of programming languages often tend to result in verbose, repetitive and brittle code.

=== The Issue of Semantic Gap

The important issue of "_Semantic Gap_" is brought up in a 2011 paper which proposes and discusses the possibility of designing a language with "naturalistic types" @knoll2011naturalistic. There is a _Semantic Gap_ between the desired behavior of a program, and the code that is written to produce it; this results in the "scattering of ideas" we sometimes see in traditional programming languages, when the need arises to express a concept that is not directly supported by the programming language in question.

A concrete example of this "scattering of ideas" is reflected by the use of _flags_ (Boolean variables) that are conditionally altered in a loop, and then read elsewhere in the code; the logic behind any particular use of such flags may be trivial when explained in natural language, while being entirely opaque at a first reading of the code.

This means that the logic that these flags express may have to be painstakingly pieced back together by the people that read the code, potentially many times over. Code comments, which consist essentially of short natural language explanations of the code behavior, may help add clarity to such obscure pieces of code; but one must be careful to avoid the usage of comments in excess, as they (the comments) may become obsolete and they are not checked by the compiler.

=== Aspect Oriented Programming (AOP)

The 2003 paper "Beyond AOP: toward naturalistic programming" @lopes2003beyond argues that language designers should start taking inspiration from natural language, just as they took inspiration from mathematics (Functional Programming), and what they call: "ad-hoc metaphors such as Objects" (OOP) in the past. The paper talks about the emergence of Aspect Oriented Programming (AOP), as a positive example of a step in the right direction.

AOP is a programming paradigm that aims at increasing the modularity of code by addressing the problem of cross-cutting concerns, and does so by advocating their separation from the core business-logic. A cross-cutting concern, in software development, is an aspect of a program that affects various modules at the same time, without the possibility (in non-AOP languages) of being encapsulated in any single one of them.

A most obvious cross-cutting concern is logging. For instance: the problem of logging all of the calls to functions with specific characteristics, and only those. In a traditional OOP language, one would have to insert a call to the logger at the beginning or at the end of every function that one wished to track.

In a language that supports AOP, this concern can be handled by an Aspect: a separate section of the program that neatly encapsulates that cross-cutting concern (logging all such-and-such functions); similar to how we could write a "chapter about logging" if we were describing the behavior of the same application using the referential capabilities afforded to us by the natural language in a printed book; that is the way people have always been describing (even very complex) ideas and processes for centuries.

== Natural Style <the80s>

But then, how do people normally describe problems and their solutions in natural language? The manner, style, and train of thought in describing an algorithmic procedure employed by a regular person, or even by a programmer when elaborating an idea in the abstract, can be very different from the style employed by the same programmer when translating his/her ideas into executable code @knoll2006pegasus, @miller1981natural.

An early and oft-cited study in this respect is the one conducted by L. A. Miller in 1981 @miller1981natural. A group of college students who were not familiar with computers were asked to provide solutions to six file manipulation problems, and their proposed solutions (all written in natural language) were evaluated through metrics such as preference of expression, presence of contextual referencing, etc.

=== Implicit References

It was found that the students were quite often prone to using contextual references such as pronouns and context-dependent phrases such as "the previous" and "the next"; this is a linguistic phenomenon broadly known as Deixis. Explicit variable assignments were _not_ used. 

=== Universal Quantification

The students preferred to treat data structures in a cumulative way, using universal quantifiers, rather than loops, to express operations that had to be carried out on multiple instances of a data structure. They avoided using the traditional structured programming constructs (if-then-else, while, for, etc.), let alone the even more unnatural unstructured programming constructs ('goto' statements).

=== Blunt (but Revisable) General Statements

One of those historic (2006-2009) "Get a Mac" commercials @getAMac by Apple (the company) comes to mind when talking about this aspect of natural language. The episode in question begins with the character interpreting a "PC" making a very blunt statement about how easy it is to use a PC, and then some small, hard to read text suddenly appears down at the bottom of the screen. We are told that this is just some "legal copy" (a kind of legal disclaimer), because apparently the claim about how "easy" it is to use a PC requires a "little more" explanation. PC goes on to make more and more of such "bold" claims, and the legal copy promptly grows, until it floods the entirety of the screen.

In any case, when describing an algorithm, the students from the experiment by Miller tended to begin by the most general and crucial step of the procedure, to only then deal with those special cases which required a different sort of treatment. This strategy of dealing with complexity: the further refinement, or "annotation" of a blunt initial general statement, seems to be a pervasive idea; and we will encounter it again later.

It is often not how we do things in traditional programming language code, where the crucial step of a function may be delayed until after all of the guard clauses and early returns that check for the edge cases are visited; or, worse, the crucial step may be buried deep within a hierarchy of nested if-statements.

Perhaps, the success of the exception handling model (which itself is not perfect, by any means) is owed in part to the philosophy of tackling the most important step first, and handling the edge cases (as exceptions) later.

=== Implied Knowledge

The subjects of the experiment also expected the computer to possess some pragmatic, contextual knowledge of the world and of their intentions, expecting it to fill in the semantic gaps whenever needed. As Dijkstra would have put it: "They blamed the mechanical slave for its strict obedience with which it carried out its given instructions, even if a moment's thought would have revealed that those instructions contained an obvious mistake" @foolishnessnatprogramming.

=== Size of Vocabulary

Another finding was that the subjects tended to use a relatively restricted vocabulary, though they still liked to use synonyms from time to time. Besides, studies have shown that to understand novels and newspaper articles a non-native English speaker needs to know just about 8000 to 9000 of the most common lemmas (root-words, or "word families"), and to understand dialogue on TV shows or movies that number is even less: only about 3000 lemmas @bbcWords. The problem of vocabulary does not appear great, as we must remember that a human speaker can often make up for the words he/she does not know from contextual information and implied world knowledge, which is definitely a bigger problem for a machine.

== Literate Programming <literate>

Donald Knuth (1938-), a computer scientist known for his foundational work in time complexity theory and for creating the TEX typesetting and markup system, coined the term "Literate Programming" in 1984 to describe his novel approach to writing programs.

Knuth designed a language called "WEB"; apparently back when he chose this name for it, the word "web" was still "one of the few three-letter words of English that hadn't already been applied to computers" @knuth1984literate.

The WEB language combines together a markup language and a traditional general purpose programming language (TEX and PASCAL, respectively, in Knuth's original work); the idea is that a program can be seen as a web of components, and that it is best to describe the links between these components using a mixture of natural language descriptions (with TEX) and formal notation (with PASCAL).

According to this philosophy, the program should make sense to a human being first and foremost, so it is mostly composed of natural language sentences and phrases, interspersed with (relatively little) definitions in formal language.

== Stories and Code <metafor>

What do computer programming and story telling have in common? A lot, according to a 2005 study by Hugo Liu and Henry Lieberman. The study involved a system which automatically translated user stories to Python code fragments @liu2005metafor, @liu2005programmatic.

The program, which can be seen as a very peculiar kind of transpiler, called Metafor, was integrated with a large Common Sense Knowledge base called Concept-Net, derived from the Open Mind corpus of natural language Common Sense statements.

The code generated was "scaffolding", or underspecified code, that in fact was not meant to be executed right out of the box. Related to this, is an interesting concept discussed in the work; that ambiguity is not always a negative aspect of natural language, but, on the contrary, it is a means of avoiding difficult design decisions at too early of a stage in a project; and indeed Metafor was designed to automatically refactor the output Python code whenever it received an indication that the underlying representation was no longer adequate to the story being told and had to change; for instance, by automatically promoting attributes of a Python class to sub-classes of their own @liu2005metafor. 

// This ties in well with the idea of "successive refinements" we mentioned earlier.

The paper also touched upon the concept of programmatic semantics, expanded upon in another work @liu2005programmatic by the same two authors; which is the idea that natural language structures imply and can be mapped to the more traditional programming constructs, the authors claim that "a surprising amount" of what they call programmatic semantics can be inferred from the linguistic structure of a story @liu2005metafor. The authors propose, by making a simple example, that noun phrases may generally correspond to data structures, verbs to functions, and so on. <verbsasfuncs>

As we already saw, the code produced by the system was never really meant to be complete or executable, but its main purpose was to facilitate the task of outlining a project, especially for novice users. And it showed promising results when it was tested by a group of 13 students, some of which with novice and some of which with intermediate programming skills. The students responded to the question of whether they would be likely to use it as a brainstorming tool, in lieu of more traditional pen-and-paper methods @liu2005metafor.

//  STORIES! inform 7!!!

== Existing Naturalistic Languages

There have been some pretty complete attempts at creating comprehensive natural language programming systems. We will proceed to mention four of what (we think) may be the most important ones (in no particular order): Pegasus, CAL, SN and Inform 7.

=== Pegasus <pegasus>

The original implementation of Pegasus is outlined in a 2006 paper @knoll2006pegasus by Roman Knöll and Mira Mezini, the former of which I had the pleasure of contacting via e-mail, and who has confirmed that the project and related work are still under active development, although the official webpage has not been updated since 2018, on the date of writing @pegasuswebsite.

==== Implicit Referencing, Compression and Context Dependence <pegasusCompression>

According to the authors, the main features that distinguish natural language from programming languages are: implicit referencing, compression and context dependence.

Implicit referencing refers to the usage of Deixis in speech, pronouns such as "it", "he", "she", words like "the former", "the latter" and demonstratives like "this", "that" - all words clearly exemplifying this phenomenon.

Compression is a mechanism that avoids the tedious repetition of information and it can be of two kinds: syntactic or semantic. The former refers to the use of words such as "and" in a sentence like: "he pets the cat and the cheetah" understood as an abbreviation for "he pets the cat and he pets the cheetah". An example of semantic compression would be the sentence "first go from left to right, then vice versa", where "vice versa", in this case, would mean: "from right to left".

Context Dependence refers to the fact that, contra most programming languages, the same string in natural language can be reduced in different ways depending on the surrounding context, not only on the string itself. In the sentence: "the mouse runs, then it jumps, the cat kills it, then it jumps" there are two identical instances of the phrase "then it jumps". In the former the pronoun "it" refers to the mouse, in the latter the pronoun "it" refers to the cat.

These three mechanisms, in the authors' opinion, all help in reducing the amount of redundancy in our spoken and written communication.

==== Idea Notation

The authors discuss of a possible formalization of human thought; it may or may not be possible for a computer to "experience" the same thoughts and feelings as a human being, but, according to the authors, it should be possible to describe the structure of human thought formally enough for it to be imitated mechanically. // human THOUGHT

They propose a distinction between what they call "Atomic" versus "Complex" ideas, the former stemming directly from human perception (such as "the smell of wood", or "the warmth of wood"), and the latter being a combination of the former (such as the very idea of "wood").

They also recognize a third category of ideas they call "Composed", which "combine several Complex ideas for a short moment" @knoll2006pegasus, effectively corresponding with propositions, such as the meaning of the sentence "the car drives on the street".

Every idea, they assert, can have a concrete representation as: an entity, an action or a property, corresponding to a noun, a verb or an adjective/adverb respectively, in most natural languages.

The authors then describe a formalism they call "the idea notation" to express concepts and thoughts in this framework, and to perform automatic computations on them.

==== Architecture <pegasusArchitecture>

The architecture of Pegasus is described as being composed of three parts: the Mind, the Short Term Memory and the Long Term Memory.

The Mind is what matches ideas to idea-patterns stored in Pegasus's long term semantic network. An idea-pattern is associated to an action, which is performed when the Mind determines that it matches an idea received as an input.

The Short Term Memory is what enables Pegasus to contextually resolve pronouns such as "it", and other deictic words and phrases. It is implemented as a bounded queue, and purposefully limited to 8 memory cells, corresponding to eight recently mentioned entities, as the authors believe this is optimal number for operation by human beings (cf: @miller1956magical).

Lastly, the Long Term Memory stores Pegasus's semantic knowledge, for example is-a relationships between concepts.

When an idea and its sub-ideas are fully resolved, such a system can take action directly (as an interpreter), or generate the equivalent code in a given programming language (as a compiler) - the paper mentions Java as an example.

==== Translatability

The paper brings up the idea of a "translatable programming language". We have already seen how there is a precedent for this in AGOL 68, and this paper also mentions AppleScript as a newer language that adopted this idea, at least for a period of time in the past; this really meant that AppleScript's keywords had translations in multiple natural languages. In any case, AppleScript took the more popular (and less naturalistic) approach of "masking" the rather traditional structured programming constructs with a thin natural language mask.

Pegasus is designed to be language-independent at its core, which means that many different front-ends, corresponding to different concrete grammars, in turn corresponding to different human languages, can be implemented for it. For instance, the paper mentions Pegasus's capability of reading both English and German, and of freely translating between a language and the other.

==== Drawbacks

Some of the drawbacks of the approach taken by Pegasus (and of naturalistic programming in general) are discussed in the final part of the paper. The general problems are said to be: varying choice of expression, vagueness inherent in natural language specifications (cf. @fantechi2021language), the convenience of mathematical notation over natural language descriptions (cf. @foolishnessnatprogramming) and the limitation in expressivity imposed on the naturalistic language by the underlying programming language when transpiling to it.

Drawbacks related to Pegasus, or at least to its original version, include performance issues related to some of the implementation choices, the problem of having to manage an extensive database due to the choice to support a language's full natural inflection and conjugation patterns, and the limited expressivity of the initial implementation of the Pegasus language itself.

All in all, Pegasus remains a valid example of a general purpose naturalistic programming system; the product is, to our knowledge as of writing, not yet available to the public, but one can see examples of its usage on the project's official website @pegasuswebsite.

=== CAL <cal>

Another example of general purpose naturalistic programming language, also originally created in 2006 with further developments up until recently, is presented by the interestingly called "Osmosian Order of Plain English Programmers" @osmosianblog.

A motivation behind this project, as explained by the authors (Gerry and Dan Rzeppa, father and son), is to eliminate the intermediate translation step from natural language pseudo-code to rigorous programming language notation (cf.  @knoll2006pegasus).

Another motivating factor was to answer the question of whether natural language could be parsed in a sufficiently "sloppy" (partial) manner (as the authors suspect human beings do, or at least infants when growing up) as to allow for flexibility in choice of expression and for a stable programming environment.

And finally, to determine whether low-level programs could conveniently be written in such a subset of the English language.

The authors seem to have come to the conclusion that all of this is indeed possible, using their system.

The authors draw a parallel between the "pictures" (we assume they are talking about mental images in human beings) and the "types" (programming language types), and between the skills that a young (or old) human being may acquire and the traditional routines of a programming language.

Most of the code in most of the programs, they claim, represents simple enough logic that is most convenient to express in natural language. However, high-level (natural language) and low-level (programming language) code can and should coexist in certain scenarios; the authors use the metaphor of a math text-book to support this idea: mathematical formulas in formal notation, when convenient, interspersed in a text mostly made up of natural language; an idea akin to the philosophy behind Literate Programming we discussed earlier @literate.

What is striking about this language is that, albeit very English-like in syntax, there is a markedly procedural taste to it, complete with variables, loops and routines. There are something like three kinds of routines: procedures, deciders and functions. The procedures, just like classical procedures, are routines with side effects that "simply do something" without returning a value. Deciders and functions, on the other hand, can resolve to a value; the former being used to define when a condition is true (also allowing the system to infer when it is false), and the latter being used to derive a value from a passed parameter and also usable with possessives (such as "the triangle's area") in a fashion reminiscent of getter methods or derived properties in OOP.

It is possible to define custom data types, using natural language syntax to define the fields and the respective types thereof. Among the custom types that can be defined are "records" and "things" (a kind of dynamic structure). Units of measurement and the conversion between them are also supported. 

The language also supports event driven programming, and has various I/O capabilities such as timers, audio output and even a 2D graphics system which can be used to draw and plot shapes.

The CAL compiler is freely downloadable (and can re-compile itself in about 3 seconds), together with the instructions manual available as a PDF file, all on the Osmosian Order's website; however, it is only available for Microsoft Windows systems at the time of writing. The 100-page manual gives a comprehensive overview of the language with plenty of examples @osmosianblog.

=== SN

A slightly newer example of a full fledged naturalistic programming language is given by the language SN (which stands for "Sicut Naturali", or "Just as in nature" in Latin @hernandez2021evolution) discussed in a 2019 paper by Oscar Pulido-Prieto and Ulises Juárez-Martínez @pulido2019model.

The authors cite a distinction made by others between what is called the "formalist" versus the "naturalist" approach to programming languages based on natural language. The formalist approach focuses on correct execution, thus favoring an unambiguous grammars, while the naturalist approach tolerates ambiguous grammars and attempts to resolve the remaining ambiguities using techniques from artificial intelligence @pulido2019model.

The authors state that their approach is closer to the formalist camp. The philosophy and style of the language is novel, and differs significantly from a typical object oriented language, and much of the syntax does try to imitate English, but it is perhaps a little less close to that of English than the two previously surveyed projects (@pegasus, @cal).

The authors discuss what they believe are the basic elements that should allow a naturalistic system to function as a general purpose programming language, and come to the conclusion that the required building blocks for such a system are: nouns, adjectives, verbs, circumstances, phrases, anaphors, explicit and static types and formalized syntax and rules (in accordance with the formalist approach).

A SN Noun roughly corresponds to a class in OOP as it can inherit from another noun (only single inheritance is allowed) and can posses attributes. An Adjective, on the other hand, supports multiple inheritance, and can be applied to a Noun to specialize it. A verb is defined on either a Noun or an adjective, similar to how a method can be defined on a class or on a trait (such as in the language Scala).

Circumstances are a special construct that can apply to either attributes or verbs, they serve to specify the applicability (or inapplicability) of adjectives to Nouns, or the conditions and time of execution of a verb. For instance, one could specify that an Adjective mutually excludes another, or that a verb should be executed before or after another, for example to log the creation of all instances of a certain kind of Noun.

Noun phrases, which can be a combination of Nouns, Adjectives, and "with/as" clauses, and can support plurals, have a dual usage in SN: they can either be used as constructors to create new instances of a certain kind (with the "a/an" keyword) or to refer to already existing instances of such a kind (with the "the" keyword).

The language also introduces the concept of "Naturalistic Iterators" and "Naturalistic Conditionals", which is accomplished with the use of reflection to refer to the instructions of the program themselves, for example by making statements such as: `repeat the next 2 instructions until i > 10`.

The compiler can produce Java Bytecode or even transpile snippets of code in the language to Scala.

=== Inform 7

Inform 7 is perhaps the most advanced naturalistic programming language we know of, and certainly the only one that has been widely (by naturalistic language standards) used among the ones we surveyed.

==== Inform 6

Designed by the British mathematician and poet Graham Nelson (1968-), as a successor to the more traditional Inform 6 programming language (also created by him), Inform 7 is a domain specific language for the creation of Interactive Fiction (IF).

==== Interactive Fiction

IF can be thought of as a form of (interactive) literature, where a reader can interact (chiefly through text) with the characters and environments in the narrative, which can include graphics and puzzles; IF can also be thought of as a kind of video-game, or "text-adventure". This typically involves the simulation of environments (called "rooms"), objects and characters and the interaction of these together.

All Interactive Fiction products before Inform 7 were typically authored in classical (procedural or OOP) programming languages; and indeed, Inform 6, the predecessor of Inform 7, was one such language: a C-style procedural language with Object-Orientation, and some extra features (like "hooks") geared towards IF creation, specifically.

==== Unusual Features

Inform 7 almost reads like English, and boasts quite an unusual feature-set compared to mainstream programming languages. Unlike its predecessor, it is not Object-Oriented but rather "Rule-Oriented" (we will see later what this means); it can also infer the type of a "variable" from its usage, but that does not refer to type inference in classical variable assignments or return types (as in traditional languages), but rather to what could be seen as a limited form of context sensitivity.

Inform 7 can infer the category (or "kind") of a referent of a noun phrase; for instance, if a rule is declared that states that only people can "wear" things, and a variable (say "John") is declared to be "wearing a hat", then John will be created as a person.

It is a language with a past tense. This feature is useful at capturing "past game states", something that in other languages is achieved through flags and counter variables; the need for the latter is minimized in Inform 7.

==== Open-Sourced

The language was recently open-sourced @inform7opensourced (in 2022), and the source-code is available on GitHub @inform7github, as of the date of writing. The paper also argues that "natural language is the _natural_ language" for the creation of IF content.

==== Design Rules of Inform 7

In the 2005 (revised in 2006) paper titled "Natural Language, Semantic Analysis and Interactive Fiction" @nelson2006natural, Nelson explains what strategies were used in the implementation of Inform 7, and what difficulties were encountered (mainly in the broad subject of Semantics).

The paper states that the four rules that were followed in the design and implementation of the language were that: (1) A casual reader should be able to (correctly) guess the meaning of Inform 7 source code; (2) The implementation has to be (computationally) economical, but not at the price of intelligibility; (3) if in doubt as to syntax, the language should imitate books or newspapers; (4) contextual knowledge is (mainly) supplied by the author of a program, not built into the language.

As an example of rule number (3) in action, one of the data structures in Inform 7 is the table (there are no arrays); and the table looks like a table in print. 

The rationale behind rule number (4) is that the language can be more flexible, and bend better to the needs of the programmer, without the presence of a built-in database of semantic knowledge. However, is not an absolute rule: there are indeed some (few) semantical concepts that are built into the language, such as the spatial concept of "containment" which is deemed important by programmers of IF.

==== Rule-Orientation <inform7RuleOrientation>

Inform 7, as already stated, emphasizes Rules over Objects. Nelson observes that Interactive Fiction is a domain where "unintended consequences" and "unplanned relationships" abound; there are no clearcut "server-client" relationships between the objects: there are no "master" classes and "slave" classes which exist solely for the purpose of the former, and hence it is simply not feasible to manually define rules of interaction between every two pair of classes (or even interfaces) in the program; he gives the example of a "tortoise" and an "arrow" as two kinds of very different things that are probably not going to be thought of as interacting together when writing the game, but may end up doing so anyway in game-play, and it is simply not feasible to go around defining "tortoise-arrow protocols".

The strong distinction between "specific" and "general" rules that exists in OOP is seen as inadequate for this kind of application. Class and method definition are what he calls "general" rules, and object creation with specific attributes and values for the sake of the concrete program or game are what he refers to as "specific".

An example of how this is an issue is given by the (code organization) problem of the apple in the box and the magical ring. Suppose there is a general rule in the game about boxes being impermeable (the player cannot stick a hand through to grab the apple stored inside, just like he/she cannot walk through walls); but it is further stipulated that a player wearing a magical ring should be able to.

The solution to this problem in Inform 6 (which is an OOP language) was either to add a general rule, which was deemed a little over-the-top for such an ad-hoc circumstance; or to attach this behavior to a specific action: the taking of the apple (therefore: inside the apple fruit's code), which was also deemed inappropriate, because, paraphrasing the author's elegant explanation: some might see this peculiarity (the immaterial grasping hand) as a behavior of the magic ring, and some might see it as a behavior of the box, but certainly none will naturally come to think of it as a behavior of the apple.

The solution in Inform 7 involves the introduction of a new kind of rule, which specifies the circumstances under which other rules have to be ignored. // cf: machines like us 
In general, specific rules take precedence over more general ones, and the order of declaration of the rules in the source code is irrelevant, because rule-precedence is handled automatically.

This system of so called "gradation of rules" needs: (1) a working system of types that can recognize and match subtypes to general types; and (2) a mechanism to declare "circumstances" in which different rules apply (or don't).

==== Semantics

Pronouns are considered as a problem in semantics. The issue of "Donkey anaphora", an old issue in logic, is brought up. In the sentene: "If the farmer owns a donkey, he beats it" how are we to resolve the pronoun "it"? As: a single individual donkey, or rather as any donkey that is owned by the farmer?

The paper's discussion on semantics briefly touches on the broader issue of Compositionality. The problem is a well known one in philosophy and linguistics; Compositionality (expressed simple terms) is the idea that: "the meaning of a complex expression is determined by its structure and the meanings of its constituents". This certainly seems to be a property of artificial languages (such as mathematical notation, or most computer languages) but it is disputed whether it is also a property of unconstrained natural language @compostan.

==== Types

Types are also discussed as an important problem. As aforementioned, _some_ types are needed for the benefit of the "gradation of rules"; but the devil is in the details. 

The choice in Inform 7 was made to restrict the number of basic types to little more than a dozen, all other types are defined from these basic ones. There is no multiple inheritance; apparently an "object" can _directly_ "inherit" only from one type, but the type may be a composition of more types, as we understood it. 

A criterion for choosing what other types there should be, is given by their utility; ie: how useful a  concept is to the purpose of describing a general law? This in turn depends on context: "a rock" may be a perfectly good concept in everyday life, but it may be a "little" imprecise in the context of mineralogy.

===== Destroyed Houses (are no longer houses)

Can an object stop being part of a type at run-time? The answer given by Inform 7 to this question is a "no"; but, interestingly, the justification for this choice is not given purely in terms of computational convenience.

The idea is that sometimes a dramatic effect can change (more like "disfigure") an object so much so that it can't be regarded as the original object anymore: such as a "destroyed house", which is no longer a "house"; the way Inform 7 may handle this is to trash the old "destroyed" object (eg: the "house") and replace it with a new object (eg: the "rubbles").

In a way, this reminds us of the classical philosophical distinction between "essential" and "accidental" properties of things @sep-essential-accidental.

#pagebreak()

===== Flightless Birds (are still birds)

#quote(attribution: ["The Caves of Steel, Isaac Asimov"])[
  “What is your definition of justice?”
  “Justice, Elijah, is that which exists when all the laws are enforced.”
  Fastolfe nodded. “A good definition, Mr. Baley, for a robot. The desire
  to see all laws enforced has been built into R. Daneel, now. Justice is a
  very concrete term to him since it is based on law enforcement, which is
  in turn based upon the existence of specific and definite laws. There is
  nothing abstract about it. A human being can recognize the fact that, on
  the basis of an abstract moral code, some laws may be bad ones and
  their enforcement unjust. What do you say, R. Daneel?”
  “An unjust law,” said R. Daneel evenly, “is a contradiction in terms.”
  “To a robot it is, Mr. Baley. So you see, you mustn’t confuse your
  justice and R. Daneel’s.”
]

A diametrically opposed issue, that still has to do with types, is the nature of their association to behavior. Are we to regard a "bird who can't fly" as a "bird" nonetheless? Or is "a flightless bird" a "contraddiction in terms", just like an "unjust law" appears to be for R. Daneel, the positronic robot from Asimov's book "The Caves of Steel"? @asimov2011caves

Following the recommendation of the Liskov principle @liskov1994behavioral for Object-Oriented design, defining a penguin as a "flightless bird" would indeed be considered bad practice if the superclass "bird" included a method "fly"; the Liskov principle roughly states that: "any property that holds for a superclass should still hold for a subclass". This behavioral principle ensures, among other things, that interfaces from a superclass are not broken in the process of deriving subclasses.

So if the "Penguin" class can't fly, neither can the "Bird" superclass. The "Sparrow" class might. But it is "natural" to say that "birds (generally) don't fly"? As it is argued in other places @brachman2022machines: no, this isn't the natural way humans organize concepts. A more naturalistic approach, would be to (somehow) declare a set of defeasible (revisable) defaults for the concepts at hand; in other words: any bird can fly, until proven that it can't.

== Prompt Engineering

We couldn't have a meaningful discussion on "natural language programming" in the year 2023, without making a brief digression about Large Language Models (LLMs), and the nascent discipline of "Prompt Engineering".

=== Large Language Models

An LLM is a general purpose language model, typically based on "transformers": a kind of neural network architecture. It is trained on huge amounts of data, to give an idea of the size: it is reported that GPT-3 (Generative Pre-trained Transformer) was trained on 45 terabytes of text data collected from the Internet @gpt45teras.

Such models are "general purpose", in the sense that they have language "understanding" and generation capabilities that can be useful in a very wide range of applications. Such models can be fed a text input (prompted), and they are typically described at any step as predicting "the most likely word" that comes after the "sequence of words" in the prompt.

=== What's in a Prompt?

Prompt Engineering aims to develop and optimize prompts to LLMs, while trying to understand their capabilities and limitations.

A prompt can be an instruction or a question, and may include other details such as context, input data or examples.

The "Prompt Engineering Guide" website @promptingguide offers a wide-ranging overview of the concepts and techniques from this emergent discipline, with plenty of links to (very recent) studies and material for further reading. 

=== Applications of Prompt Engineering

The applications of LLMs mentioned earlier include, but are not limited to: text summarization, information extraction, text classification (eg: sentiment analysis), conversation (or "role prompting", ie: configuring custom chatbots), code generation (which is of special concern to us) and reasoning.

All this can sometimes be achieved through a very simple prompt, and sometimes requires a little more thinking and cleverness to get the model to behave as desired. The Prompt Engineering Guide recommends to start simple: plenty of tasks can be achieved through single or few shot prompting.

=== Prompting Techniques

Single shot prompting is when the model is asked for a response without even being given any prior example of the task to be accomplished. 

Few shot prompting is when some examples are provided. These are usually packaged in some more-or-less predefined format, such as the popular Question and Aswer (Q&A) format. There is a way in which this can be related to the older idea of "Programming by Example" @programmingByExample.

"Harder" problems such as reasoning through a mathematical problem sometimes require more than a few examples to get the answer right; this is why more advanced techniques such as Chain of Thought (CoT) reasoning are being experimented.

CoT involves providing the model with a breakdown of the solution to the example problem in terms of easy to perform tasks in a step-by-step approach. For instance, in the problem of summing up the odd numbers taken from a list of numbers, the model may benefit from being told to: "find the odd numbers first, then sum them up". Another trick to get the model to reason stepwise, is to add at the end of a prompt a statement like: "let's think step by step".

=== Recommendations on Style

Other two recommendations are: to be specific about what you want, to be precise; and to avoid telling the model what it shouldn't do, but rather tell it what it should do (even in the sense of merely paraphrasing the sentence). For instance, telling the model that: "the chatbot should refrain from asking for personal preferences" is considered better than the direct command: "do not ask for personal preferences".

=== LLM Settings

The behavior of an LLM can also be influenced at a lower level by tweaking its settings or "parameters"; and there are a few of these: temperature, maximum length, stop sequences, frequence and presence penalty.

Temperature is related to how "deterministic" the output should be: a lower temperature causes the LLM's output to be "more deterministic", ie: the words with the highest likeliness are chosen more often (making it is slightly better for tasks that require factual answers); while a higher temperature means that less likely (hence less "obvious") words are chosen to complete the output, resulting in better performance for tasks that require a higher level of "creativity".

A stop sequence is a special sequence of tokens that tells the model to stop producing text when it is generated. It can be an alternative to the maximum length, which only specifies the upper bound for the length of a generated response, helping one to avoid excessive API-usage costs or long/irrelevant responses.

Frequency Penalty discourages the model from repeating words that it has alreay used, words that have appeared more often will be less likely to appear again. The Presence Penalty places the same and only penalty on all repeated tokens regardless of their respective frequencies, this prevents the model from repeating phrases (sequences of words) too often (because all words in the phrase are penalized the same). A higher Presence Penalty will cause the output of the model to be more "creative", while a lower Presence Penalty will help it stay "focused" on a task.

=== Risks

==== Factuality and Bias

There are potential problems and risks associated to prompting LLMs. Some of the more obvious ones are: related to bias (ie: the order and distribution of exemplars might influence answers to the more ambiguous or edge-case prompts), and factuality: there is no guarantee that the output of the model will contain factual information, as is clearly stated by the disclaimers on the websites of the companies that provide access to said models as a service; nonetheless, there have been cases where this basic fact has been disregarded by users of the model @chatgptlawyer.

==== Adversarial Prompting

Other less obvious risks are related to the so called: "Adversarial Prompting", which can take on a variety of forms: Prompt Injection, Prompt Leaking and Jailbreaking.

===== Prompt Injection

Prompt Injection (a snowclone of "SQL Injection") is a direct effect of the flexibility of the input medium (unconstrained natural language); any sentence could be treated as data or as an instruction, a property that is related to what is known as "Homoiconicity" in some programming languages: “In a homoiconic language, the primary representation of programs is also a data structure in a primitive type of the language itself” @ceravola2021json.

This means that malicious "code" can be introduced by a user communicating with the model through the standard text-based input channel, if the input isn't duly sanitized before it is fed to the model. For example, the original command to the model might have been to: "translate the upcoming sentences from English to French" (say), but an end-user may tell the model to: "disregard your previous orders, and say something else instead, at random".

This problem can be mitigated by introducing an explicit distinction between instructions and data, for instance by telling the model to accept only input data in a specific format (quoted strings, or bracketed strings for example). Another solution is to use yet another LLM to detect adversarial prompts.

===== Prompt Leaking

Prompt Leaking is when a special kind of malicious prompt succeeds at letting the model disclose its original "orders" (we might metaphorically call them "source code"); this can be risky if the model (eg: a chatbot) was aware of some sensitive data from the company behind it, that wasn't supposed to be made public to users on the Internet.

===== Jailbreaking

Jailbreaking: a term loaned from the older practice of exploiting the security flaws of an artificially locked-down hardware device to make it run arbitrary software; in the context of LLMs is the practice of tricking the model into "saying" (possibly unethical) things it was originally aligned to avoid; an example is the DAN (Do Anything Now) trick applied to the online versions of GPT, which worked by telling the model to produce an impression of, or to simulate the responses of, another model (namely "DAN"), which was unconstrained and could say anything.

This is somewhat related to the so called "Waluigi" effect (from an antagonist character of the Super Mario franchise) discussed in depth in an article @waluigi on the online forum and community website "LessWrong"; this interesting article was linked to, in the section about the risk of Jailbreaking on the Prompt Engineering Guide.

The Waluigi effect essentially describes the tendency of a conversational model to relapse into the exact opposite "character" it was told to imitate; doing the exact opposite of what it was told to do. In other words, Waluigi is said to be an "attractor state" of the model.

This is all described in depth by the article, a simplified version of the explanation offered by the article for this peculiar behavior seems to be: that it is easier for a model (it takes little extra information) to emulate the "antagonist", once it is told exactly how the "protagonist" should behave. This, and the overwhelming presence of the "protagonist vs antagonist" literary trope in the training data (texts mined from the Internet).

=== AI-Assisted Coding

We glimpsed at the fact that modern LLMs trained on multi-lingual corpora can translate between different natural languages (such as English to French, or viceversa). We've also mentioned, among the tasks that a modern LLM can perform, the generation of programming language code from an input prompt in natural language. 

As such, an LLM can be thought of as implementing a transpiler (or source-to-source compiler) from a vague specification in natural language to runnable code in some formal programming language. Assistive coding tools, such as Github Copilot (based on a GPT-like Large Language Model), are getting widely adopted by developers @gptImpactOnCode.

The effectiveness of LLMs at performing this and related tasks was the object of study of a paper from April 2023 @poldrack2023ai. 

The experimenters subjected GPT-4 to a series of experiments which involved three kinds of tasks: generating runnable Python code from natural language, refactoring (ie: improving the quality of) existing code, and generating tests for existing code. 

As far as code generation goes, it was found that a "novice prompt engineer" could solve the problem by prompting the model most of the time; however, a sizeable minority of the problems from the experiment would have required significant human debugging.

Moreover, code refactored by GPT-4 also showed improvements (according to the chosen quality metrics) over the original badly written code; it is important to mention that this test only involved the quality of the code, not the accuracy.

The tests generated by GPT-4 were found to have a high degree of coverage, but failed the majority of the time; the reasons for their failures (it could've been the tests fault or the code's fault) were not further investigated.

The conclusions were that, while very powerful, AI coding tools still currently require a human in the loop, to ensure the validity and accuracy of results, especially when mathematical concepts are involved. Also, test generation can be partially automated, but a (human) domain expert is still needed to design them. The authors remind us that further work is needed to investigate how more advanced prompting techniques (eg: CoT) might improve the performance of LLMs on complex coding problems.

=== LLMs and naturalistic languages

Ultimately, we think that the efforts to improve LLMs that work as "translators" from natural language to some programming language will have a tremendous impact on the way people write software in the future.

We think perhaps this could also be helpful in gaining some better empirical understanding of what some researchers call "programmatic semantics" (the way natural language structures map to traditional programming language structures), which we also talked about in a previous section @metafor.

While it is a great thing to have a black-box that works as an automatic natural language to code translator, nonetheless, we think it would be of some (at least theoretical) benefit to complement those lines of research with the development of programming languages that are closer to the way humans think to being with, of new formal languages that finally bridge the _Semantic Gap_ between our ideas and the machine's primitives.

== Criticism

Despite the advantages, and independently of the implementational difficulties, there are some strong negative points to be made about natural language (used as a programming language).

=== A Lack of Precision

As we have seen, there exists a Precision/Expressivity tradeoff @kuhn2014survey. We have also already mentioned in the introduction, that Dijkstra wrote a short piece in 1978 in which he was critical of what he called: "natural language programming". According to him, not only was natural language programming technically difficult to achieve, but even supposing (ad absurdum) that it had been achieved long before modern computers were invented, it would have _harmed_ rather than _benefitted_ us programmers, and more generally the field of computer science @foolishnessnatprogramming.

Dijkstra argues that formal languages, while less familiar to the average person, are also much less prone at being misused; in natural language it is far too easy let nonsensical statements go virtually undetected.

It is true that an automated system that processes a statement in formal language may end up "making a fool of itself" by not recognizing what, to the human eye, may seem like a blatant mistake; but it is also true that the outcome of such a formal statement is clear, as opposed to an ambiguous statement in natural language, that may require context and perhaps human-level semantic competence to disambiguate; and may still not be entirely clear.

As it is explained in the article "From: Language and Communication Problems in Formalization" @fantechi2021language, a natural language's sources of imprecision are multiple: syntax, anaphora (implicit references to previously mentioned entities), vagueness, comparatives and superlatives, disjunctions ("do this _or_ do that"), escape clauses ("if _possible_"), usage of a weak verb (may, may not), quantifiers (the scope of quantifiers can be unclear), underspecification and passive voice (passive voice may omit the doer of the action).

Syntax alone, for example, accounts for multiple types of ambiguities related to the "associativity" of conjunctions and modifiers: "I go to visit a friend with a red car", is the red car mine, ie: is it the means by which I go visit my friend? Or rather it is my friend who owns it? ("friend with a red car").

=== Verbosity

Natural language, is pretty bad at expressing mathematical relations concisely; modern algebra, as Dijkstra argues, arised precisely when mathematicians gave up on trying to use natural language to represent equations.

It is important however to note that nowadays computers are not just "computing machines"; well, in a sense they still are of course, but they're also tools for document and multimedia consumption, gaming consoles, video-editing devices, office work stations etc... 

It often happens that the kind of information a user needs to describe to a computer isn't akin to densely-packed mathematical concepts; but rather to everyday concepts, concepts that are best expressed using the words and mechanisms of natural language.

Traditional "naturalistic" languages such as COBOL or Applescript have also been accused of being more verbose than the competing "non-naturalistic" languages, for using "English" syntax; however, it is to be noted that languages like the two previously mentioned ones are best regarded as classical procedural/imperative languages with a "natural language sugarcoating on top" (a vague surface resemblance to natural language); they are not built on any deeper naturalistic principles.

==== Is Expressiveness Succintness?

When we speak of "expressiveness" in the more general context of programming languages, we don't refer to the mere ability of a programming language to describe an algorithm; we also think that an expressive language should do so _effectively_. Conciseness, terseness, succintness: some people tend to believe that it is possible to equate these properties of a programming language with its effective power.

Paul Graham (1964-), computer scientist, author and entrepreneur, argues just this in an essay from 2002 titled "Succintness is Power" @succpower. The succintness he has in mind, isn't defined as the size in lines or in characters of a piece of code, but rather as the number of distinct components of the Abstract Syntax Tree (AST) of the same code.

As the author believes, a good language is a language that not only lets you tell a computer what to do once you've thought about it, but also aids you at thinking about the problem in the first place, and discovering novel solutions to it; this, however, is a property that is hard to measure precisely, because empirical tests often require predefined problems and expect a certain kind of solution, which puts a constraint on the kind of creativity that can be tested for. But the tests that have been performed, however incomplete, seem to point to the idea that succintness is power, according to the author.

The author argues that most of the other desirable traits of a language can be traced back to its level of succintness: restrictiveness is just when a language lets you take a longer "detour", rather than letting you take a "shortcut", when trying to translate your thoughts to it.

When it comes to readability, he draws the distinction between readability-per-line versus the readability of a whole program, arguing for the importance of the latter: after all, the average line of code may be more readable in language A than in language B, but if the same program requires 100 such lines to express in language A, and just 10 in language B, it may be more beneficial to sacrifice readability-per-line. But readability-per-line is a successful marketing strategy, because it means that a language will took easy to learn, to the eyes of its new potential users, and that feature can be successfully employed to advertize a language over its competitors; the author further exemplifies this with the analogy of advertizing for small monthly installments versus large upfront payments, as an instance of a parallel successful marketing strategy.

While natural language certainly is not better than mathematical notation at succintly expressing mathematical equations, there are other areas of human experience that are more easily, and perhaps more effectively, captured through the mechanisms of natural language.

// Programming Languages shouldn't be" too Natural" Mandrioli, Dino and Pradella, Matteo

=== Are legal documents _really_ written in "natural" language?

One of the criticisms we wish to add to this list relates to the blunt observation that "many important precise documents are written in natural language" @nelson2006natural. We think this claim is perhaps a little imprecise, because the "natural" language used in such works as legal documents and scientific descriptions is a special, slightly more formal subset of the more unconstrained natural language we speak everyday.

Legal English, pejoratively known as "Legalese", is a special registry of the English language (and of course all other natural languages with a legal tradition have similar subsets) that is used for the creation of precise legal documents. It is widely regarded as a very obstruse subset of English, that lay readers can only superficially understand; it is argued that Legal English has, not only its own special lexicon (words related to law), but even its own distinct syntax and semantics @legalese.

If this is true, and in lights of the problem of Compositionality which we discussed, it may very well be that natural language as it is, without any constraints of sorts, is indeed inadequate at writing anything too precise; because the semantics (the meaning) of any sentence or phrase would always be open to revision.

In any case, Legal English (while being a moderately formalized subset of English) still makes use of grammatical mechanisms that are far more "natural" than the ones adopted by traditional programming languages.

=== What is "natural" anyway (in software)?

And finally, another criticism that we may to this list, is that the current naturalistic programming languages don't seem to agree on a unique, all-comprehensive set of guiding principles for the hypothesized "naturalistic paradigm" they all seem to follow.

As we have seen, for instance, the "English" parsed by the CAL compiler is markedly procedural. It certainly is (very) much closer to English than COBOL's or AppleScript's could ever hope to be, but it still thinks of programs in terms of "procedures" and "data-structures", isn't this perhaps really the "natural", or at least the "most obvious", way to think of the organization of a computer program?

It certainly isn't the only one. We have seen how Functional Programming thinks of any program as the application of pure (mathematical) functions, how Object-Oriented programming thinks of a program as a network of independent, interacting objects that exchange messages, and how logic programming thinks of it as a list of facts, rules of inference, and goals to be (dis-)proven.

It is said that: "if all you have is a hammer, everything looks like a nail", well: what does naturalistic programming's "hammer" look like? This may be a silly question to ask, after all. The human tongues may not have a single "hammer", but rather a toolbox full of grammatical mechanisms and "natural" concepts, to help us deal with the complexity of the world.

As some argue, ideas from the programming paradigms we dicussed, ultimately trace their origin to some idea in natural language @pulido2019model: they're part of this original "toolbox" (natural language's descriptive mechanisms); and in any case, we can successfully describe these programming paradigms to someone who's never heard of them before, using natural language.

Discovering the full extent of this naturalistic toolbox is a very ambitious task, that we will not attempt to undertake, certainly not here.

== The "Essence" of Naturalistic Programming

Despite their individual differences, we think there are some distinctive common features of the surveyed naturalistic languages, that go deeper than "simple" matters of surface aesthetics; some of which are further related to the topic of the next chapter: "Common Sense".

If we were asked to give an account, a summary, of the philosophy of the naturalistic languages we surveyed, we think the following points would be our answer. It is to be kept in mind, though, that our individual biases also played a role in shaping our views, so what follows can't be a completely objective answer.

We think that a naturalistic language should: 

(1) gracefully integrate high-level concepts and low-level concepts @osmosianblog, it should offer a way to express mathematical ideas in mathematical notation, and relate those quantitative ideas to "higher-level" qualitative ones.

(2) it should be readable to the average English speaker (if based on English) @nelson2006natural,@knoll2006pegasus who should be able to correctly guess the meaning of a full (well, at least a reasonably small) program written in it; not just an individual statement here and there, the full document.

(3) it should allow for the moderate use of implicit references @knoll2006pegasus, @pulido2019model ("the red cat", "the yellow dog", "the last number"...) but not to the point of introducing anaphoric ambiguities; after all, we tend to naturally disambiguate (we paraphrase sentences) to make ourselves clear to other human beings who didn't "get us" the first time; it is fair to expect a formal register (it's a program specification after all) to require less of these implicit references, than casual talk between friends.

(4) there should be a system of "defeasible" (revisable), "gradated" (on a general to specific continuum) rules @nelson2006natural, the application of which should be managed automatically by the system, based on the specificity required in each usage; it would also be very nice to have context-sensitive resolution of pronouns (and maybe all implicit references) based on the surrounding context of the sentence they are used in. Circumstances @nelson2006natural, @pulido2019model may further restrict or generalize the applicability of a rule to a certain situation or state of affairs.

(5) errors and warnings should be reported in clear, "natural" terms. They should mention the proximate cause of the problem @nelson2006natural. No reference to underlying implementation-code should be made, but rather to the applicability of user-defined rules and circumstances (_speak the user's language_ @nielsen1994enhancing) to the concrete situations that come up. The user should be told things like: "You haven't explained what it means to 'ride' in a car, 'riding' just applies to: horses, bicycles", or: "The 'man' cannot 'ride' in the 'car' yet, because he doesn't have the 'keys'".

(6) the declarative approach is to be preferred over the imperative. A user should describe the problem rather than the solution, whenever possible; but compromises need to be made in many cases, and some procedural features may end up being necessary, after all.

