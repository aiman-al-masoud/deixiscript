
Artificial Intelligence is an extremely broad area of study that has undergone various "summers" and "winters" [ai6](./bib.md#1ai6), spanned over decades of research from its first inception in the last century, and occupied some of the most brilliant minds in history.

It is an endeavor which involves knowledge of the most disparate of disciplines: logic, mathematics, computer science and philosophy. Unfortunately, it is impossible to cover all of its history in a work like this, therefore we will spend the next few pages painting it in very broad strokes and focusing mostly on the more traditional Symbolic or "Good Old Fashioned AI" (GOFAI) approach, which will be most relevant to the present work.

The term "Artificial Intelligence" (AI) proper was first coined in 1956 by John McCarthy (1927-2011), eminent computer scientist who is also known for having invented Lisp in 1958 [p4](./bib.md#p4), which has evolved into a family of programming languages we discuss about in the section on programming languages, but the subject of "thinking machines" is older and can trace its origins years before that [ai15](./bib.md#ai15).

Back in 1950 [ai18](./bib.md#ai18), Alan Turing (1912-1954), mathematician, computer scientist, logician and cryptanalist set out on a very ambitious journey, which has influenced the practice of AI ever since, and that was the task of determining whether sentient behaviour was "provably computable" [ai15](./bib.md#ai15).

<!-- Goedel -->

In doing so, Turing introduced the concept of the Turing Test: a metric to tell if a computer could "think", according to the definition given by its author, involving a suspicious human judge who has to converse with two subjects: a human and a machine behind a curtain, and tell them apart from their usage of language alone. In what can be aptly described as an "imitation game", the goal of the machine is thus to deceive the human judge regarding its being a machine [ai15](./bib.md#ai15).

It was recently reported (2022-23) that some Large Language Models (LLMs) such as Google’s LaMDA [ai16](./bib.md#ai16) and OpenAI's GPT [ai17](./bib.md#ai17) have succeded in passing the Turing Test, an ambitious feat which had remained largely unaccomplished for decades prior to that [ai15](./bib.md#ai15). If this is all accurate, it means that we are living in the post-Turing Test era.

Obviously, the merits, implications and interpretations of the results offered by a successfully passed instance of a Turing Test are controversial topics to say the least in the philosophy of mind. Years before the advent of LLMs, in 1980, philosopher John Searle (1932-) first made public his famous Chinese Room Argument [phil1](./bib.md#phil1).

In the mental experiment, Searle urges us (non-Chinese speakers) to imagine ourselves being locked up in a room filled with books on how to manipulate Chinese symbols algorithmically. One will find that he/she is able to communicate with the outside world only through a narrow interface of textual messages written on slips of paper and passed through the door.

After learning how to manipulate those symbols and getting reasonably good at it, one will achieve the ability to deceive an external observer sitting outside of the room regarding one's own knowledge of Chinese. But, obviously, knowledge of how to manipulate its syntactic symbols by rote doesn't correspond with true semantic understanding of a language.

Numerous objections and counter-objections to the argument have been rised since then [phil2](./bib.md#phil2), and there is still no general consensus on the conclusions and validity of the argument[phil2](./bib.md#phil2). It is nonetheless a powerful and intuitive case for the idea that what computers are doing when they "think" is fundamentally different from what humans do (or at least, what the writer of this paragraph in his subjective experience does).

An important point to make is that the Turing Test may represent a sufficient condition for "intelligence" (depending on how the term is defined and always keeping in mind arguments such as Searle's Chinese Room), but passing it certainly isn't a necessary condition for intelligence, very young children offer the perfect example of intelligent beings which may still not be verbally able to express themselves adequately enough to pass the test [ai15](./bib.md#ai15).

There are a number of variations and alternatives to the Turing Test, such as the Feigenbaum Test (or subject matter expert Turing test), which eliminates the "casual" nature of the open-ended conversational Turing Test from the picture, by stipulating that a computer demonstrate proficency in a specialized area of interest [ai15](./bib.md#ai15), this, by surpassing an expert of that field.

Another alternative is Nicholas Negroponte's variation, where an AI should help a human accomplish goals in the same way a human would [ai15](./bib.md#ai15).




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
