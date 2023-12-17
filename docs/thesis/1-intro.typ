= Introduction

== What is naturalistic programming?

Naturalistic programming is broadly defined as the attempt to write (computer executable) code in a varyingly complex _subset_ of a natural language: the kind of language we are all naturally familiar with and brought up speaking from a very early age.

We say "a _subset_ of natural language" because full, unconstrained, natural language is (at least we think) still far too complex and dynamic to be used as a feasible programming language, without any constraints or limitations put in place whatsoever; and no one so far has agreed entirely on what that _subset_ should look like, let alone what it should (or should not) allow us to say.

It was (and maybe still is) customary to dismiss all these attempts with the justification that natural language is too "imprecise", too "vague" or too "ambiguous" for telling computers what to do, and that this job better suits formal languages anyway.

Edsger Dijkstra (1930-2002), the late, great computer scientist and early advocate of structured programming, famously wrote a piece in 1978 titled: "On the foolishness of "natural language programming" @foolishnessnatprogramming. In it he discusses what he (rightly) sees as the defects of natural language (ambiguity, verbosity, etc.) compared to formal languages when describing mathematical concepts and computer algorithms. 

He goes as far as to argue that even if "natural language programming" were ever achieved, it would not be a step in the direction of scientific progress, but rather a step back into the "dark" ages of mathematical notation: the rhetorical stage, back when equations were expressed in long, convoluted, confusing words, rather than in elegant and concise symbols.

And yet, we still speak natural language everyday: we listen to the news, we read books, we speak to our dearest friends and relatives, we trust natural language with the preservation of our legal rights and statutes, with the preservation of our very democracy! How can such a vague, ambiguous, imprecise linguistical system (or systems) not be trusted at making sure our computers do not crash, yet be fully trusted in making sure the rest of our human society does not come crumbling down like a castle of cards? There is clearly more to say about natural language.

== Programming is dead

Though it may sound paradoxical, in light of what we just said, natural language may indeed be headed to become the primary means of interaction between us and our computers, in the short to medium term.

But this is not a paradox: the last decade (the 2010s) has seen the flourishing and surge in popularity of Machine Learning (ML) techniques on the scene of Artificial Intelligence (AI) @brachman2022machines, along with the development of new Deep Learning architectures such as the Transformer @whatGptDoesWolfram.

Modern day Large Language Models (LLMs) can say and do things most of us never imagined were possible (in the practical sense) for a computer program before; though everyone knew, of course, of the theoretical possibility for such apparently highly "intelligent" behavior, as evidenced also by thought-experiments such as John Searle's (1932-) famous Chinese Room argument, which we talk about in "Common Sense" @commonsense.

Matt Welsh (1976-), computer scientist and software engineer, has written an article in January 2023 titled "The End of Programming" @Welsh2022. Welsh believes that the entire field of Computer Science is headed for an upheaval, that it will not be even _remotely recognizable_ to what it is today, 10 to 30 years from now.

Programming (intended as humans explicitly writing computer programs, in a formal language) will be dead by then, according to Welsh; of course, one will still be able to write programs in some formal language for his/her own amusement, but the serious work will be done by Artificial Intelligence models.

Our role as human beings in relation to computers might turn into an "educational" one (rather than an "engineering" one, as it is today); we will have to "educate" machines, rather than to program them or even to "train" them with data (in the current Machine Learning sense of the word "train"). Of course, we will be "educating" these "temperamental, mysterious, adaptive agents" (as Welsh says), just like we educate our children, speaking to them in natural language.

== Long live Natural Language

This huge paradigm shift, that is awaiting us all, may sound like a great prospect. We will finally ditch those abstruse, unnatural, archaic ensembles of symbols, numbers and brackets, that a relatively restricted percentage of the human race still uses daily to move bits around in memory, and to light pixels on displays. More people will finally have a (more intuitive) access to their machine's capabilities.

Will the new normal really be so good? We certainly hope that it will, but we also fear that this _great leap forward_ has all the potential to come with its fair share of troubles, and not just the ones related to the economic @jobLossGpt effect of this paradigm shift on all people (not just the ones in software engineering), or the legal issues @legalRisksGpt regarding the copyright of the data consumed or produced by AI-models.

