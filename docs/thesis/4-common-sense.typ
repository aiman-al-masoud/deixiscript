= Common Sense <commonsense>

It is puzzling to think how easy it is to program a machine to perform a task that is extremely difficult for a human being (such as beating the world-champion in chess @deepBlue), and yet apparently so hard to get the same machine to do something that most of us do on a daily basis, without even thinking too hard: using common sense.

== A Central Problem

The book "Machines like Us: Toward AI with Common Sense" @brachman2022machines from 2022 presents us with an invaluable overview of this problem, its historical background and its practical and ethical ramifications; it was authored by Ronald J. Brachman and Hector J. Levesque, two eminent researchers in the field of Artificial Intelligence (AI); who are known for their contributions in the fields of semantic networks and logic-based reasoning about beliefs and plans, respectively @kautz2023ronald.

"Common sense" in the context of AI doesn't mean anything much different from what it means for most of us in our daily life: it is the ordinary ability to posses (and make use of) non-expert knowledge to achieve ordinary, practical goals. Common sense is quite a flexible subset of rationality; it doesn't demand formal study or take above-average intelligence for a person to reason through experiential facts, to formulate predictions on the behavior of simple physical systems, or on the behavior of other intelligent agents (people) based on the feelings and goals of the latter, and to use these insights to smoothly handle the occurrence of an unexpected or unusual situation.

The book "Machines Like Us" also proposes a general idea for implementing a system with Common Sense reasoning capabilities, though many implementation details are left open, and Hector Levesque, whom I had the pleasure of contacting via email, said that, to his knowledge, no system along those lines has been built yet (as of June 2023).

The problem of endowing machines with Common Sense, is arguably at the core of designing a truly general AI system, not just a very efficient yet specialized problem solver, but rather: a system that can stand its ground, even in uncharted territory. 

Moreover, unpredictable scenarios (as Brachman and Levesque remind us in their book, and as Nassim Taleb (1960-) reminds us in his 2007 book "The Black Swan" @taleb2007black) happen much more often than we would be inclined think: the tiny likelihood of a single, specific, bizarre event taken by itself shoudln't deceive us; in the real world there are so many unknowns, so much so that eccentric events are the order of the day.

== The Issue of Creativity

We want to suggest a parallel between the problem of Common Sense in AI, and the somewhat related issue of "Creativity" in linguistics expression and other areas of human endeavor. Philosopher Fred D'Agostino (1946-) discusses Chomsky's views on human creativity in his paper from 1984 "Chomsky on Creativity" @d1984chomsky. 

Chomsky draws inspiration from his pioneering work in linguistics to arrive at a more general notion of human creativity. The speaker of any language regularily builds or grasps the meaning of a sentence he may be looking at for the first time in his or her life; this is an example of what Chomsky calls linguistic productivity.

A person may produce an indefinite amount of sentences that are new to his or her experience, but they are not random; they are just the right thing to say, and yet they are also independent of "detectable stimulus configurations".

Since the data available to a child learning his or her first language is most often incomplete and poor in quality, Chomsky's thesis has always been that human children have an innate ability to learn the class of languages we call "human languages", this implies a congenital, biological limit on the kinds of grammars that are possible for these languages.

From this follows the idea that human creativity too, in the more general sense, may be limited by a "system of constraints and governing principles"; this idea is known as the "Limits Thesis", and its compatibility with the "established beliefs" about creativity is the object of contention of the paper by D'Agostino; such "established beliefs" emphasize the rulelessness and unpredictability (rather than boundedness) of creative work.

=== A hierarchy of constraints

D'Agostino's solution, to reconcile Chomsky's view with the "established beliefs", involves trying to understand creativity in terms of problem solving; problems are characterized by their constraints, different sets of contraints determine different problems. Problems can be ranked in a hierarchy, based on the kinds of constraints they place on any valid solution; this hierarchy includes problems with 5 kinds of constraints: determinative, limitative, eliminative, tentative and trivial. We think that the respective 5 classes of problems are sorted by growing "undefinedness", rather than "difficulty", as we shall see.

"Determinative" constraints are the strictest: they characterize the class of problems for which it is easy to define an algorithm, for which a procedural solution exists, such as arithmetic problems. 

