// what is "common sense in AI"
// - Advice Taker
// the ability to make effective use of ordinary, everyday, experiential knowledge in achieving ordinary, everyday, practical goals
// flexible, not "idiot savant"
// more specialized kind of rationality
// commonsense reasoning enables an AI system to act appropriately in the face of unforeseen events
// common sense knowledge is valuable in understanding natural language
// capable of resolving pronouns like the word “it” in the aforementioned sentence, “The large ball crashed through the table because it was made of steel”
// Winograd
// https://d-kz.medium.com/evaluating-gpt-3-and-gpt-4-on-the-winograd-schema-challenge-reasoning-test-e4de030d190d
// - Chosmky on Creativity: novelty, appropriateness to context, unpredictability in terms of environmental circumstances, and value, mention hierarchy of problems by constraints
// knowledge AND reasoning
// KR representation hypothesis
// theory of everything, naive physics, naive phsychology
// knowledge graphs 
// Brachman on semantic networks and Levesque on automated planning
// criticism and baesyian networks and relationship to neural networks
// https://en.wikipedia.org/wiki/Bayesian_network
// https://en.wikipedia.org/wiki/Bayes%27_theorem
// https://jonascleveland.com/bayesian-network-vs-neural-network/
// Machines Like Us proposed implementation system
// - Metafor (presented in detail in naturalistic programming)
// https://en.wikipedia.org/wiki/Commonsense_reasoning
// mccarthy: philosophical porblems from the standpoint of AI
// intelligent machines as fact manipulators (consistent with KR hypothesis)
// https://cse.buffalo.edu/~rapaport/563S05/KR.hypoth.html
// adequate world model (also own goals), answer questions, get extra info, perform actions due to goals
// two parts of intelligence: empistemological (represent world) vs heuristic (solve problem)
// basic philosophical presuppositions (world exists, info obtainable through senses...)
// define even a naive, common-sense view of the world precisely enough to program a computer to act accordingly
// Nth-order logic as a favored representation
// situations (world state), fluents (predicate which depends on time), causality
// the frame problem
// John McCarthy and Patrick J. Hayes defined this problem in their 1969 article, Some Philosophical Problems from the Standpoint of Artificial Intelligence. 
// rational default assumptions and what humans consider common sense in a virtual environment
// https://plato.stanford.edu/entries/frame-problem/
// . The epistemological problem is this: How is it possible for holistic, open-ended, context-sensitive relevance to be captured by a set of propositional, language-like representations of the sort used in classical AI? The computational counterpart to the epistemological problem is this. How could an inference process tractably be confined to just what is relevant, given that relevance is holistic, open-ended, and context-sensitive?
// https://en.wikipedia.org/wiki/Situation_calculus#The_successor_state_axioms


= Artificial Intelligence

Artificial Intelligence is an extremely broad area of study that has undergone various "summers" and "winters" @ilkou2020symbolic, has spanned over decades of research from its first inception in the last century, and has preoccupied some of the most brilliant minds in history.

It is an endeavor which involves knowledge of the most disparate of disciplines: logic, mathematics, computer science and philosophy, to cite a few examples. Unfortunately, it is impossible to cover all of its history in the present work, we will therefore spend the next few pages painting it in very broad strokes; we will focus mostly on the more traditional Symbolic or "Good Old Fashioned AI" (GOFAI) approach, which will be most relevant to the present work.

== History of Term

The term "Artificial Intelligence" (AI) proper was first coined in 1956 by John McCarthy (1927-2011), eminent computer scientist who is also known for having invented Lisp in 1958 @lisproots, a language which today has evolved into a family of programming languages and counts many dialects; but the subject of "thinking machines" is older and can trace its origins years before that @smith2006history.

== The Turing Test

Back in 1950 @turing2009computing, Alan Turing (1912-1954), mathematician, computer scientist, logician and cryptanalist set out on a very ambitious journey, which has influenced the practice of AI ever since, and that was the task of determining whether sentient behaviour was "provably computable" @smith2006history.

// % Goedel

