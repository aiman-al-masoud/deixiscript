= Naturalistic Programming

Natural/istic programming is a broad term that can be applied to all those attempts (with varying degrees of sophistication) at using a more or less realistic subset of natural language to write code.

The idea of instructing a computer in natural/istic language (or some formal language close enough to deserve that nomenclature) has been a long standing dream, and sometimes a nightmare, for many people in computer science, long before the advent of modern day Large Language Models.

== Precision vs Expressiveness

There is a tradeoff between naturalness and expressiveness on the one side, and ease of implementation and precision on the other.

Within the PENS (Precision, Expressiveness, Naturalness and Simplicity) language classification scheme @kuhn2014survey, a set of widely different Controlled Natural Languages (CNLs), all based on English, were classified by 4 metrics: Precision, Expressiveness, Naturalness and Simplicity.

What these metrics roughly mean, respectively, is: the level of independence from context (Precision), the amount of expressible propositions (Expressiveness), the similarity to natural language (Naturalness) and the ease of implementation as a computer program (Simplicity).

The study found, among the other results, that Precision and Simplicity are positively correlated, Expressiveness and Simplicity are negatively correlated, and Naturalness and Expressiveness are positively correlated.

To (grossly) summarize the results: the (natural) languages we learn as we grow up are very natural (obviously) and very expressive: you can say almost anything in natural language, or better yet: it's hard to come up with any concrete examples of things you can't say. On the other hand: these natural languages tend to be imprecise (highly context dependent) and, also because of this, hard to implement on a computer.

== Expressiveness and Succintness

When we speak of "expressiveness" in the more general context of programming languages, we don't refer to the mere ability of a programming language to describe an algorithm; we also think that an expressive language should do so _effectively_. Conciseness, terseness, succintness: some people tend to believe that it is possible to equate these properties of a programming language with its effective power.

Paul Graham (1964-), computer scientist, author and entrepreneur, argues just this in an essay from 2002 titled "Succintness is Power" @succpower. The succintness he has in mind, isn't defined as the size in lines or in characters of a piece of code, but rather as the number of distinct components of the Abstract Syntax Tree (AST) of the same code.

As the author believes, a good language is a language that not only lets you tell a computer what to do once you've thought about it, but also aids you at thinking about the problem in the first place, and discovering novel solutions to it; this, however, is a property that is hard to measure precisely, because empirical tests often require predefined problems and expect a certain kind of solution, which puts a constraint on the kind of creativity that can be tested for. But the tests that have been performed, however incomplete, seem to point to the idea that succintness is power, according to the author.

The author argues that most of the other desirable traits of a language can be traced back to its level of succintness: restrictiveness is just when a language lets you take a longer "detour", rather than letting you take a "shortcut", when trying to translate your thoughts to it.

When it comes to readability, he draws the distinction between readability-per-line versus the readability of a whole program, arguing for the importance of the latter: after all, the average line of code may be more readable in language A than in language B, but if the same program requires 100 such lines to express in language A, and just 10 in language B, it may be more beneficial to sacrifice readability-per-line. But readability-per-line is a successful marketing strategy, because it means that a language will took easy to learn, to the eyes of its new potential users, and that feature can be successfully employed to advertize a language over its competitors; the author further exemplifies this with the analogy of advertizing for small monthly installments versus large upfront payments, as an instance of a parallel successful marketing strategy.

While natural language certainly is not better than mathematical notation at succintly expressing mathematical equations, there are other areas of human experience that are more easily, and perhaps more effectively, captured through the mechanisms of natural language.

== Shortcomings of traditional programming languages

The push towards naturalistic programming stems in part from the shortcomings of contemporary programming languages at describing certain classes of problems concisely @knoll2006pegasus, @knoll2011naturalistic, @lopes2003beyond, @pulido2017survey.

In these works, it is argued that the abstractions that power the current generation of programming languages, while adequate to support general purpose programming, often tend to result in verbose, repetitive and brittle code.

There is a _Semantic Gap_ between the desired behavior of a program and the code that is written to produce it, the same paper which discusses this concept @knoll2011naturalistic shows how this fact results in the "scattering of ideas" in traditional programming languages, whenever the need arises to express a concept that isn't directly supported by the language in question. 

A concrete example of this "scattering of ideas" results from the use of flags (boolean variables) that are conditionally modified in a loop and read elsewhere in the code: the logic behind their particular usage may be trivial when explained in natural language, while being entirely opaque at a first reading of the code; this means that the logic they express may have to be painstakingly pieced back together by the people that read the code, potentially many times over. Code comments, which consist essentially of short natural language explanations of the code's behavior, may help add clarity to such obscure pieces of code, but one must be careful to avoid their usage in excess, as they may become obsolete and are not checked by the compiler.