"Limitative" constraints characterize those problems that are "well-defined", they provide necessary and sufficient conditions for the solution, examples of such problems are related to theorem discovery: there are necessary and sufficient conditions for some argument to count as a valid theorem for some position; yet there is no single mechanized way of discovering such proofs. 

"Eliminative" constraints only provide necessary (but no sufficient) conditions for the solutions that satisfy them, these problems are termed as "partially-defined", many "design-related" problems (eg: in architecture, engineering...) fall into this category.

If a problem is given where _some_ (of course not _all_) of the constraints may be violated, then the constraints are "tentative", and the problem is "radical"; solved examples of such problems may occur in the history of science, where to accomodate for certain new facts, a theory may have had to be proposed which rejected certain standards of methodological practice. 

Lastly, if the constraints are even more vague than that, if they don't even tentatively try to provide necessary conditions for their solution, then they are "trivial" and the problems they describe are termed "improvisational"; examples of such problems are common in the domain of aesthetics (such as the arts).

=== Relationship with Common Sense

We are tempted to say that Common Sense encompasses all of the aforementioned modes of reasoning, minus the "expert twist" to most of the concrete examples of problems provided by D'Agostino in his clear exposition of the problem-hierarchy. 

For instance: a well-defined problem may take on a much more mundane shape than the discovery of new mathematical theorems; it may be a "problem" such as the one we already mentioned when discussing McCarthy's Advice Taker: the "problem" of getting to the airport given that one's location is A, the airport's location is B, and the means of transport from A to B is available in the form of a car one can drive.

Likewise, we think it is easy to find examples of "partially-defined" problems that can be solved by the application of common sense knowledge and reasoning; and if one identifies the concept of a "constraint" from the above analysis with the concept of a "goal" (a desirable state of the world) in logic-based planning, then "radical" problems that are solvable by common sense could be cases in which some goals are less important than others and can be sacrificed (there is a goal-hierarchy); such an example is brought up in chapter 9 of the book "Machines like Us", which discusses how a self-driving car equipped with common sense may decide to modify an original plan of action (like driving to a specific grocery store) because of an unexpected obstacle on the road, and decide instead to go to another grocery store (to get the same or a similar kind of groceries it was ordered to get).

// == History of AI

// Artificial Intelligence is an extremely broad area of study that has undergone various "summers" and "winters" @ilkou2020symbolic; spanning over decades of research from its first inception in the last century, and preoccuping some of the most brilliant minds in logic, mathematics, philosophy and computer science.

// Unfortunately, it is impossible to cover all of its history in the present work, we will therefore spend the next few pages painting it in very broad strokes; we will focus mostly on the more traditional Symbolic or "Good Old Fashioned AI" (GOFAI) approach, which will be most relevant to the present work.

// As we already mentioned in the section dedicated to the Lisp programming language(s), the term "Artificial Intelligence" (AI) proper was first coined in 1956 by John McCarthy; but the study of so called "thinking machines" is a little older than that @smith2006history.

== The Turing Test

The goal of formalizing Common Sense has arguably not been the (sole) focus of AI during the past 70 or so years of its existence; in what follows we shall (very) briefly discuss some of the broad ideas in AI, to then get back to the more specific problem in question.

Back in 1950, British mathematician, logician and cryptanalist Alan Turing (1912-1954), set out on the ambitious journey of determining whether sentient behaviour was "provably computable" @turing2009computing, @smith2006history.

Turing introduced what came to be known as the Turing Test: a metric to tell if a computer could "think", according to the definition given by Turing. The test involves a "suspicious human judge" who has to converse with two subjects: another human and a machine, both hidden behind a "curtain". The judge's goal is to tell them apart, from their usage of language alone. The goal of the machine, in this "imitation game", is to deceive the human judge into thinking he's conversing with another human being.

It was recently reported (2022-2023) that some Large Language Models (LLMs), based on Deep Learning techniques, such as Google's LaMDA @turingtestobsolete and OpenAI's GPT @gptbroketuring have succeded in passing the Turing Test, an ambitious feat which had remained largely unaccomplished for decades prior to that @smith2006history. If this is all accurate, it means that we are now living in the post-Turing Test era.

=== Alternatives to the Turing Test

An important point to make is that the Turing Test may represent a sufficient condition for "intelligence" (depending on how the term is defined), but passing it certainly isn't a necessary condition for intelligence, very young children offer the perfect example of intelligent beings who may still not be able to (verbally) express themselves adequately enough to pass the test @smith2006history.