In doing so, Turing introduced the concept of the Turing Test: a metric to tell if a computer could "think", according to the definition given by its author. The test involves a "suspicious human judge" who has to converse with two subjects: another human and a machine, both hidden behind a curtain. The judge's goal is to tell them apart, from their usage of language alone. In what can be aptly described as an "imitation game", the goal of the machine is to deceive the human judge regarding its being a machine @smith2006history.

It was recently reported (2022-23) that some Large Language Models (LLMs) such as Google's LaMDA @turingtestobsolete and OpenAI's GPT @gptbroketuring have succeded in passing the Turing Test, an ambitious feat which had remained largely unaccomplished for decades prior to that @smith2006history. If this is all accurate, it means that we are now living in the post-Turing Test era.

=== The Chinese Room Argument

Obviously, the merits, implications and interpretations of the results offered by a successfully passed instance of a Turing Test are controversial topics to say the least in the philosophy of mind. Years before the advent of LLMs, in 1980, philosopher John Searle (1932-) first made public his famous Chinese Room Argument @searle1999chinese.

In the mental experiment, Searle urges us (non-Chinese speakers) to imagine ourselves being locked up in a room filled with books on how to manipulate Chinese symbols algorithmically. One will find that he/she is able to communicate with the outside world only through a narrow interface of textual messages written on slips of paper and passed through the door.

After learning how to manipulate those symbols and getting reasonably good at it, one will achieve the ability to deceive an external observer sitting outside of the room regarding one's own knowledge of Chinese. But, obviously, knowledge of how to manipulate its syntactic symbols by rote doesn't correspond with true semantic understanding of a language.

Numerous objections and counter-objections to the argument have been rised since then @chineseroomstan, and there is still no general consensus on the conclusions and validity of the argument @chineseroomstan. It is nonetheless a powerful and intuitive case for the idea that what computers are doing when they "think" is fundamentally different from what humans do (or at least, what the writer of this paragraph in his subjective experience does).

=== Alternatives to the Turing Test

An important point to make is that the Turing Test may represent a sufficient condition for "intelligence" (depending on how the term is defined and always keeping in mind arguments such as Searle's Chinese Room), but passing it certainly isn't a necessary condition for intelligence, very young children offer the perfect example of intelligent beings which may still not be verbally able to express themselves adequately enough to pass the test @smith2006history.

There are a number of variations and alternatives to the Turing Test, such as the Feigenbaum Test (or subject matter expert Turing test), which eliminates the "casual" nature of the open-ended conversational Turing Test from the picture, by stipulating that a computer demonstrate proficency in a specialized area of interest @smith2006history, this, by surpassing an expert in that specific field.

Another alternative is Nicholas Negroponte's variation, where an AI should help a human accomplish goals in the same way a human would @smith2006history.

== Symbolic vs Sub-symbolic AI

An important methodological distinction in the discipline of AI is represented by the Symbolic vs Sub-Symbolic divide.

The rationale behind this terminology stems from "old" AI's reliance on explicit human-readable symbols and notation to represent information.

Symbolic AI or Good Old Fashioned AI (GOFAI) represents the older and more traditional approach to the subject, it is typically associated to First Order Logic (FOL), to Knowledge Bases (KBs) and to Expert Systems, and has seen a period of flourishing during the birth of AI and in the 1980s in the hayday of Expert Systems.

Sub-symbolic AI, while tracing its origins back to such early works as Frank Rosenblatt's "perceptron", has been slower at achieving vast adoption, and is now enjoying a renewed period of popularity, with the advent and perfection of such techniques as Machine Learning (ML) and Deep Learning that harness the power of gargantuan Neural Networks.

The advantages of the symbolic approach have traditionally been: the ease of implementing explainable reasoning, with intermediate steps; rule modularity, or the discreteness and independence of rules from each other; and the applicability to abstract problems such as theorem proving.

The disadvantages of the symbolic approach are: the adversity to noisy datasets; and the fact that rules are (usually) hand-crafted and hard-coded into the system, which also makes them hard to maintain.

The advantages of the sub-symbolic approach are: an increased robustness to noisy and/or missing data; the ease of scaling up and handling large amounts of data; the better suitability for perceptual problems (such as face recognition) where it can be pretty hard to describe rules in any formal or natural language for lack of relevant explicit knowledge; less human intervention, because the machine can learn autonomously from the data; and good execution speeds (once the model is trained). Sub-symbolic approaches are typically used for tasks such as: data clustering, pattern classification, and recognition of speech and text

The disadvantages of the sub-symbolic approach include: a lack of interpretability (often resulting in a black-box system); a relatively high dependence on training data; and the fact that such models typically require large amounts of computational resources and large amounts of data to train initially.

=== Points in common

A core idea that we think the two approaches share is that they can be both regarded as declarative programming paradigms of sorts. As we've discussed in the section dedicated to programming languages, a computer can be told how to do something (imperative), or it can be (just) told to do that thing (declarative). A case of declarative programming taken to the extreme is when the computer is merely given a description of the problem, and told to devise a solution of its own. In this sense, both kinds of AIs are declarative: the idea is to avoid explicitly coding a behavior that may be beyond our practical reach with more traditional programming abstractions.

Some researchers believe that one of the main bottlenecks of Symbolic methods has always been the reliance on manually compiled and maintained rule-sets. The manual creation and maintenance of inference rules is a limiting factor that some research projects are trying to eliminate, also through the use of hybrid Symbolic/Sub-symbolic approaches for learning rules automatically from quasi-natural language @ilkou2020symbolic, @yang2021learning.

== Symbolic AI: a closer look

// <!-- sth myrs -->

We will now take a closer look at some of the theory behind the more "classical" kind of AI. An interesting place to start from is the enunciation of the Knowledge Representation (KR) hypothesis by philosopher Brian Cantwell Smith, which states that:

"Any mechanically embodied intelligent process will be comprised of
structural ingredients that a) we as external observers naturally take to
represent a propositional account of the knowledge that the overall
process exhibits, and b) independent of such external semantic attribution, play a formal but causal and essential role in engendering
the behavior that manifests that knowledge" @brachman2022machines.