The emergence of Aspect Oriented Programming (AOP) is brought up an earlier paper @lopes2003beyond, to make a similar argument regarding the limits of traditional programming languages.

AOP is a programming paradigm that aims at increasing the modularity of code by addresses the problem of cross-cutting concerns, and does so by advocating their separation from the core business-logic. A cross-cutting concern, in software development, is an aspect of a program that affects various modules at the same time, without the possibility (in non-AOP languages) of being encapsulated in any single one of them.

A most obvious example is logging all of the calls to functions with such and such characteristics and only those. In a traditional OOP language, one would have to insert a call to a the logger at the beginning or at the end of every function that one wished to track. In an AOP language this is a concern that can be handled by an Aspect: a separate section of the program that neatly encapsulates that cross-cutting concern, similar to how we could write a "chapter about logging" if we were trying to describe the behavior of the same application using nothing but the referenatial capabilities afforded by natural language in a traditional book.

The need for better abstractions is also reflected in the general criticism of software design patterns as what could be described as a poor languages's solution to the lack of more powerful abstractions @revengenerds, and in the practice of Literate Programming @knuth1984literate.

== Literate Programming <literate>

Donald Knuth (1938-), a computer scientist known for his foundational work in time complexity theory and for creating the TEX typesetting and markup system, coined the term "Literate Programming" in 1984 to describe his novel approach to writing programs.

Knuth designed a language called "WEB"; apparently back when he chose this name for it, the word "web" was still "one of the few three-letter words of English that hadn't already been applied to computers" @knuth1984literate.

