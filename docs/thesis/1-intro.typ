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

Though it may sound paradoxical, in light of what we just said, unconstrained natural language may indeed be heading to become the primary means of interaction between us and our computers, in the short to medium term.

But this is not a paradox: the last decade (the 2010s) has seen the comeback and surge in popularity of Big Data and Machine Learning (ML) techniques on the scene of Artificial Intelligence (AI), along with the development of new Deep Learning architectures: such as the Transformer, originally proposed in 2017.

// TODO: transformer cite.

Modern day Large Language Models (LLMs) can say and do things most of us never imagined were possible (in the practical sense) for a computer program before; though everyone knew, of course, of the theoretical possibility for such apparently "intelligent" behavior, as evidenced also by thought-experiments such as John Searle's famous Chinese Room argument.

// TODO: Searle cite

Matt Welsh (1976-), computer scientist and software engineer, has written an article on January 2023 titled "The End of Programming" @Welsh2022. Welsh believes that the field of Computer Science is headed for an upheaval, that it won't even be remotely recognizable to what it is today, in 10 to 30 years from now.

Programming (intended as humans explicitly writing computer programs, in a formal language) will be dead by then, according to Welsh; of course, one will still be able to write and run programs in some formal language for his/her own amusement, but the serious work will be handled by Artificial Intelligence models.

Our role as human beings in relation to computers might turn into an "educational" one, rather than an "engineering" one as it remains today; we will have to "educate" machines, rather than to program them or even to "train" them with data (in the current Machine Learning sense of the word). Of course, we will be "educating" them, just like we educate children, speaking to them in natural language.

// Natural language is how we started 
// is this how it will end?

// The paradigm shift will be huge: it is not clear whether we are even prepared to deal with it.
// "the fundamental building blocks of computation are temperamental, mysterious, adaptive agents"
// pandora's box

== The Importance of Natural Language

This huge paradigm shift, that is awaiting us all, may sound like a great prospect. We will finally ditch those abstruse, unnatural, archaic ensembles of symbols, numbers and brackets, that a relatively restricted percentage of the human race still uses to move bits around in memory, and to light pixels on displays. More people will finally have a (more intuitive) access to their machine's capabilities.

Will the new normal really be so good? We certainly hope that it will, but we also fear that this _great leap forward_ has all the potential to come with its fair share of troubles, and not just the ones related to the economic effect of this paradigm shift on all people (not just the ones in software engineering), or the legal issues regarding the copyright of the data consumed or produced by AI-models.

// economy and law cite

As Matt Welsh states, in the article we talked about a while ago: "AI-based computation has long since crossed the Rubicon of being amenable to static analysis and formal proof", this can turn a big modern-day AI-system (from a big corporation, for example) into a dangerously powerful black-box, if due caution is not excercised in its deployment; more so if it is getting its "orders" from untrained personnel, in the highly ambiguous medium that is unconstrained natural language.

To make matters worse, a thinker of the calibre of Noam Chomsky (1928-) has expressed, in a recent interview from May 2023 @chomskygpt, his skepticism in controlling the threats posed by a potentially super-human artificial intelligence going haywire; suspecting that: "the genie is out of the bottle"; but nonetheless stating that: "such suspicions are of course no reason not to try, and to exercise vigilance".

But the interview we just cited isn't mainly about the threat of super-human Artificial General Intelligence (AGI) wreaking havoc in the world, as serious as it may be (and it is). The interview was mainly about the inadequacy of current Deep Learning models, such as the popular GPT (Generative Pre-trained Transformer), at actually modelling human linguistic thought.

Chomsky argues that while systems like GPT are very good at capturing statistical patterns in natural language, they also work just as well with any "impossible languages", ie: with artificial grammars that infants don't learn spontaneously; making them an unreliable model of (at least) human language acquisition.

Moreover, he discusses how the shift from a more "science-oriented" (ie: geared towards understanding a phenomenon) to a more "engineering-oriented" (ie: just building a useful tool) kind of AI leads to the risk of disillusionment for actual scientific discoveries in the general public. 

Chomsky says that a person arguing that studying the extraordinary navigational capacities of ants is "useless" (because we modern humans have very precise maps and GPS satellites, etc...) would be laughed at. But a person making the same statement about the formal study of language (because we have huge statistical models churning on terabytes of data that produce near human-level quality prose) is more likely to be listened to nowadays.

To conclude, we believe this is a critical juncture of human history, for a number of reasons, and the rapid proliferation of AI systems trained on huge amounts of data is certainly an important one among them; to paraphrase an idea that quantum physicist and computer programmer Michael Nielsen (1974-) expressed in his book "Neural networks and deep learning" @nielsen2015neural: we know that AI started out as an effort to understand reasoning and intelligence (maybe even shed light on human intelligence), but it may end very soon, with us having understood neither how human intelligence, nor even how artificial intelligence itself works.

== Outline of the Chapters

The first chapter will be an overview of the four most popular and widely known programming paradigms of all times (procedural, functional, object-oriented and logic), presented in the guise of a brief historical summary of the evolution of programming languages in general. We think that a solid understanding of what past and modern programming languages are capable of, and at what price (both in the positive and in the negative sense), is of fundamental importance in evaluating a new paradigm, or designing a new language.

The second chapter will bring the focus on naturalistic programming specifically, and it will try answering some of the following questions: what existing programming languages are naturalistic? Is "naturalistic programming" just about using a more "English-like" (natural) syntax? Can any deeper underlying common principles be discerned in these languages? Do we think naturalistic programming is a "real" (fully-developed) paradigm yet? All of the projects we will discuss, approach the subject of natural language from a classical (non ML) standpoint, they are in this sense "normal" programming languages, with some very special features. We will also bring up the tangentially related topic of Prompt Engineering for the optimization of LLM responses, which we see as an emergent competing approach (implementation-wise) to what may truly one day be called "programming in natural language".

The third chapter will jump straight into the intriguing (yet difficult) topic of Common Sense in AI, it will try relating some of the principles of naturalistic programming, to some of those in classical (or "Symbolic", or "Good Old Fashioned") AI.

The last 2 chapters will be dedicated to describing our work in trying to implement some of the naturalistic ideas into a new prototype of a language we are designing ("Deixiscript").

// == Practical Goals (and Non-Goals)

// What is naturalistic programming?
// Why is it relevant today?.
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