= Common Sense

It is puzzling how easy it is to program a machine to perform an extremely difficult task from the human point of view (such as beating the world champion in chess), and yet apparently so hard to get the same machine to do something that every sane person does on a daily basis without even thinking too hard: using common sense.

== The Core Issue

The book "Machines like Us: Toward AI with Common Sense" from 2022 presents us with an invaluable overview of this problem, its historical background and its practical and ethical ramifications; it was authored by Ronald J. Brachman and Hector J. Levesque, two eminent researchers in the field of Artificial Intelligence (AI); who are known for their contributions in the fields of semantic networks and logic-based reasoning about beliefs and plans, respectively.

"Common sense" in the context of AI doesn't mean anything much different from what it means for most of us in our daily life: it is the ordinary ability to posses and make use of non-expert knowledge to achieve ordinary, practical goals. Common sense is a specialized yet flexible kind of rationality; it doesn't demand formal study or take above-average intelligence for a person to reason through experiential facts; formulate predictions on the behavior of simple physical systems, or the behavior of other people based on their feelings and goals; and to use this to handle the occurrence of a new or unusual situation smoothly.

The problem of endowing machines with Common Sense is arguably at the core of designing a truly general AI system, not just a very efficient yet specialized problem solver, but rather a system that can stand its ground even in an unprecedented scenario; and unpredictable scenarios as Brachman and Levesque remind us in their book happen much more often than we might think: there are so many unknowns in the real world that the likelihood of a random bizarre event happening is much higher than the likelihood of any specific kind of bizarre event taken singularily.

== Common Sense and Natural Language

Of specific interest to us is the fact that cracking the problem of Common Sense is also an important step in achieving a complete understanding of natural language. Natural language, as we know, is highly context dependent; even in short sentences such as one of the examples made in the book by Brachman and Levesque: "The large ball crashed through the table because _it_ was made of steel", to resolve the referent of the pronoun "it", it is necessary to have some generic knowledge of the world: namely that tables are usually made out of wood, and that steel is a harder, stronger material than wood. Were the last part of the sentence to change to: "... it was made of wood", then the natural interpretation of the pronoun "it" would also change; in that case, "it" would point to the table, no more to the ball.

== The issue of Creativity

Since the issue of natural language was brought up, we thought to suggest a parallel between the problem of Common Sense in AI, and the somewhat related issue of "Creativity" in linguisitc expression and other areas of human endeavor. Philosopher Fred D'Agostino (1946-) discusses Chomsky's views on human creativity in his paper from 1984 "Chomsky on Creativity". 

Chomsky draws inspiration from his pioneering work in linguistics to arrive at a more general notion of human creativity. The speaker of any language regularily builds or grasps the meaning of a sentence he may be looking at for the first time in his or her life; this is an example of what Chomsky calls linguistic productivity.

A person may produce an indefinite amount of sentences that are new to his or her experience, but they are not random; they are just the right thing to say, and yet they are also independent of "detectable stimulus configurations".

Since the data available to a child learning his or her first language is most often incomplete and poor in quality, Chomsky's thesis has always been that human children have an innate ability to learn the class of languages we call "human languages", this implies a congenital, biological limit on the kind of grammars that are possible for these languages.

From this follows the idea that human creativity too, in the more general sense, may be limited by a "system of constraints and governing principles"; this idea is known as the "Limits Thesis", and its compatibility with the "established beliefs" about creativity is the object of contention of the paper by D'Agostino; beliefs that emphasize the rulelessness and unpredictability (rather than boundedness) of creative work.

D'Agostino's solution is to try understanding creativity in terms of problem solving; problems are characterized by their constraints, different sets of contraints determine different problems. Problems can be ranked in a hierarchy, based on the kinds of constraints they place on the agent trying to solve them; this hierarchy includes problems with 5 kinds of constraints: determinative, limitative, eliminative, tentative and trivial. The respective problems grow in "difficulty", or better: in "undefinedness".