In other words, the system contains physical parts that we take to be symbols representing propositions, and the behavior of the system depends on the state of those physical parts: there is a close mapping between the logical propositions we deal in, and the state of the physical parts it deals in.


// <!-- devised the Turing Machine, and later worked on cyphers during WW2 breaking the Enigma code -->

// expectations outpacing reality

// Type-A (brute force) vs Type-B (heuristics-based) chess programs, deep blue Type-A, in 1997 Deep Blue challenged and defeated the then world chess champion Gary Kasparov

// branching factor: Valid moves a player can make at any point in time, higher in Go than in chess

// AlphaGo (deep learning based) program from DeepMind shocked the world in 2016 by defeating one of the world's premier Go players, Lee Sedol. AlphaGo then went on to defeat the world's top player, Ke Jie, in 2017. @brachman2022machines

// expert systems

// first emerged in the early 1950s 

// - KB with facts and rules
// - inference engine 
// - I/O interface

// symbolic logic rather than numerical computations, data-driven, explicit (and declarative) knowledge, human interpretable conclusions


// @brachman2022machines


// The Cyc Project

// @brachman2022machines

// enCYClopedia

// expert systems are brittle, need to be reinforced with typically unstated commonsense facts "declarative tacit knowledge"  

// The Cyc knowledge base is currently claimed to contain “more than 10,000 predicates, millions of collections and concepts, and more than 25 million assertions”—an amazing accomplishment @brachman2022machines

// heuristic adequacy—related to “how to search spaces of possibilities and
// how to match patterns.”

//  According to Lenat,
// “By 1989, we had identified and implemented about 20 such special-case
// reasoners, each with its own data structures and algorithms. Today [2019]
// there are over 1100 of these ‘heuristic level reasoning modules.’

// Symbolic (GOFAI) vs Sybsymbolic divide

// (1) symbolic approaches produce logical
// conclusions, whereas sub-symbolic approaches provide
// associative results. (2) The human intervention is com-
// mon in the symbolic methods, while the sub-symbolic
// learn and adapt to the given data. (3) The symbolic meth-
// ods perform best when dealing with relatively small and
// precise data, while the sub-symbolic ones are able to
// handle large and noisy datasets.

// // % come up w/

// #bibliography("bib.bib")