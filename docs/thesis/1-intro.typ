= Introduction

== What is naturalistic programming?

Naturalistic programming is broadly defined as the attempt to write (computer executable) code in a varyingly complex _subset_ of a natural language: the kind of language we are all naturally familiar with, and brought up speaking from a very early age.

We say "a _subset_ of natural language" because full, unconstrained, natural language is (at least we think) still far too complex and dynamic to be used as a feasible programming language, without any constraints or limitations put in place whatsoever; and no one so far has agreed entirely on what that _subset_ should look like, let alone what it should (or shouldn't) allow us to say.

It was (and maybe still is) customary to dismiss all these attempts with the justification that natural language is too "imprecise", too "vague" or too "ambiguous" for the job of telling computers what to do; that this job better suits formal languages, so why bother anyway?

Edsger Dijkstra (1930-2002), the late, great computer scientist and early advocate of structured programming, famously wrote a piece in 1978 titled: "On the foolishness of "natural language programming" @foolishnessnatprogramming. In it he discusses what he (rightly) sees as the defects of natural language (ambiguity, verbosity...) compared to formal languages when describing mathematical concepts and computer algorithms. 

He goes as far as to argue to the effect that even if "natural language programming" were ever achieved, it wouldn't be a step in the direction of scientific progress, but rather a step back into the "dark" ages of mathematical notation: the rhetorical stage, back when equations were expressed in long, convoluted, confusing words, rather than in elegant and concise symbols.

And yet, we still speak natural language everyday: we listen to the news, we read books, we speak to our dearest friends and relatives, we trust natural language with the preservation of our legal rights and statues, with the preservation of our very democracy! How can such a vague, ambiguous, imprecise linguistical system (or systems) not be trusted at making sure our computers don't crash, yet be fully trusted in making sure the rest of our human society doesn't come crumbling down like a castle of cards? There's clearly more to say about natural language.

// we write very important documents that 
// we should be familiar enough 
// could this be a problem of 
// but stat systmes

== The End of Programming

Though it may sound paradoxical, in light of what we just said, unconstrained natural language may indeed be headed to become the primary means of interaction between us and our computers, in the short to medium term.

But this is not a paradox: the last decade (the 2010s) has seen the comeback and surge in popularity of Big Data and Machine Learning techniques on the scene of Artificial Intelligence (AI), along with the development of new Deep Learning architectures: such as the Transformer, originally proposed in 2017.

Modern day Large Language Models (LLMs) can say and do things most of us never imagined were possible (in the practical sense) for a computer program before; though everyone knew, of course, of the theoretical possibility for such apparently "intelligent" behavior, as evidenced also by thought-experiments such as John Searle's famous Chinese Room argument.

Matt Welsh (1976-), computer scientist and software engineer, has written an article on January 2023 titled "The End of Programming" @Welsh2022. Welsh believes that the field of Computer Science is headed for an upheaval, that it won't even be remotely recognizable to what it is today, in 10 to 30 years from now.

Programming (humans writing computer programs in a formal language) will be dead by then, according to Welsh; of course, one will still be able to write and run programs for his/her own amusement, but the serious work will be handled by artificial intelligence models.

Our role as human beings in relation to computers might turn into an "educational" one, rather than an "engineering" one as it remains today; we will have to "educate" machines, rather than to program them or even to "train" them with data (in the current Machine Learning sense of the word). Of course, we will be "educating" them strictly in natural language. 

// Natural language is how we started 
// is this how it will end?

// The paradigm shift will be huge: it is not clear whether we are even prepared to deal with it.
// "the fundamental building blocks of computation are temperamental, mysterious, adaptive agents"
// pandora's box

== The Importance of Natural Language

This huge paradigm shift that is awaiting us all may sound like a great prospect. We will finally ditch those abstruse, unnatural, archaic ensembles of symbols, numbers and brackets, that a relatively restricted percentage of the human race uses to move bits in memory, and to light pixels on screens. 

Will the new normal really be so good? We certainly hope that it will, but we also fear that this _great leap forward_ has all the potential to come with its fair share of problems, and not just the ones related to the way people will have to adapt to the new software economy that will emerge. 

As Matt Welsh states, in the article we talked about a while ago: "AI-based computation has long since crossed the Rubicon of being amenable to static analysis and formal proof", this can turn a modern-day AI-system into a huge danger, if due caution is not excercised in its deployment; more so if it is getting its "oders" from untrained people, in the highly ambiguous medium that is unconstrained natural language.




== Outline of the Chapters
== Practical Goals (and Non-Goals)

// What is naturalistic programming?
// Old quote by Dijkstra.
// Why is it relevant today?
// Article by Matt Welsh.
// Prompt Engineering.
// Problems with not having a formalized understading natlang prog.
// State goals and non goals.
// Outline of the chapters.

// == Goals
// To show that is is possible to efficiently approximate some key features of natural language (implicit referencing and syntactic compression) with a formalized subset of it.

// To present the implementation of a formalized subset of the English language, showcasing said naturalistic features.

// To suggest that said formalized language subset may prove useful for some lightweight scripting tasks, particularly as a spoken language.
// == Non Goals
// The goal is not to make a full system, but rather to prototype a language. Modern LLMs provide a way to translate natural language to code, but we want a language rather than a probabilistic translator, we want to axiomatize that part of natural language that is useful for programming.

// // == The End of Programming

// // Computer Scientist Matt Welsh has argued that traditional programming done by humans will become obsolete as a result of the advancement of AI systems that can be told what to do in natural language and come up with solutions for problems they were never explicitly taught how to deal with (zero-shot learning).

// // However, the proliferation of guides on how to best use modern LLMs and the birth of Prompt Engineering suggests that a certain level of experience will be still needed to make effective use of these new "executable English" systems.

// // Natural language thus seems to be the new frontier of programming, and a decent understanding of natural language, its style at describing problems, its advantages over traditional programming languages and its limitations will be crucial over the next decades, as LLMs grow more powerful and useful.


// // // % https://www.promptingguide.ai/
// // // % https://it.wikipedia.org/wiki/Matt_Welsh
// // // % https://cacm.acm.org/magazines/2023/1/267976-the-end-of-programming/fulltext
// // // % https://www.tcg.com/blog/on-the-wisdom-of-natural-language-programming/