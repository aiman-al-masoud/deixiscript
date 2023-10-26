# Artificial Intelligence

Artificial Intelligence is an extremely broad area of study that has undergone various "summers" and "winters" [ai6](./bib.md#1ai6), spanned over decades of research from its first inception in the last century, and occupied some of the most brilliant minds in history.

It is an endeavor which involves knowledge of the most disparate of disciplines: logic, mathematics, computer science and philosophy. Unfortunately, it is impossible to cover all of its history in a work like this, therefore we will spend the next few pages painting it in very broad strokes and focusing mostly on the more traditional Symbolic or "Good Old Fashioned AI" (GOFAI) approach, which will be most relevant to the present work.

## History of Term

The term "Artificial Intelligence" (AI) proper was first coined in 1956 by John McCarthy (1927-2011), eminent computer scientist who is also known for having invented Lisp in 1958 [p4](./bib.md#p4), which has evolved into a family of programming languages we discuss about in the section on programming languages, but the subject of "thinking machines" is older and can trace its origins years before that [ai15](./bib.md#ai15).

## The Turing Test

Back in 1950 [ai18](./bib.md#ai18), Alan Turing (1912-1954), mathematician, computer scientist, logician and cryptanalist set out on a very ambitious journey, which has influenced the practice of AI ever since, and that was the task of determining whether sentient behaviour was "provably computable" [ai15](./bib.md#ai15).

<!-- Goedel -->

In doing so, Turing introduced the concept of the Turing Test: a metric to tell if a computer could "think", according to the definition given by its author. The test involves a "suspicious human judge" who has to converse with two subjects: another human and a machine, both hidden behind a curtain. The judge's goal is to tell them apart, from their usage of language alone. In what can be aptly described as an "imitation game", the goal of the machine is to deceive the human judge regarding its being a machine [ai15](./bib.md#ai15).

It was recently reported (2022-23) that some Large Language Models (LLMs) such as Google’s LaMDA [ai16](./bib.md#ai16) and OpenAI's GPT [ai17](./bib.md#ai17) have succeded in passing the Turing Test, an ambitious feat which had remained largely unaccomplished for decades prior to that [ai15](./bib.md#ai15). If this is all accurate, it means that we are now living in the post-Turing Test era.

## The Chinese Room Argument

Obviously, the merits, implications and interpretations of the results offered by a successfully passed instance of a Turing Test are controversial topics to say the least in the philosophy of mind. Years before the advent of LLMs, in 1980, philosopher John Searle (1932-) first made public his famous Chinese Room Argument [phil1](./bib.md#phil1).

In the mental experiment, Searle urges us (non-Chinese speakers) to imagine ourselves being locked up in a room filled with books on how to manipulate Chinese symbols algorithmically. One will find that he/she is able to communicate with the outside world only through a narrow interface of textual messages written on slips of paper and passed through the door.

After learning how to manipulate those symbols and getting reasonably good at it, one will achieve the ability to deceive an external observer sitting outside of the room regarding one's own knowledge of Chinese. But, obviously, knowledge of how to manipulate its syntactic symbols by rote doesn't correspond with true semantic understanding of a language.

Numerous objections and counter-objections to the argument have been rised since then [phil2](./bib.md#phil2), and there is still no general consensus on the conclusions and validity of the argument[phil2](./bib.md#phil2). It is nonetheless a powerful and intuitive case for the idea that what computers are doing when they "think" is fundamentally different from what humans do (or at least, what the writer of this paragraph in his subjective experience does).

## Alternatives to the Turing Test

An important point to make is that the Turing Test may represent a sufficient condition for "intelligence" (depending on how the term is defined and always keeping in mind arguments such as Searle's Chinese Room), but passing it certainly isn't a necessary condition for intelligence, very young children offer the perfect example of intelligent beings which may still not be verbally able to express themselves adequately enough to pass the test [ai15](./bib.md#ai15).

There are a number of variations and alternatives to the Turing Test, such as the Feigenbaum Test (or subject matter expert Turing test), which eliminates the "casual" nature of the open-ended conversational Turing Test from the picture, by stipulating that a computer demonstrate proficency in a specialized area of interest [ai15](./bib.md#ai15), this, by surpassing an expert in that specific field.

Another alternative is Nicholas Negroponte's variation, where an AI should help a human accomplish goals in the same way a human would [ai15](./bib.md#ai15).

## Symbolic vs Sub-symbolic AI

An important methodological distinction in the discipline of AI is represented by the Symbolic vs Sub-Symbolic divide.

The rationale behind this terminology stems from "old" AI's reliance on explicit human-readable symbols and notation to represent information.

Symbolic AI or Good Old Fashioned AI (GOFAI) represents the older and more traditional approach to the subject, it is typically associated to First Order Logic (FOL), to Knowledge Bases (KBs) and to Expert Systems, and has seen a period of flourishing during the birth of AI and in the 1980s in the hayday of Expert Systems.

Sub-symbolic AI, while tracing its origins back to such early works as Frank Rosenblatt's "perceptron", has been slower at achieving vast adoption, and is now enjoying a renewed period of popularity, with the advent and perfection of such techniques as Machine Learning (ML) and Deep Learning that harness the power of gargantuan Neural Networks.

### Symbolic:

#### pros:
- ability to reason and explain, with easily interpretable intermediate steps
- rule modularity (rules are discrete and autonomous)
- better suited for abstract problems (eg: theorem proving)
#### cons:
- not well suited to noisy datasets
- (usually) relies on hand-coded and hard-coded rules
- maintenance of rules is hard

Typically associated to: Knowledge Bases, Expert Systems, the Prolog Language.

### Sub-symbolic:

#### pros:
- more robust against noisy/missing data
- easy to scale up (can handle big data)
- better for perceptual problems (which can be hard to desribe with explicit knowledge)
- less human intervention required in training
- good execution speed

#### cons:
- lack interpretability
- high dependence on training data
- requires huge computation power and amounts of data for training

Typically used for: prediction, clustering, pattern classification, recognition of speech and text.

### Points in common

A point that the two approaches have in common, in a sense, is that they can be both regarded as declarative programming paradigms. As we've discussed in the section dedicated to programming languages, a computer can be told _how_ to do something (imperative), or it can be (just) told to do that thing (declarative). A case of declarative programming taken to the extreme is when the computer is merely given a description of the problem, and told to devise a solution of its own. In this sense, both kinds of AIs are declarative: the idea is to avoid explicitly coding a behavior that may be beyond our practical reach with more traditional programming abstractions.

Some researchers believe that one of the main bottlenecks of Symbolic methods has always been the reliance on manually compiled and maintained rule-sets. The manual creation and maintenance of inference rules is a limiting factor that some research projects are trying to eliminate, also through the use of hybrid Symbolic/Sub-symbolic approaches for learning rules automatically from quasi-natural language[ai6](./bib.md#1ai6), [ai13](./bib.md#ai13).




<!-- devised the Turing Machine, and later worked on cyphers during WW2 breaking the Enigma code -->

expectations outpacing reality

Type-A (brute force) vs Type-B (heuristics-based) chess programs, deep blue Type-A, in 1997 Deep Blue challenged and defeated the then world chess champion Gary Kasparov

branching factor: Valid moves a player can make at any point in time, higher in Go than in chess

AlphaGo (deep learning based) program from DeepMind shocked the world in 2016 by defeating one of the world’s premier Go players, Lee Sedol. AlphaGo then went on to defeat the world’s top player, Ke Jie, in 2017.  [ai1](./bib.md#ai1)

expert systems

first emerged in the early 1950s 

- KB with facts and rules
- inference engine 
- I/O interface

symbolic logic rather than numerical computations, data-driven, explicit (and declarative) knowledge, human interpretable conclusions

KR Hypothesis,  by Brian Cantwell Smith

Any mechanically embodied intelligent process will be comprised of
structural ingredients that a: we as external observers naturally take to
represent a propositional account of the knowledge that the overall
process exhibits, and b: independent of such external semantic attribution, play a formal but causal and essential role in engendering
the behavior that manifests that knowledge

[ai1](./bib.md#ai1)


The Cyc Project

[ai1](./bib.md#ai1)

enCYClopedia

expert systems are brittle, need to be reinforced with typically unstated commonsense facts "declarative tacit knowledge"  

The Cyc knowledge base is currently claimed to contain “more than 10,000 predicates, millions of collections and concepts, and more than 25 million assertions”—an amazing accomplishment [ai1](./bib.md#ai1)

heuristic adequacy—related to “how to search spaces of possibilities and
how to match patterns.”

 According to Lenat,
“By 1989, we had identified and implemented about 20 such special-case
reasoners, each with its own data structures and algorithms. Today [2019]
there are over 1100 of these ‘heuristic level reasoning modules.’


Symbolic (GOFAI) vs Sybsymbolic divide

(1) symbolic approaches produce logical
conclusions, whereas sub-symbolic approaches provide
associative results. (2) The human intervention is com-
mon in the symbolic methods, while the sub-symbolic
learn and adapt to the given data. (3) The symbolic meth-
ods perform best when dealing with relatively small and
precise data, while the sub-symbolic ones are able to
handle large and noisy datasets.



Some researchers believe that one of the main bottlenecks of symbolic methods has been the manual creation of rules, and there exist some mixed approaches [ai6](./bib.md#1ai6), [ai13](./bib.md#ai13).

come up w/