There are a number of variations and alternatives to the Turing Test; one is the Feigenbaum Test (or subject matter expert Turing test), which eliminates the "casual" nature of the open-ended conversational Turing Test, by stipulating that a computer demonstrate proficency in a specialized area of interest @smith2006history, this, by surpassing an expert in that specific field.

Another alternative is Nicholas Negroponte's variation, where an AI should help a human accomplish goals in the same way a human would @smith2006history.

Yet another alternative is the Winograd schema challenge (WSC) @winogradChallengeGpt introduced by Levesque in 2012, and named after computer scientist Terry Allen Winograd (1946-). This test involves specific questions, similar to the example about the "table and the ball" that we will discuss later in this chapter (@commonSenseAndNatlang). These questions are aimed at probing a system's competence at making common-sense inferences from partial information contained in sentences.

== The Chinese Room Argument

Obviously, the merits, implications and interpretations of the results offered by a successfully passed instance of a Turing Test are controversial in the philosophy of mind. Years before the advent of modern day LLMs, in 1980, philosopher John Searle (1932-) first published his famous Chinese Room Argument @searle1999chinese.

In the mental experiment, Searle urges us (non-Chinese speakers) to imagine ourselves being locked up in a room filled with books on how to manipulate Chinese symbols algorithmically. One will find that he/she is able to communicate with the outside world only through a narrow interface of textual messages written on slips of paper and passed through the door.

After learning how to manipulate those symbols and getting reasonably good at it, one will achieve the ability to deceive an external observer sitting outside of the room regarding one's own knowledge of Chinese. But, obviously, knowledge of how to manipulate its syntactic symbols by rote doesn't correspond with true semantic understanding of a language.

Numerous objections and counter-objections to the argument have been rised since then, and there is still no general consensus on the conclusions and validity of the argument @sep-chinese-room. It is nonetheless a powerful and intuitive case for the idea that what computers are doing when they "think" is fundamentally different from what humans do (or at least, what the writer of this paragraph in his subjective experience does).

== Symbolic vs Sub-symbolic AI

An important methodological distinction in the discipline of AI is represented by the traditional one made between "Symbolic" or "Good Old Fashioned AI" (GOFAI), versus "Sub-Symbolic" AI. The rationale behind this nomenclature stems from "old" AI's reliance on explicit human-readable symbols and formal logic notation, rather than the numerical and statistical methods of "new" AI.

Symbolic AI, as we said, represents the older and more traditional branch of AI; it is typically associated to the use of First Order Logic (FOL), or some other formal language, to represent knowledge, and it has seen a period of flourishing during the birth of AI and in the 1980s during the heyday of Expert Systems.

Sub-symbolic AI, while tracing its origins back to such early works as Frank Rosenblatt's (1928-1971) "perceptron", has been slower at achieving vast adoption; it is now enjoying a new period of popularity, with the advent and perfection of such techniques that harness the power of neural networks such as Machine Learning (ML), and Deep Learning (which "just" means using _deep_ neural networks, with a larger number of layers).

=== Symbolic: pros and cons

The advantages of the symbolic approach have traditionally been: the ease of implementing explainable reasoning, with intermediate steps; rule modularity, or the discreteness and independence of rules from one another; and the applicability to abstract problems such as theorem proving.

The disadvantages of the symbolic approach are: the adversity to noisy datasets; and the fact that rules are (usually) hand-crafted and hard-coded into the system, which also makes them hard to maintain.

=== Sub-Symbolic: pros and cons

The advantages of the sub-symbolic approach are: an increased robustness to noisy and/or missing data; the ease of scaling up and handling large amounts of data; the better suitability for perceptual problems (such as face recognition) where it can be pretty hard to describe rules in any formal or natural language for lack of relevant explicit knowledge; less human intervention, because the machine can learn autonomously from the data; and good execution speeds (once the model is trained). Sub-symbolic approaches are typically used for tasks such as: data clustering, pattern classification, and recognition of speech and text @smith2006history.

The disadvantages of the sub-symbolic approach include: a lack of interpretability (often resulting in a black-box system); a relatively high dependence on training data; and the fact that such models typically require large amounts of computational resources and large amounts of data to train initially.

=== Sub-symbolic AI: Neural Networks