"Determinative" constraints are the strictest: they characterize the class of problems for which it is easy to define an algorithm, for which a procedural solution exists, such as arithmetic problems. "Limitative" constraints characterize those problems that are "well-defined", they provide necessary and sufficient conditions for the solution, examples of such problems are related to theorem discovery: there are necessary and sufficient conditions for some argument to count as a valid theorem for something; yet there is no single mechanized way of discovering such proofs. "Eliminative" constraints only provide necessary (but no sufficient) conditions for the solutions that satisfy them, these problems are termed as "partially-defined", many "design-related" problems (eg: in architecture, engineering...) fall into this category.

If a problem is given where some (but not all) of the constraints may be violated, then the constraints are "tentative", and the problem is "radical"; solved examples of such problems may occur in the history of science, where to accomodate for certain new facts, a theory may have had to be proposed which rejected certain standards of methodological practice. Lastly, if the constraints are even more vague than that, if they don't even tentatively try to provide necessary conditions for their solution, then they are "trivial" and the problems they describe are termed "improvisational"; examples of such problems are common in the domain of aesthetics (such as the arts).

We are tempted to say that Common Sense encompasses all of the aforementioned modes of reasoning, minus the "expert twist" to most of the concrete examples of problems provided by D'Agostino in his clear exposition of the problem-hierarchy. 

For instance: a well-defined problem may take on a much more mundane shape than the discovery of new mathematical theorems; it may be a "problem" such as the one we already mentioned when discussing McCarthy's Advice Taker: the "problem" of getting to the airport given that one's location is A, the airport's location is B, and the means of transport from A to B is available in the form of a car one can drive.

Likewise, we think it is easy to find examples of "partially-defined" problems that can be solved by the application of common sense knowledge and reasoning; and if one identifies the concept of a "constraint" from the above analysis with the concept of a "goal" (a desirable state of the world) in logic-based planning, then "radical" problems that are solvable by common sense could be cases in which some goals are less important than others and can be sacrificed (there is a goal-hierarchy); such an example is brought up in chapter 9 of the book "Machines like Us", which discusses how a self-driving car equipped with common sense may decide to modify an original plan of action (like driving to a specific grocery store) because of an unexpected obstacle on the road, and decide instead to go to another grocery store (to get the same or a similar kind of groceries it was ordered to get).

== History of AI

The goal of formalizing Common Sense has also arguably not been the only focus of AI during the past 70 or so years of its existence; in what follows we shall (very) briefly discuss some of the broad ideas in AI, to then get back to the more specific problem in question.

Artificial Intelligence is an extremely broad area of study that has undergone various "summers" and "winters" @ilkou2020symbolic; spanning over decades of research from its first inception in the last century, and preoccuping some of the most brilliant minds in logic, mathematics, philosophy and computer science.

Unfortunately, it is impossible to cover all of its history in the present work, we will therefore spend the next few pages painting it in very broad strokes; we will focus mostly on the more traditional Symbolic or "Good Old Fashioned AI" (GOFAI) approach, which will be most relevant to the present work.

As we already mentioned in the section dedicated to the Lisp programming language(s), the term "Artificial Intelligence" (AI) proper was first coined in 1956 by John McCarthy; but the study of so called "thinking machines" is a little older than that @smith2006history.

== The Turing Test

Back in 1950 @turing2009computing, British mathematician, logician and cryptanalist Alan Turing (1912-1954), set out on the ambitious journey of determining whether sentient behaviour was "provably computable" @smith2006history.

Turing introduced what came to be known as the Turing Test: a metric to tell if a computer could "think", according to the definition given by Turing. The test involves a "suspicious human judge" who has to converse with two subjects: another human and a machine, both hidden behind a "curtain". The judge's goal is to tell them apart, from their usage of language alone. The goal of the machine, in this "imitation game", is to deceive the human judge into thinking he's conversing with another human being @smith2006history.

It was recently reported (2022-23) that some Large Language Models (LLMs), based on Deep Learning techniques, such as Google's LaMDA @turingtestobsolete and OpenAI's GPT @gptbroketuring have succeded in passing the Turing Test, an ambitious feat which had remained largely unaccomplished for decades prior to that @smith2006history. If this is all accurate, it means that we are now living in the post-Turing Test era. 

// https://d-kz.medium.com/evaluating-gpt-3-and-gpt-4-on-the-winograd-schema-challenge-reasoning-test-e4de030d190d

== Alternatives to the Turing Test