The language WEB combines together a markup language with a traditional general purpose programming language (TEX and PASCAL respectively, in Knuth's original work); the idea is that a program can be seen as a web of components, and that it is best to describe the links between these components using a mixture of natural language descriptions (with TEX) and formal notation (with PASCAL).

According to this philosophy, the program should make sense to a human being first and foremost, so the majority of it is composed of natural language sentences and phrases, interspersed with (relatively little) definitions in formal language.

== Natural Style <the80s>

It is interesting to take a look at how people actually describe problems and their solutions in natural language. It is telling that the manner, style and train of thought in describing an algorithmic procedure employed by a person on the street, or even by a programmer when elaborating an idea in the abstract, can be very different from that which the same programmer employs when translating his/her ideas into executable code @knoll2006pegasus, @miller1981natural.

An early and oft-cited study in this respect is the one conducted by L. A. Miller in 1981 @miller1981natural. A group of college students who were not familiar with computers were asked to provide solutions to six file manipulation problems, and their proposed solutions (all written in natural language) were evaluated for metrics such as preference of expression and contextual referencing.

It was found that the students were prone to use contextual references such as pronouns and words like "the previous" and "the next", a phenomenon broadly known as Deixis. They would use these implicit contextual references rather than explicitly assigning any variables.

The students preferred to treat data structures in a cumulative way, using universal quantifiers rather than loops to express operations that had to be carried out on multiple instances of a data structure. They avoided using any of the traditional structured programming constructs (if-then-else, while, for...) or even unstructured programming constructs (goto statements).

When describing an algorithm, the students tended to begin by the most general and crucial step of the procedure, to only then mention those special cases which required a different sort of treatment; further refining, or annotating, an initial general statement is an idea that is also brought up with some variations in @brachman2022machines and thus seems to us as an important trait of how humans naturally tend to describe complex problems.

This is often not how we do things in programming language code, where the crucial step of a function may be buried deep within a hierarchy of nested if-statements; or perhaps, to avoid the nesting, delayed until after all of the guard clauses and early returns that check for all of the edge cases.

Perhaps the success of the exception handling model (which itself is not perfect, by any means) is owed in part to the philosophy of tackling the most important step first, and handling the edge cases as exceptions later.

The subjects of the 1981 experiment @miller1981natural also expected the computer to possess some pragmatic knowledge of the world and of their intentions, expecting it to fill in the semantic gaps whenever needed. As Dijkstra would've put it: "They blamed the mechanical slave for its strict obedience with which it carried out its given instructions, even if a moment's thought would have revealed that those instructions contained an obvious mistake" @foolishnessnatprogramming.

Another finding was that the subjects tended to use a relatively restricted vocabulary, though they still liked to use synonyms from time to time.

== Stories and Code

What do computer programming and story telling have in common? A lot, according to a study from 2005. The study involved a system which automatically translated user stories to Python code fragments @liu2005metafor, @liu2005programmatic.

The program, which can be seen as a very peculiar kind of transpiler, called Metafor, was integrated with a large Common Sense Knowledge base called Concept-Net, derived from the Open Mind corpus of natural language Common Sense statements.

The code generated was "scaffolding", or underspecified code, that in fact wasn't meant to be executed right out of the box. Related to this, is an interesting concept discussed in the work; that ambiguity isn't always a negative aspect of natural language, on the contrary, it is a means of avoiding difficult design decisions at too early of a stage in a project; and indeed Metafor was designed to automatically refactor the output Python code whenever it received an indication that the underlying representation was no longer adequate to the story being told and had to change; for instance, by automatically promoting attributes of a Python class to sub-classes of their own @liu2005metafor. This ties in well with the idea of "successive refinements" we mentioned earlier.

The paper also touched upon the concept of programmatic semantics, expanded upon in another work @liu2005programmatic by the same authors; which is the idea that natural language structures imply and can be mapped to the more traditional programming constructs, the authors claim that "a surprising amount" of what they call programmatic semantics can be inferred from the linguistic structure of a story @liu2005metafor. The authors propose, by making a simple example, that noun phrases may generally correspond to data structures, verbs to functions, and so on. <verbsasfuncs>

As we already saw, the code produced by the system was never really meant to be complete or executable, but its main purpose was to facilitate the task of outlining a project, especially for novice users. And it showed promising results when it was tested by a group of 13 students, some of which with novice and some of which with intermediate programming skills. The students responded to the question of whether they'd be likely to use it as a brainstorming tool, in lieu of more traditional pen-and-paper methods @liu2005metafor.

== General Purpose Systems

Since then, there have been newer and more complete attempts at creating a comprehensive natural language programming system, that supported general purpose programming. We will proceed to mention three of what we think may be the most important ones: Pegasus, CAL and SN.

=== Pegasus <pegasus>

The original implementation of Pegasus is outlined in a 2006 paper @knoll2006pegasus by Roman Knöll and Mira Mezini, the former of which I had the pleasure of contacting privately via e-mail, and who has confirmed that the project and related work are still under active development although the official webpage hasn't been updated since 2018, on the date of writing this @pegasuswebsite.

==== Implicit Referencing, Compression and Context Dependence

According to the authors, the main features that distinguish natural language from programming languages are: implicit referecing, compression and context dependence.

Implicit referencing refers to the usage of Deixis in speech, pronouns such as "it", "he", "she", words like "the former", "the latter" and demonstratives like "this", "that" are all words clearly exemplify this phenomenon.

Compression is a mechanism that avoids the tedious repetition of information and it can be of two kinds: syntactic or semantic. The former refers to the use of words such as "and" in a sentence like: "he pets the cat and the cheetah" understood as an abbreviation for "he pets the cat and he pets the cheetah". An example of semantic compression would be the in sentence "first go from left to right, then viceversa", where "viceversa", in this case, would mean: "from right to left".

Context Dependence refers to the fact that, contra most programming languages, the same string in natural language can be reduced in different ways depending on the surrounding context, not only on the string itself. In the sentence: "the mouse runs, then it jumps, the cat kills it, then it jumps" there are two identical instances of the phrase "then it jumps": in the former the pronoun "it" refers to the mouse, in the latter the pronoun "it" refers to the cat.

These three mechanisms, in the authors' opinion, all help in reducing the amount of redundancy in our spoken and written communication.

==== Idea Notation

The authors discuss of a possible formalization of human thought; it may or may not be possible for a computer to "experience" the same thoughts and feelings as a human being, but, according to the authors, it is should be possible to describe the structure of human thought formally enough for it to be imitated mechanically.

They propose a distinction between what they call "Atomic" versus "Complex" ideas, the former stemming directly from human perception (such as "the smell of wood", or "the warmth of wood"), and the latter being a combination of the former (such as the very idea of "wood").

They also recognize a third category of ideas they call "Composed", which "combine several Complex ideas for a short moment" @knoll2006pegasus, effectively corresponding with propositions, such as the meaning of the sentence: "the car drives on the street".

Every idea, they assert, can have a concrete representaiton as: an entity, an action or a property; corresponding to a noun, a verb or an adjective/adverb respectively, in most natural languages.

The authors then describe a formalism they call "the idea notation" to express concepts and thoughts in this framework, and to perform automatic computations on them.

==== Architecture

The architecture of Pegasus is described as being composed of three parts: the Mind, the Short Term Memory and the Long Term Memory.

The Mind is what matches ideas to idea-patterns stored in Pegaus's long term semantic network. An idea-pattern is associated to an action, which is performed when the Mind determines that it matches an idea recevied as an input.

The Short Term Memory is what enables Pegasus to contextually resolve pronouns such as "it", and other deictic words and phrases. It is implemented as a bounded queue, and purposefully limited to 8 memory cells, corresponding to eight recently mentioned entities, as the authors believe this is optimal number for operation by human beings (cf: @miller1956magical).

Lastly, the Long Term Memory stores Pegasus's semantic knowledge, for example is-a relationshipts between concepts.

When an idea and its sub-ideas are fully resolved, such a system can take action directly (as an interpreter), or generate the equivalent code in a given programming language (as a compiler), the paper mentions Java as an example.

==== Translatability

An interesting idea mentioned in the paper is that of a "translatable programming language": Pegasus is designed to be language-independent at its core, this means that many different front-ends, corresponding to different concrete grammars, corresponding to different human languages, can be implemented for it. For instance, the paper mentions Pegasus's capability of reading both English and German, and even of freely translating between a language and the other.

The paper mentions the programming language AppleScript as a historical precedent for this idea, as it has been, at least for a period of time, multilingual; this really meant that AppleScript's keywords had translations in multiple natural languages. In any case, AppleScript took the more popular (and less naturalistic) approach of "masking" the rather traditional structured programming constructs with a thin natural language mask.

// ALSO ALGOL https://en.wikipedia.org/wiki/Non-English-based_programming_languages

==== Drawbacks

Some of the drawbacks of the approach taken by Pegasus (and of naturalistic programming in general) are discussed in the final part of the paper. The general problems are said to be: varying choice of expression, vagueness inherent in natural language specifications (cf. @fantechi2021language), the convenience of mathematical notation over natural language descriptions (cf. @foolishnessnatprogramming) and the limitation in expressivity imposed on the naturalistic language by the underlying programming language when transpiling to it.

Drawbacks related to Pegasus, or at least to the original version, include performance issues related to some of the implementation choices, the problem of having to manage an extensive database due to the choice to support a language's full natural inflection and conjugation patterns, and the limited expressivity of the initial implementation of the Pegasus language itself.

All in all, Pegasus remains a valid example of a general purpose naturalistic programming system; the product is, to our knowledge as of writing, not yet available to the public, but one can see examples of its usage on the project's official website @pegasuswebsite.

=== CAL <cal>

Another example of general purpose naturalistic programming language, also originally from 2006 with further developments up until recently, is presented by the intrestingly called "Osmosian Order of Plain English Programmers" @osmosianblog.

A motivation behind this project, as explained by the authors, is to eliminate the intermediate translation step from natural language pseudo-code to rigorous programming language notation (cf:  @knoll2006pegasus).

Another motivating factor was to answer the question of whether natural language could be parsed in a sufficietly "sloppy" (partial) manner (as the authors suspect human beings do, or at least infants growing up) as to allow for flexibility in choice of expression and for a stable programming environment.

And finally, to determine whether low-level programs could conveniently be written in such a subset of the English language.

The authors seem to have come to the conclusion that all of this is indeed possible, using their system.

The authors draw a parallel between the "pictures" (we assume they're talking about mental images in human beings) and the "types" (programming language types), and between the skills that a young (or old) human being may acquire and the traditional routines of a programming language.

Most of the code in most of the programs, they claim, represents simple enough logic that it is most convenient to express it in natural language. However, high-level (natural language) and low-level (programming language) code can and should coexist in certain scenarios; the authors use the metaphor of a math text-book to support this idea: mathemathical formulas in formal notation, when convenient, interspersed in a text mostly made up of natural language; an idea akin to the philosophy behind Literate Programming we discussed earlier @literate.

What's striking about this language is that, albeit very English-like in syntax, there is a markedly procedural taste to it, complete with variables, loops and routines. There are something like three kinds of routines: procedures, deciders and functions. The procedures, just like classical procedures, are routines with side effects that "simply do something" without returning a value. Deciders and functions on the other hand can resolve to a value; the former being used to define when a condition is true (also allowing the system to infer when it is false), and the latter being used to derive a value from a passed parameter and also usable with possessives (such as "the triangle's area") in a fashion reminiscent of getter methods or derived properties in OOP.

It is possible to define custom data types, using natural language syntax to define the fields and the respective types thereof. Among the custom types that can be defined are "records" and "things" (a kind of dynamic structure). Units of measurments and the conversion between them are also supported. 

The language also supports event driven programming, and has various I/O capabilities such as timers, audio output and even a 2D graphics system which can be used to draw and plot shapes.

The CAL compiler is freely downloadable (and can re-compile itself in about 3 seconds), together with the instructions manual available as a pdf, all on the Osmosian Order's website; however, it is only available for Microsoft Windows systems at the time of writing. The 100 page manual gives a comprehensive overview of the language with plenty of examples @osmosianblog.

// Based on a remark on a differ
// % seems to be nominal not structural https://wiki.osdev.org/Plain_English_Programming

=== SN

A slightly newer example of a full fledged naturalistic programming language is given by the language SN (which stands for "Sicut Naturali", or "Just as in nature" in Latin @hernandez2021evolution) discussed in a 2019 paper by Oscar Pulido-Prieto and Ulises Juárez-Martínez @pulido2019model.

The authors cite a distinction made by others between what is called the "formalist" versus the "naturalist" approach to programming languages based on natural language. The formalist approach focuses on correct execution, thus favoring an unambiguous grammars, while the naturalist approach tolerates ambiguous grammars and attempts to resolve the remaining ambiguities using techniques from artificial intelligence @pulido2019model.

The authors state that their approach is closer to the formalist camp; and interestingly, while the philosophy and style of the language is novel, and differs significantly from a typical object oriented language, and while many of the syntax does try to imitate English to a certain extent, the syntax overall is a little less close to English's than the two previously surveyed projects (@pegasus, @cal).

The authors discuss what they believe are the basic elements that should allow a naturalistic system to function as a general purpose programming language, and come to the conclusion that the required building blocks for such a system are: nouns, adjectives, verbs, circumstances, phrases, anaphors, explicit and static types and formalized syntax and rules (in accordance with the formalist approach).

A SN Noun roughly corresponds to a class in OOP as it can inherit from another noun (only single inheritance is allowed) and can posses attributes. An Adjective, on the other hand, supports multiple inheritance, and can be applied to a Noun to specialize it. A verb is defined on either a Noun or an adjective, similar to how a method can be defined on a class or on a trait (such as in the language Scala).

Circumstances are a special construct that can apply to either attributes or verbs, they serve to specify the applicability (or unapplicability) of adjectives to Nouns, or the conditions and time of execution of a verb. For instance, one could specify that an Adjective mutually excludes another, or that a verb should be executed before or after another, for example to log the creation of all instances of a certain kind of Noun.

Noun phrases, which can be a combination of Nouns, Adjectives, and "with/as" clauses, and can support plurals, have a dual usage in SN: they can either be used as constructors to create new instances of a certain kind (with the "a/an" keyword) or to refer to already existing instances of such a kind (with the "the" keyword).

The language also introduces the concept of "Naturalistic Iterators" and "Naturalistic Conditionals", this is accomplished with the use of reflection to refer to the instructions of the program themselves, for example by making such statements: "repeat the next 2 instructions until i > 10."

The compiler can produce Java Bytecode or even transpile snippets of code in the language to Scala.

== Criticism

There has been disagreement regarding the extent to which programming in natural language may prove to be advantageous, but even on whether it be a desirable goal to achieve in the first place. 

Edsger Dijkstra (1930-2002) was a notable computer scientist, advocate of structured programming and famous for (among the other things): the Dijkstra shortest path algorithm, the Banker's algorithm and the concept of semaphore in multi-threaded computing.

Dijkstra wrote a short piece in 1978 lambasting what he called "natural language programming". According to him, not only was "natural language programming" technically difficult to achieve, but even assuming (ad absurdum) that it had been achieved long ago, it would have done programmers and more generally the field of computer science no good @foolishnessnatprogramming.

Dijkstra argues that formal languages, while less familiar to the average person, are also much less prone at being misused; in natural language it is far too easy to make nonsensical statements, and while it is true that an automated system that processes a statement in formal language may end up looking "stupid" by not recognizing what, to the human eye, may seem like an blatant mistake, it is at least clear what the outcome of such a statement will be, as opposed to the ambiguity inherent to much of what we say in natural language.

Natural language, moreover, is pretty bad at expressing mathematical relations concisely; modern algebra, he argues, arised precisely when mathematicians gave up on trying to use natural language to represent their equations.

While Dijkstra raises some important points that we shall elaborate on in some of the later discussions, it is important to remember that back in the day when he was writing, computers weren't nearly as widespread as in the present date; back then it was easier to regard the computer as merely a calculating device (hence the higher relevancy of mathematical notation in programming languages). 

Nowadays computers are tools for document and mutlimedia consumption, gaming consoles, video editing devices, office work stations etc... What an end-user often requires isn't a precise formalism to neatly express a mathematical concept, but rather an easy to learn scripting language to customize the behavior of a program on their computer. We think that natural language may be a good candidate at least for this niche, and for many other real-world problems that don't involve too many abstract mathematical concepts.

// Programming Languages shouldn't be" too Natural" Mandrioli, Dino and Pradella, Matteo
// ambiguities in natural language, Fantechi

A criticism that we may add, is that naturalistic programming doesn't present a all-comprehensive paradigm the same way procedural or functional, or even object oriented programming do; we have seen examples of naturalistic languages with very different orientations. There are however some common ideas that we think we found in every work.  

// TODO
// == Naturalistic Types
// #bibliography("bib.bib")

== Prompt Engineering

We couldn't have a full discussion of programming and natural language in the year 2023 without briefly discussing Large Language Models (LLMs) and the nascent discipline of "Prompt Engineering".

An LLM is a general purpose language model, typically based on "transformers": a kind of neural network architecture. It is trained on huge amounts of data, to give an idea of the size: it is reported that GPT-3 (Generative Pre-trained Transformer) was trained on 45 terabytes of text data collected from the Internet. // https://www.springboard.com/blog/data-science/machine-learning-gpt-3-open-ai/

Such models are "general purpose", in the sense that they have language "understanding" and generation capabilities that can be useful in a very wide range of applications. Such models can be fed a text input (prompted), and they are typically described at any step as predicting "the most likely word" that comes after the "sequence of words" in the prompt.

Prompt Engineering aims to develop and optimize prompts to LLMs, while trying to understand their capabilities and limitations. // https://www.promptingguide.ai

The "Prompt Engineering Guide" webiste offers a wide-ranging overview of the concepts and techniques from this emergent discipline, with plenty of links to (very recent) studies and material for further reading. 

A prompt can be an instruction or a question, and may include other details such as context, input data or examples.

// similar to: https://en.wikipedia.org/wiki/Programming_by_example
// https://web.media.mit.edu/~lieber/PBE/

The applications of LLMs mentioned earlier include, but are not limited to: text summarization, information extraction, text classification (eg: sentiment analysis), conversation (or "role prompting", ie: configuring custom chatbots), code generation (which is of special concern to us) and reasoning.

All this can sometimes be achived through a very simple prompt, and sometimes requires a little more thinking and cleverness to get the model to behave as desired. The Prompt Engineering Guide recommends to start simple: plenty of tasks can be achived through single or few shot prompting.

Single shot prompting is when the model is asked for a response without even being given any prior example of the task to be accomplished. Few shot prompting is when some examples are provided. These are usually packaged in some more-or-less predefined format, such as the popular Question and Aswer (Q&A) format.

"Harder" problems such as reasoning through a mathematical problem sometimes require more than a few examples to get the answer right; this is why more advanced techniques such as Chain of Thought (CoT) reasoning are being experimented.

CoT involves providing the model with a breakdown of the solution to the example problem in terms of easy to perform tasks in a step-by-step approach. For instance, in the problem of summing up the odd numbers taken from a list of numbers, the model may benefit from being told to: "find the odd numbers first, then sum them up". Another trick to get the model to reason stepwise, is to add at the end of a prompt a statement like: "let's think step by step".

Other two recommendations are to: be specific about what you want, to be precise; and to avoid telling the model what it shoudln't do, but rather tell it what it should do (even in the sense of merely paraphrasing the sentence). For instance, telling the model that: "the chatbot should refrain from asking for personal preferences" is considered better than the direct command: "do not ask for personal preferences".

The behavior of an LLM can also be influenced at a lower level by tweaking its settings or "parameters"; and there are a few of these: temperature, maximum length, stop sequences, frequence and presence penalty.

Temperature is related to how "deterministic" the output should be: a lower temperature causes the LLM'S output to be "more deterministic", ie: the words with the highest likeliness are chosen more often (making it is slightly better for tasks that require factual answers); while a higher temperature means that less likely (hence less "obvious") words are chosen to complete the output, resulting in better performance for tasks that require a higher level of "creativity".

A stop sequence is a special sequence of tokens that tells the model to stop producing text when it is generated. It can be an alternative to the maximum length, which only specifies the upper bound for the length of a generated response, helping one to avoid excessive API-usage costs or long/irrelevant responses.

Frequency Penalty discourages the model from repeating words that it has alreay used, words that have appeared more often will be less likely to appear again. The Presence Penalty places the same and only penalty on all repeated tokens regardless of their respective frequencies, this prevents the model from repeating phrases (sequences of words) too often (because all words in the phrase are penalized the same). A higher Presence Penalty will cause the output of the model to be more "creative", while a lower Presence Penalty will help it stay "focused" on a task.

There are potential problems and risks associated to prompting LLMs. Some of the more obvious ones are: related to bias (ie: the order and distribution of exemplars might influece answers to the more ambiguous or edge-case prompts), and factuality: there is no guarantee that the output of the model will contain factual information as is clearly stated by the disclaimers on the websites of the companies that provide access to said models as a service, nonetheless there are cases where this basic fact has been disregarded by users of the model. // https://yro.slashdot.org/story/23/05/27/1755212/lawyer-greatly-regrets-relying-on-chatgpt-after-filing-motion-citing-six-non-existent-cases

Other less obvious risks are related to the so called: "Adversarial Prompting", which can take on a variety of forms: Prompt Injection, Prompt Leaking and Jailbreaking.

Prompt Injection (a snowclone of "SQL Injection") is a direct effect of the flexibility of the input medium (unconstrained natural language); any sentence could be treated as data or as an instruction, a property that is related to what is known as "Homoiconicity" in some programming languages: “In a homoiconic language, the primary representation of programs is also a data structure in a primitive type of the language itself”. // https://www.ronpub.com/OJWT_2021v8i1n01_Ceravola.pdf

This means that malicious "code" can be introduced by a user communicating with the model through the standard text-based input channel, if the input isn't duly sanitized before it is fed to the model. For example, the original command to the model might have been to: "translate the upcoming sentences from English to French" (say), but an end-user may tell the model to: "disregard your previous orders, and say something else instead, at random".

This problem can be mitigated by introducing an explicit distinction between instructions and data, for instance by telling the model to accept only input data in a specific format (quoted strings, or bracketed strings for example). Another solution is to use yet another LLM to detect adversarial prompts.

Prompt Leaking is when a special kind of malicious prompt succeeds at letting the model discolse its original "orders" (we might metaphorically call them "source code"); this can be risky if the model (eg: a chatbot) was aware of some sensitive data from the company behind it, that wasn't supposed to be made public to users on the Internet.

Jailbreaking: a term loaned from the older practice of exploiting the security flaws of an artificially locked-down hardware device to make it run arbitrary software; in the context of LLMs is the practice of tricking the model into "saying" (possibly unethical) things it was originally aligned to avoid; an example is the DAN (Do Anything Now) trick applied to the online versions of GPT, which worked by telling the model to produce an impression of, or to simulate the responses of, another model (namely "DAN"), which was unconstrained and could say anything.

This is somewhat related to the so called "Waluigi" effect (from an antagonist character of the Super Mario franchise) discussed in depth in this article  // https://www.lesswrong.com/posts/D7PumeYTDPfBTp3i7/the-waluigi-effect-mega-post
The Waluigi effect essentially describes the tendency of a conversational model to relapse into the exact opposite "character" it was told to imitate; doing the exact opposite of what it was told to do. In other words, Waluigi is said to be an "attractor state" of the model.

This is all discussed in depth by the article, a simplified version of a possible explanation for this peculiar behavior seems to be: that it is easier for a model (takes little extra information) to emulate the "antagonist" once it is told exactly how the "protagonist" should behave. This, and the overwhelming presence of the "protagonist vs antagonist" literary trope in the training data (texts mined from the Internet).

== AI-Assisted Coding

We glimpsed at the fact that modern LLMs trained on multi-lingual corpora can translate between different natural languages (such as English to French, or viceversa). We've also mentioned, among the tasks that a modern LLM can perform, the generation of programming language code from an input prompt in natural language. 

As such, an LLM can be thought of as implementing a transpiler (or source-to-source compiler) from a vague specification in natural language to runnable code in some formal programming language. Assistive coding tools, such as Github Copilot (based on a GPT-like Large Language Model), are getting widely adopted by developers // https://github.blog/2023-10-10-research-quantifying-github-copilots-impact-on-code-quality/

The effectiveness of LLMs at performing this and related tasks was the object of study of a paper from Aprile 2023. 
// https://arxiv.org/pdf/2304.13187.pdf
The experimenters subjected GPT-4 to a series of experiments which invloved three kinds of tasks: generating runnable Python code from natural language, refactoring (ie: improving the quality of) existing code, and generating tests for existing code. 

As far as code generation goes, it was found that a "novice prompt engineer" could solve the problem by prompting the model most of the time; however, a sizeable minority of the problems from the experiment would have required significant human debugging.

Moreover, code refactored by GPT-4 also showed improvements (according to the chosen quality metrics) over the original badly written code; it is important to mention that this test only involved the quality of the code, not the accuracy.

The tests generated by GPT-4 were found to have a high degree of coverage, but failed the majority of the time; the reasons for their failures (it could've been the tests fault or the code's fault) were not further investigated.

The conclusions were that, while very powerful, AI coding tools still currently require a human in the loop, to ensure the validity and accuracy of results, especially when mathematical concepts are involved. Also, test generation can be partially automated, but a (human) domain expert is still needed to design them. The authors remind us that further work is needed to investigate how more advanced prompting techniques (eg: CoT) might improve the performance of LLMs on complex coding problems.

// We suggest that it might be proficuous to examine the way this mapping...

== Inform 7

Inform 7 is perhaps the most advanced naturalistic programming language we know of, and certainly the only one that has been widely (by naturalistic language standards) used among the ones we surveyed.

Designed by British mathematician and poet Graham Nelson (1968-), as a successor to the more traditional Inform 6 programming language (also created by him), Inform 7 is a domain specific language for the creation of Interactive Fiction (IF).

IF can be thought of as a form of (interactive) literature, where a reader can interact (chiefly through text) with the characters and environments in the narrative, which can include graphics and puzzles; IF can also be thought of as a kind of video-game, or "text-adventure". This typically invloves the simulation of environments (called "rooms"), objects and characters and the interaction of these together.

All Interactive Fiction products before Inform 7 were typically authored in classical (procedural or OOP) programming languages; and indeed: Inform 6, Inform 7's predecessor, was one such language: a C-style procedural language with Object-Orientation, and some extra features (like "hooks") geared towards IF creation specifically.

Inform 7 reads almost like English, and boasts quite an unusual feature-set compared to mainstream programming languages. Unlike its predecessor, it is not Object-Oriented but rather "Rule-Oriented" (we will see what this means); Inform 7 can also infer the type of a "variable" from its usage, but that doesn't refer to type inference in classical variable assignments or return types (as in traditional languages), but rather to what could be seen as a limited form of context sensistivity.

Inform 7 can perform inference of a the category (or "kind") of the referent of a noun phrase; for instance: if a rule is declared that states that only people can "wear" things, and a variable (say "John") is declared to be "wearing a hat", then John will be created as a person.

In the 2005 (revised in 2006) paper titled: "Natural Language, Semantic Analysis and Interactive Fiction" @nelson2006natural, Nelson explains what strategies were used in the implementation of Inform 7, and what difficulties were encountered (mainly in the broad subject of Semantics). As a side note, the language was recently open-sourced (in 2022), and the source-code is available on GitHub, as of the date of writing. The paper also argues that natural language is the _natural_ language for the creation of IF content.

// https://intfiction.org/t/inform-7-v10-1-0-is-now-open-source/55674
// https://github.com/ganelson/inform

The paper states that the four rules that were followed in the design and implementation of the language were that: (1) A casual reader should be able to (correctly) guess the meaning of Inform 7 source code; (2) The implementation has to be (computationally) economical, but not at the price of intelligibility; (3) if in doubt as to syntax, the language should imitate books or newspapers; (4) contextual knowledge is (mainly) supplied by the author of a program, not built into the language.

As an example of rule number (3) in action, one of the data structures in Inform 7 is the table (there are no arrays); and the table looks like a table in print. 

The rationale behind rule number (4) is that the language can be more flexible, and bend better to the needs of the programmer, without the presence of a built-in database of semantic knowledge. However, is not an absolute rule: there are indeed some (few) semantical concepts that are built into the language, such as the spatial concept of "containment" which is deemed important by programmers of IF.

Inform 7, as already stated, emphasizes Rules over Objects. Nelson observes that Interactive Fiction is a domain where "unintended consequences" and "unplanned relationships" abound; there are no clearcut "server-client" relationships between the objects: there are no "master" classes and "slave" classes which exist solely for the purpose of the former, and hence it is simply not feasible to manually define rules of interaction between every two pair of classes (or even interfaces) in the program; he gives the example of a "tortoise" and an "arrow" as two kinds of very different things that are probably not going to be thought of as interacting together when writing the game, but may end up doing so anyway in game-play, and it is simply not feasible to go around defining "tortoise-arrow protocols".

The strong distinction between "specific" and "general" rules that exists in OOP is seen as inadequate for this kind of application. Class and method definition are what he calls "general" rules, and object creation with specific attributes and values for the sake of the concrete program or game are what he refers to as "specific".

An example of how this is an issue is given by the (code organization) problem of the apple in the box and the magical ring. Suppose there is a general rule in the game about boxes being impermiable (the player can't stick a hand through to grab the apple stored inside, just like he/she can't walk through walls); but it is further stipulated that a player wearing a magical ring should be able to.

The solution to this problem in Inform 6 (which is an OOP language) was either to add a general rule, which was deemed a little over-the-top for such an ad-hoc circumstance; or to attach this behavior to a specific action: the taking of the apple (therefore: inside the apple fruit's code), which was also deemed inappropriate, because, paraphrasing the author's elegant explanation: some might see this peculiarity (the immaterial grasping hand) as a behavior of the magic ring, and some might see it as a behavior of the box, but certainly none will naturally come to think of it as a behavior of the apple!

The solution in Inform 7 involves the introduction of a new kind of rule, which specifies the circumstances under which other rules have to be ignored. // cf: machines like us 
In general, specific rules take precedence over more general ones, and the order of declaration of the rules in the source code is irrelevant, because rule-precendence is handled automatically.

This system of "gradation of rules" needs: (1) a working system of types that can recognize and match subtypes to general types; and (2) a mechanism to declare "circumstances" in which different rules apply (or don't).

The paper's discussion on semantics briefly touches on the broader issue of Compositionality. The problem is a well known one in philosophy and linguistics; Compositionality (expressed simple terms) is the idea that: "the meaning of a complex expression is determined by its structure and the meanings of its constituents". This certainly seems to be a property of artificial languages (such as mathematical notation, or most computer languages) but it is disputed whether it is also a property of unconstrained natural language. // https://plato.stanford.edu/entries/compositionality/

Pronouns are certainly another, related, problem in semantics. The issue of "Donkey anaphora", an old issue in logic, is brought up. In the sentene: "If the farmer owns a donkey, he beats it" how are we to resolve the pronoun "it"? As: a single individual donkey, or rather as any donkey that is owned by the farmer?

As already mentioned, types ...