Most of the modern Sub-symbolic AIs are based on Neural Networks. The Neural Network (NN) is a kind of architecture for a computer program, that draws inspiration from the functioning of neurons (nerve cells) and synapses in the brains of biological organisms @nielsen2015neural.

A neural network is a collection of neurons organized in layers; each neuron from a layer produces an output which is channelled as an input to all of the neurons of the subsequent layer, the typical NN doesn't have loops, though recurrent neural networks (RNNs) do. Each connection going into a neuron has an associated weight (or importance); a weight is modelled as a factor (number) which multiplies the given input at the corresponding connection. 

A neuron applies the corresponding weight to each of its inputs, then sums up the results, adds a bias to the sum, then applies a function known as the "activation function" to the result; the activation function has to be non-linear, so as to introduce non-linearity to the network and allow it to approximate non linear relations; the reason it is termed "activating" is that this function determines when the neuron will be "firing"; a common choice for it is the sigmoid function, which approximates the step function.

// https://stackoverflow.com/questions/9782071/why-must-a-nonlinear-activation-function-be-used-in-a-backpropagation-neural-net

Stepping back to see the big picture, when an input enters the first layer of the network, each of the neurons produces an output, which is fed into the next layer, which in turn produces outputs which go into the next layer, etc... Until the output layer is reached. The input layer may consist of, for example, the values of the pixels of a greyscale image representing handwritten digits that have to be classified; and the 10 outputs, for instance, may represent the probability that the image represents either one of the 10 digits (from 0 to 9).

Training a neural network consists of finding the "optimal" weights and biases which minimize the prediction error of the network for a particular training set, the error is often computed as a "cost function". Minimizing the error usually involves approximating the derivative of the cost function through the use of numerical and stochastic methods, because the exact solution would be too computationally demanding to evaluate.

=== Symbolic and Sub-symbolic: points in common

A core idea, that we think the two approaches share, is that they can be both regarded as declarative programming paradigms of sorts. As we've discussed in the section dedicated to programming languages, a computer can be told how to do something (imperative), or it can be (just) told to do that thing (declarative). A case of declarative programming taken to the extreme is when the computer is merely given a description of the problem, and told to devise a solution of its own. In this sense, both kinds of AIs are declarative: the idea is to avoid explicitly coding a behavior that may be beyond our practical reach with more traditional programming abstractions.

Some researchers believe that one of the main bottlenecks of Symbolic methods has always been the reliance on manually compiled and maintained rule-sets. The manual creation and maintenance of inference rules is a limiting factor that some research projects are trying to eliminate, also through the use of hybrid Symbolic/Sub-symbolic approaches for learning rules automatically from quasi-natural language @ilkou2020symbolic, @yang2021learning.

// TODO baesyian networks

== Symbolic AI: a closer look

We have already talked about Advice Taker, the hypothetical program originally envisioned in 1959 by John McCarthy to be a general purpose common sense reasoner; but McCarty's reasearch didn't stop there. Another important work was "Philosophical Problems from the Standpoint of AI" which he and the British computer scientist and AI researcher Patrick J. Hayes (1944-) published in 1981.

=== Machine Intelligence

The paper begins by discussing the very notion of "intelligence" in a machine, as the authors aren't fully satisfied by the Turing Test's criterion; they propose to regard intelligent machines as: "fact manipulators".

Intelligence is broken down into two parts: an "epistemological" and a "heuristic" part. The "epistemological" part is related to how the world is represented internally by the machine, and the "heuristic" part is related to how this representation is used by the machine to actually solve problems. The paper mainly discusses the epistemological part, and proposes to represent knowledge as formal logic (predicate logic, or some higher order logic).

An "intelligent" machine will have an adequate world model, which should also allow it to represent its own goals; it will be able to answer questions based on the knowledge contained in its world model; it will be able to get extra information from its environment if it determines that its current knowledge is insufficient; and it will perform actions to achieve its goals.

We think that this view of "intelligence" in machines is consistent with the more general Knowledge Representation (KR) hypothesis as formulated by philosopher Brian Cantwell Smith, (and brought up in Brachman's and Levesque's book "Machines Like Us"), which states that:

"Any mechanically embodied intelligent process will be comprised of structural ingredients that a) we as external observers naturally take to represent a propositional account of the knowledge that the overall process exhibits, and b) independent of such external semantic attribution, play a formal but causal and essential role in engendering the behavior that manifests that knowledge" @krhypothesis.