An important point to make is that the Turing Test may represent a sufficient condition for "intelligence" (depending on how the term is defined), but passing it certainly isn't a necessary condition for intelligence, very young children offer the perfect example of intelligent beings which may still not be verbally able to express themselves adequately enough to pass the test @smith2006history.

There are a number of variations and alternatives to the Turing Test; one is the Feigenbaum Test (or subject matter expert Turing test), which eliminates the "casual" nature of the open-ended conversational Turing Test, by stipulating that a computer demonstrate proficency in a specialized area of interest @smith2006history, this, by surpassing an expert in that specific field.

Another alternative is Nicholas Negroponte's variation, where an AI should help a human accomplish goals in the same way a human would @smith2006history.

Yet another alternative is the Winograd schema challenge (WSC) introduced by Levesque in 2012, and named after computer scientist Terry Allen Winograd (1946-). This test involves specific questions, similar to the "large ball crashing through the table" example we discussed earlier, that are aimed at probing a system's competence at resolving implicit references that require common sense knowledge and reasoning.

== The Chinese Room Argument

Obviously, the merits, implications and interpretations of the results offered by a successfully passed instance of a Turing Test are controversial topics to say the least in the philosophy of mind. Years before the advent of LLMs, in 1980, philosopher John Searle (1932-) first made public his famous Chinese Room Argument @searle1999chinese.

In the mental experiment, Searle urges us (non-Chinese speakers) to imagine ourselves being locked up in a room filled with books on how to manipulate Chinese symbols algorithmically. One will find that he/she is able to communicate with the outside world only through a narrow interface of textual messages written on slips of paper and passed through the door.

After learning how to manipulate those symbols and getting reasonably good at it, one will achieve the ability to deceive an external observer sitting outside of the room regarding one's own knowledge of Chinese. But, obviously, knowledge of how to manipulate its syntactic symbols by rote doesn't correspond with true semantic understanding of a language.

Numerous objections and counter-objections to the argument have been rised since then @chineseroomstan, and there is still no general consensus on the conclusions and validity of the argument @chineseroomstan. It is nonetheless a powerful and intuitive case for the idea that what computers are doing when they "think" is fundamentally different from what humans do (or at least, what the writer of this paragraph in his subjective experience does).

== Symbolic vs Sub-symbolic AI

An important methodological distinction in the discipline of AI is represented by the traditional one made between "Symbolic" or "Good Old Fashioned AI" (GOFAI), versus "Sub-Symbolic" AI. The rationale behind this nomenclature stems from "old" AI's reliance on explicit human-readable symbols and formal logic notation, rather than the more numerical and statistical methods of "new" AI.

Symbolic AI, as we said, represents the older and more traditional approach; it is typically associated to First Order Logic (FOL), to Knowledge Bases (KBs) and to Expert Systems, and has seen a period of flourishing during the birth of AI and in the 1980s during the hayday of Expert Systems.

Sub-symbolic AI, while tracing its origins back to such early works as Frank Rosenblatt's "perceptron", has been slower at achieving vast adoption; it is now enjoying a new period of popularity, with the advent and perfection of such techniques that harness the power of neural networks such as Machine Learning (ML), and "Deep" Learning (which "just" means using neural nets with a larger number of layers).

// http://neuralnetworksanddeeplearning.com/about.html

=== Neural Networks

The neural network is a kind of architecture for a computer program that draws inspiration for its name from the functioning of neurons (nerve cells) and synapses in the brains of biological organisms. 

A neural network is a collection of neurons organized in layers; each neuron from a layer produces an output which is channelled as an input to all of the neurons of the subsequent layer. Each connection going into a neuron has an associated weight (or importance); a weight is modelled as a factor (number) which multiplies the given input at the corresponding connection. 

A neuron applies the corresponding weight to each of its inputs, then sums up the results, adds a bias to the sum, then applies a function known as the "activation function" to the result; the activation function has to be non-linear, so as to introduce non-linearity to the network and allow it to approximate non linear relations; the reason it is termed "activating" is that this function determines when the neuron will be "firing"; a common choice for it is the sigmoid function, which approximates the step function.

// https://stackoverflow.com/questions/9782071/why-must-a-nonlinear-activation-function-be-used-in-a-backpropagation-neural-net

