term AI coined in 1956 by John McCarthy, very influential computer scientist also known for inventing Lisp, but the subject can trace its origins before that.

chinese room argument searle

expectations outpacing reality

recently some LLMs have reportedly passed the turing test [ai16](./bib.md#ai16)

turing test
imitate a human to the point where a suspicious judge cannot tell the difference between human and machine introducted a paper by Alan Turing, 1950, Computing Machinery and Intelligence, very ambitious standard

[](./bib.md#ai15) history

Alan Turing (1912-1954), British mathematician, computer scientist, logician and cryptanalist devised the Turing Machine, and later worked on cyphers during WW2 breaking the Enigma code

is sentient behaviour provably "computable"?

Goedel

turing test is not a necessary condition for intelligence (young children)

alternatives to turing test
Feigenbaum Test: computer has to surpass expert in field, no casual conversation 
cf: [ai1](./bib.md#ai1)

Nicholas Negroponte variation: AI helps human accomplish goals in the same way a human would

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


Various summer/winter phases, of AI


Symbolic (GOFAI) vs Sybsymbolic divide

(1) symbolic approaches produce logical
conclusions, whereas sub-symbolic approaches provide
associative results. (2) The human intervention is com-
mon in the symbolic methods, while the sub-symbolic
learn and adapt to the given data. (3) The symbolic meth-
ods perform best when dealing with relatively small and
precise data, while the sub-symbolic ones are able to
handle large and noisy datasets.


Symbolic:

pros:
- associated to FOL, KBs and expert systems
- ability to explain and reason, intermediate steps explainable
- rule modularity (discrete and autonomous rules)
- better for abstract problem

cons:
- not well suited to noisy datasets
- hand coded and hard coded rules
- maintenance of rules is hard

Sub-symbolic:

- more robust against noisy/missing data
- easy to scale up
- better for perceptual problems

- lack interpretability
- high dependence on training data
- huge computation power and amounts of data for training

prediction, clustering, pattern classification and
recognition of objects, text classification, recognition of speech and text


Some researchers believe that one of the main bottlenecks of symbolic methods has been the manual creation of rules, and there exist some mixed approaches [ai6](./bib.md#1ai6), [ai13](./bib.md#ai13).