In other words, the physical structure of the system is isomorphic to (closely mirrors) the logical structure of the knowledge we take it to be representing.

=== Naive Theories of Everything

McCarthy and Hayes remind the reader of the general relevance of philosophy to the problem of AI, however they dismiss a lot of it is irrelevant to the question of building a general AI system: there is no question that the physical world exists and that it already contains some intelligent agents such as people; and that information about the world is obtainable through the senses (or input channels of a computer); and that our common sense and scientific views of the world are roughly correct; etc...

However, it is hard even to arrive at a naive formalization of common sense that is precise enough for a computer to act accordingly (let alone for the computer to discover this formalization "introspectively"). Moreover, we may say that such "naive common sense theories" of the world are so deeply ingrained in our own minds, that it takes a certain degree of effort to even state them clearly enough in natural language. 

A taste of such theories is given in the book by Brachman and Levesque, where it is divided into three parts: "A Theory of Everything", "Naive Physics" and "Naive Psychology"; the first of these three contains statements such as: "There are things, and they have properties" and "Event occurrences are nonphysical things whose existence is responsible for change", to give an idea of the level of abstractness and (apparent) obviousness they deal with.

=== The Frame Problem

One of the facts that this "Theory of Everything" states out the so called "naive law of inertia", which is somewhat related to one of the problems originally raised in the 1981 paper by McCarty and Hayes. The problem is widely known as the "Frame Problem", and it's about ensuring that the state of the world model is updated in all the relevant ways (and _only_ the relevant ways), after an action is executed by the intelligent agent. As a side-note: when talking of time-mutable state, we generally speak of "fluents", which are a kind of predicate that depends on time.

Predicate logic is "monotonic" @sep-logic-nonmonotonic, this means that the more premises are added to the knowledge base, the more conclusions one will be able to draw. But this is not always desirable: we wish the system to handle "defeasible inferences": a kind of tentative inference from partial information, which is open to revision in light of additional information. 

For example, we might learn that "Bob" is a fish swimming near the shore, and that he gets thrown out of the water by a wave onto the sand in the beach; since fish can't breathe out of the water, we should infer that Bob dies. But then we come to learn that Bob is a mudskipper @mudskipper (a species of amphibious fish who can live in semiaquatic habitats), so we should revise our inference, and come to believe that Bob isn't dead after all.

But "plain" predicate logic is monotonic, as already said: it doesn't allow us to declare "revisable" rules of inference; and since "most things don't change when an action or event happens", it wouldn't be efficient (neither computationally, nor logically) to list out, one by one, all of the cases in which the happening of an event E _doesn't_ have any effect on thing T.

The frame problem is generally considered to be solved in the narrow context of classical AI and predicate logic, where it originally arose; but it has sparked debate in the broader contexts of philosophy and cognitive science; for example: the very assumption behind the common sense law of inertia, namely that: "most things don't change when an action or event occurs" has been challenged; there are many cases were it simply isn't true that changing one thing leaves the rest unchanged (eg: exploding a bomb in a room), how to distinguish them from the others @sep-frame-problem? We will not speak here of this problem any further.

== Common Sense and Natural Language Programming

There are a few topics from the field of Common Sense in AI that are relevant to the field of naturalistic programming.

=== Disambiguation <commonSenseAndNatlang>

Cracking the problem of Common Sense is an important step in achieving a complete understanding of natural language. Natural language, as we know, is highly context dependent; even in short sentences such as the example made in the book by Brachman and Levesque: "The large ball crashed through the table because it was made of steel", resolving the referent of the pronoun "it" (the ball), necessitates some generic knowledge of the world: namely that tables are usually made out of wood, and that steel is a heavier material than wood. Were the sentence to change to: "The large ball crashed through the table because it was made of _wood_" (emphasis added), then "it" would naturally be taken to refer to the table, not the ball.

=== Defeasible Rules

We think that the defeasibility (or revisability) of general rules is a recurrent theme in natural language; we have seen it when talking about L. A. Miller's findings on his group of students that were asked to write text-manipulating programs in natural language, we have seen it in Inform 7's system of "gradation of rules" and circumstances, and we also see it in the work related to Common Sense in AI; Brachman and Levesque speak of "annotations", and give them an important role in their proposed (tentative) design for a system with Common Sense.