As Matt Welsh reminds us in his article "AI-based computation has long since crossed the Rubicon of being amenable to static analysis and formal proof". This can turn a big modern-day AI-system (from a big corporation, for example) into a dangerously powerful black-box, unless due caution is exercised in its deployment; and more danger may even come if it gets "orders" from untrained personnel, in the highly ambiguous medium that is unconstrained natural language.

To make matters worse, a big thinker like Noam Chomsky (1928-) has expressed, in a recent interview in May 2023 @chomskygpt, his skepticism in our ability to control the threats posed by a potentially super-human artificial intelligence going haywire, suspecting that "the genie is out of the bottle" but nonetheless stating that "such suspicions are of course no reason not to try, and to exercise vigilance".

But the interview we just cited was not mainly about the threat of super-human Artificial General Intelligence (AGI) wreaking havoc in the world, as serious as it may be (and it is). The interview was mainly about the inadequacy of current Deep Learning models, such as the popular GPT (Generative Pre-trained Transformer), at actually modelling human linguistic thought.

Chomsky argues that while systems like GPT are very good at capturing statistical patterns in natural language, they also work just as well with any "impossible language", i.e., with artificial grammars that infants do not learn spontaneously; making them an unreliable model of (at least) human language acquisition.

Moreover, we can add, such models need huge amounts of data to achieve a level of linguistic competence that is even comparable to that of a human being; a great human author does not need to read a _million_ books before writing his/her _magnum opus_, maybe a couple thousands or less.

Chomsky expresses his concern for the shift from a more "science-oriented" AI (i.e., geared towards understanding the phenomenon) to a more "engineering-oriented" one (i.e., just aiming to build a useful tool); this may lead to the risk of disillusionment for important scientific discoveries in the general public.

Chomsky says that a person arguing that studying the extraordinary navigational capacities of ants is "useless" (because we modern humans have maps, GPS satellites, digital compasses, etc.) would be laughed at. But a person making a similar argument about the formal study of language (because we already have huge statistical models churning on terabytes of input data to produce near human-level quality prose) is much more likely to be taken seriously, nowadays.

To conclude, we believe this is a critical juncture of human history, for a number of reasons, and the rapid proliferation of AI systems trained on huge amounts of data is certainly an important one among them; to paraphrase an idea that quantum physicist and computer programmer Michael Nielsen (1974-) expressed in his book "Neural networks and deep learning" @nielsen2015neural: AI started out as an effort to understand reasoning and intelligence (maybe even shed some light on human intelligence), but it may end very soon, with us humans having understood neither how human intelligence works, nor even how the artificial intelligences we built work.

== Outline of the Chapters

The second chapter is an overview of the four most popular and widely known programming paradigms of all times (procedural, functional, object-oriented and logic), presented in the guise of a brief historical summary of the evolution of programming languages in general. We think that a solid understanding of what past and modern programming languages are capable of, and at what price (both in the positive and in the negative sense), is of fundamental importance in evaluating a new paradigm, or designing a new language.

The third chapter will bring the focus on naturalistic programming specifically, and will try answering some of the following questions: which existing programming languages are naturalistic? Is "naturalistic programming" just about using a more "English-like" (natural) syntax? Can any deeper underlying common principles be discerned in these languages? Do we think naturalistic programming is a "real" (fully-developed) paradigm yet? All of the projects we will discuss, approach the subject of natural language from a classical (non ML) standpoint, they are in this sense "ordinary" programming languages, with some very out-of-the-ordinary features. We will also bring up the tangentially related topic of Prompt Engineering for the optimization of LLM responses, which we see as an emergent competing approach (implementation-wise) to building what may truly one day be called "programming in natural language".

The fourth chapter will jump straight into the intriguing (yet difficult) topic of Common Sense in AI, and will try relating some of the principles of naturalistic programming to some of those in classical (or "Symbolic", or "Good Old Fashioned") AI.

The last two chapters will be dedicated to describing our work in trying to implement some of the naturalistic ideas into a new prototype language we are designing ("Deixiscript").