Stepping back to see the big picture, when an input enters the first layer of the network each of the neurons produces an output, which is fed into the next layer, which in turn produces outputs which go into the next layer, etc... Until the output layer is reached. The input layer may consist of, for example, the values of the pixels of a greyscale image containing handwritten digits that has to be classified; and the 10 outputs, for instance, may represent the probability that the image represents either one of the 10 digits (from 0 to 9).

Training a neural network consists in finding the "optimal" weights and biases which minimize the prediction error of the network for a particular training set, the error computed as a "cost function". This usually involves approximating the derivative of the cost function through the use of numerical and stochastic methods, because the exact solution would be too computationally demanding to evaluate.

=== Sub-Symbolic: pros and cons

The advantages of the sub-symbolic approach are: an increased robustness to noisy and/or missing data; the ease of scaling up and handling large amounts of data; the better suitability for perceptual problems (such as face recognition) where it can be pretty hard to describe rules in any formal or natural language for lack of relevant explicit knowledge; less human intervention, because the machine can learn autonomously from the data; and good execution speeds (once the model is trained). Sub-symbolic approaches are typically used for tasks such as: data clustering, pattern classification, and recognition of speech and text

The disadvantages of the sub-symbolic approach include: a lack of interpretability (often resulting in a black-box system); a relatively high dependence on training data; and the fact that such models typically require large amounts of computational resources and large amounts of data to train initially.

=== Symbolic: pros and cons

The advantages of the symbolic approach have traditionally been: the ease of implementing explainable reasoning, with intermediate steps; rule modularity, or the discreteness and independence of rules from each other; and the applicability to abstract problems such as theorem proving.

The disadvantages of the symbolic approach are: the adversity to noisy datasets; and the fact that rules are (usually) hand-crafted and hard-coded into the system, which also makes them hard to maintain.

=== Points in common

A core idea that we think the two approaches share is that they can be both regarded as declarative programming paradigms of sorts. As we've discussed in the section dedicated to programming languages, a computer can be told how to do something (imperative), or it can be (just) told to do that thing (declarative). A case of declarative programming taken to the extreme is when the computer is merely given a description of the problem, and told to devise a solution of its own. In this sense, both kinds of AIs are declarative: the idea is to avoid explicitly coding a behavior that may be beyond our practical reach with more traditional programming abstractions.

Some researchers believe that one of the main bottlenecks of Symbolic methods has always been the reliance on manually compiled and maintained rule-sets. The manual creation and maintenance of inference rules is a limiting factor that some research projects are trying to eliminate, also through the use of hybrid Symbolic/Sub-symbolic approaches for learning rules automatically from quasi-natural language @ilkou2020symbolic, @yang2021learning.

// TODO baesyian networks

== Symbolic AI: a closer look

We will now take a closer look at some of the theory behind the more "classical" kind of AI. An interesting place to start from is the enunciation of the Knowledge Representation (KR) hypothesis by philosopher Brian Cantwell Smith, which states that:

"Any mechanically embodied intelligent process will be comprised of
structural ingredients that a) we as external observers naturally take to
represent a propositional account of the knowledge that the overall
process exhibits, and b) independent of such external semantic attribution, play a formal but causal and essential role in engendering
the behavior that manifests that knowledge" @brachman2022machines.

In other words, the system contains physical parts that we take to be symbols representing propositions, and the behavior of the system depends on the state of those physical parts: there is a close mapping between the logical propositions we deal in, and the state of the physical parts it deals in.



// - Advice Taker


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


// flexible, not "idiot savant"
// knowledge AND reasoning
// KR representation hypothesis
// theory of everything, naive physics, naive phsychology
// knowledge graphs 
// Brachman on semantic networks and Levesque on automated planning
// criticism related to better baesyian networks and relationship to neural networks
// https://en.wikipedia.org/wiki/Bayesian_network
// https://en.wikipedia.org/wiki/Bayes%27_theorem
// https://jonascleveland.com/bayesian-network-vs-neural-network/
// Machines Like Us proposed implementation system
// - Metafor (presented in detail in naturalistic programming)
// https://en.wikipedia.org/wiki/Commonsense_reasoning


// -------------------------------------------------------------------------------

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