The annotations they talk about concern the cancellation of restrictions (for example, on the value or number of a role in a relationship), but they (annotations) also concern the assignment of default fillers for a role, and perhaps even the management of metadata such as "source of belief", and "strength of belief" in a proposition.

=== Automated Planning

An concept related to Common Sense and discussed in "Machines Like Us", is that of automated planning. We have previously cited the example that Brachman and Levesque make in their book (about the self driving car, deciding to change route based on its terminal goal of getting the groceries). 

To posses this ability it is important that an agent possess (or at least approximate) some notion of "consequence" of the actions it contemplates taking, to make sure that they correspond to the goal it is trying to achieve.

==== Constraint Programming

Constraint programming is a declarative paradigm based on the notion of a constraint. A constraint is a natural, declarative way to describe relationships between objects @laffra1991constraints. This reminds us of the similar notion of constraint that came up while discussing D'Agostino's views on Chomsky's Limit Thesis. In a constraint programming language, the programmer declares the constraints, similar to how he/she declares the facts and inference rules in a language that supports logic programming. This paradigm was born in the context of logic programming, so there is a variant of it which is sometimes called "Constraint Logic Programming" @jaffar1987constraint.

The solution of a constraint problem can be guided by a more or less exact algorithm, sometimes only a heuristic that a programmer may or may not be able to specify, but after it is specified, it is the system's job to determine exactly how the particular solution is found.

We think this is an interesting paradigm, because it could be extended to systems with various "agents" (similar to objects in OOP) @laffra1991constraints, these independent actors could all be trying to fullfill their own goal (constraint) different from the goals of the others, by executing some basic actions declared procedurally by the programmer or perhaps learned through the concatenation of more basic actions, and abiding by the rules (or circumstances) declared by the programmer in natural language.

==== Programming Cognitive Robots

The 2019 e-book "Programming Cognitive Robots" @programmingCognitiveRobots by Levesque is structured as an introduction to the ERGO programming language, which is implemented and embedded in Scheme (a dialect of Lisp). The language ERGO (whose implementation is available on GitHub) is specialized for the task of programming "cognitive robots".

A "cognitive" robot is a software or hardware agent that exploits its knowledge of the world to deliberate a course of action that furthers its goals. The author cites the work of computer scientist and logician Ray Reiter (1939-2002) as influential for the mathematical theory behind ERGO.

The focus of programming a cognitive robot (which could just be a software agent, as we said) is not on the more classical low-level problem of controlling the robot's actuators: those capabilities are taken for granted (they can be seen as "primitive actions"). The focus is on the high-level problem of ensuring that the robot can automatically plan a course of action (and readjust this plan, if the relevant conditions of the environment change) based on a desired state of the world (a goal) that is assigned to the robot.

As we have already seen in the previous chapters, every programming paradigm sees the process of program-writing in a different light. In procedural programming, for instance, the goal of the programmer is to list out a detailed "recipe" of the steps to take to solve a problem. In logic programming, the programmer's goal is to declare the facts and inference rules.

Programming a cognitive robot amounts to specifying a Basic Action Theory (BAT) for a dynamic world. A BAT is a specification of all of the fluents (properties of the world that may be changed by an action), the state of the world (i.e. the values of all of the fluents), and the primitive actions that are available to the robot (which can have an effect on the fluents).

As such, this paradigm presents us with a peculiar mix of declarative and imperative approaches. It is (mostly) declarative because the robot is only told about its goals and of the ways in which the world can change following the occurrence of events, and has to compute a strategy automatically; and it is imperative because some knowledge (knowledge of the primitive actions for instance) can be presented in procedural form.

In the author's own words, the essence of programming a cognitive robot is: "Giving the system enough knowledge about the world, its actions, and what needs to be done for it to be able to calculate the appropriate primitive actions to perform."

We think that introducing this concept (automated planning) to a naturalistic programming language would present an improvement over prior work.


// design langs to decrease semantic gap, rather than LLMs to translate

// -------------------------------------------------------------------------------------------

// https://en.wikipedia.org/wiki/Situation_calculus#The_successor_state_axioms


// flexible, not "idiot savant"
// knowledge AND reasoning
// KR representation hypothesis
// knowledge graphs 
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
