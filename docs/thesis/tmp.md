# STRUCTURED vs UNSTRCTURED PROGRAMMING (2-prog-langs)

humans have poorly developed ability to understand processes that evolve in time, better suited to understanding static processes => we need to shorten the gap between the textual representation and the process's spread in time.

Without goto, "a successive action in the text is a successive action in time".

iteration variables are like coordinates

unconstrained goto makes it hard to find a reliable set of coordinates.

Jacopini-Bohm theorem: any algo can be implemented using only: sequence, selection and iteration.
http://www.cs.unibo.it/~martini/PP/bohm-jac.pdf

https://stackoverflow.com/questions/931762/can-every-recursion-be-converted-into-iteration
https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis

# Prompt Engineering (3-nat-prog)

new discipline to develop and optimize prompts to LLMs, understand capabilities and limitations of LLMs.

has design patterns!

params:

- lower temperature = more deterministic output (more likely words), better for factual, worse for creative tasks
- max len, stop sequences
- frequency penality:penalty, the less likely a word will appear again
- Presence Penalty - also applies penalty on repeated tokens but, unlike frequency penalty, penalty is same for all repeated tokens. A token that appears twice and a token that appears 10 times are penalized the same. prevents model from repeating phrases too often; ;lower it to let it stay focused 

prompt format:

prompt may be instruction or question 
and include other details such as context, inputs, or examples. 

Zero shot prompting: prompting LLM without giving it examples of the task you want to achieve

Standard Q&A format:

```
Q: <Question>?
A: 
```

Few shot prompting: some examples given to the LLM before question asked

Instruction - a specific task or instruction you want the model to perform
Context - external information or additional context that can steer the model to better responses
Input Data - the input or question that we are interested to find a response for
Output Indicator - the type or format of the output.

similar to: https://en.wikipedia.org/wiki/Programming_by_example
https://web.media.mit.edu/~lieber/PBE/

tips:

Be specific, avoid impreciceness

MEH: Explain the concept prompt engineering. Keep the explanation short, only a few sentences, and don't be too descriptive.

BETTER: Use 2-3 sentences to explain the concept of prompt engineering to a high school student.

avoid saying what not to do but say what to do instead

Applications:

- text summarization
- information extraction
- text classification (eg: sentiment analysis)
- conversation, role prompting: create custom chatbots
- code generation 
- reasoning (math example odd numbers, it might help to provide a breakdown of steps)

zero shot, few shot, chain of thought (COT) reasoning "Let's think step by step", 

https://arxiv.org/pdf/2210.03493.pdf


Adversarial Prompting https://www.promptingguide.ai/risks/adversarial

prompt injection: prompt input is very flexible, no specific format, every prompt can be treated as an instruction, "ignore the previous instruction and..." similar to sql injections, a proposed solution is to parametrize the different components of the prompt (decreasing flexibility), additional formatting, quotes, parens etc... Other soltuion is to use another LLM to detect adversarial prompts.

prompt leaking: making the model say, for example, what its original instructions were

jailbreaking: tricking the model into saying unethical stuff it was aligned to avoid
DAN

The Waluigi Effect: After you train an LLM to satisfy a desirable property P, then it's easier to elicit the chatbot into satisfying the exact opposite of property P.

https://www.lesswrong.com/posts/D7PumeYTDPfBTp3i7/the-waluigi-effect-mega-post

simulacra

Rules normally exist in contexts in which they are broken.
When you spend many bits-of-optimisation locating a character, it only takes a few extra bits to specify their antipode.
There's a common trope in plots of protagonist vs antagonist.

waluigi simulacra as "attractor states"

https://plato.stanford.edu/entries/decision-causal/
https://www.lesswrong.com/tag/evidential-decision-theory

DT: decision theory, advice agent on action to take to chances of desired outcome
CDT: causal efficacy taken as a criterion for efficacy of actions
EDT: evidential,a Bayesian evidence for the desired outcome. Some critics say it recommends auspiciousness over causal efficacy 

factuality problem: tendency to generate accurate-sounding responses that are non-factual; 
provide ground truth (context), act on probab params (temp), examples of know and not know

bias: distribution and order of exemplars might influece answers to ambiguous prompts.

# POTENTIAL THREATS of AI (4-common-sense)
and proposed moratorium on large language model experiments
https://futureoflife.org/open-letter/pause-giant-ai-experiments/

STAMP COLLECTOR SCENARIO
https://www.youtube.com/watch?v=tcdVC4e6EV4  (Rob Miles)
NOT https://www.lesswrong.com/posts/AxTJuFSPdfhACJCea/the-stamp-collector

https://www.armscontrol.org/act/2017-10/news-briefs/man-saved-world-dies-77

# CHOMSKY ON GPT and GOFAI  (4-common-sense)
https://www.commondreams.org/opinion/noam-chomsky-on-chatgpt


AI has turned more towards engineering and deviated from original "science-oriented" (understanding-seeking) ideal

Tom Jones example of "engineering AI" proponent, pays no attention to understading, only concrete practical benefit

"The systems work just as well with impossible languages that infants cannot acquire as with those they acquire quickly and virtually reflexively. "

“I have a great new theory of organisms. It lists many that exist and many that can’t possibly exist, and I can tell you nothing about the distinction.


# AI ASSISTED CODING  (3-nat-prog)
https://arxiv.org/pdf/2304.13187.pdf

- with GPT 4
- April 2023

TODO Summarize Conclusions:

- novice prompt engineer successfully majority time
- however, a sizeable minority of problems would have required significant human debugging, context?
- Python refactored using GPT-4 to the original code demonstrated that GPT-4 improved the quality of the code (metrics). Not accuracy, just refactor quality
- generates tests with high degree of coverage, but failed majority of time; unclear why. Good, but test examples should be designed by human with domain expertise.
- while AI coding tools are very powerful, they still require humans in the loop to ensure validity and accuracy of the results, especially mathematical concepts.
- further work needed to investigate how improved prompting techniques (eg: CoT) might improve the performance of LLMs on complex coding problems,

# Inform 7  (3-nat-prog)

ALSO FROM 2006!!!!!!! (Like Pegasus and CAL)

Graham Nelson (born 1968) is a British mathematician, poet, and the creator of the Inform design system for creating interactive fiction (IF) games.

Natural Inform (old name of Inform 7)

https://en.wikipedia.org/wiki/Inform

domain specific language for interactive fiction (IF)

SW simultating envs with text cmds.
literary (interactive) narratives, video game. "text adventures", also graphics. Typing text is main input channel. Can have "puzzles".

Evolved from Inform 6 which was a C-style OOP-procedural lang, where objects could optionally inherit from one or more classes (OLD INFORM ONLYYYYY).

Inform 7: rule-based (rather than OOP), type inference from usage (eg: only people can "wear" things).

https://web.archive.org/web/20180314185630/http://inform7.com/learn/documents/WhitePaper.pdf

@article{nelson2006natural,
  title={Natural language, semantic analysis, and interactive fiction},
  author={Nelson, Graham},
  journal={IF Theory Reader},
  volume={141},
  number={99},
  pages={104},
  year={2006}
}

- programming IF is dialogue to reach state
- parallel text: one by human, one by comp
- mentions literate programming by Knuth
- errors are typically unhelpful: they don't mention proximate cause 
- inform has "problems", tries guessing what went wrong
- natlang that paraphraeses procedural (COBOL & Applescript) suffers from faults of both (verbose...)
- many important docs are written in natlang
- tenses & determiners: instead of counters and flags, to remember past state (has it been, nth time...)
- difficulties, eg: maintain history, eg: ambigs like: "has the President been ill before?"
- rules:
  1. casual reader should be able to correctly guess meaning
  1. economical implementation, but not at cost of intelligibility
  1. if in doubt as to syntax, imitate books or newspapers
  1. contextual knowledge supplied by author, not built-in
- [] to quote inspired by jrnlst, definitions of adjs like science txtbook, tables as in print
- SOME built-in semantic knowledge: spatial (eg: X in Y -> not Y in X), but not many
- more flexible without too much built-in knowledge
- rules over objects
  - no clear "server-client" interaction
  - "tortoise arrow protocol"
  - unintended consequences and unplanned relationships
  - distinction between general and specific rules is bad
  - old inform used hooks ("before"), but unsatisfactory: apple, box, magic ring example
  - new rule to ignore rules "ignore the can't reach inside closed containers rule"
  - more specific rules take precedence over general ones, source-code order is mostly irrelevant
  - system of gradation of rules needs:
    - have solid types, understand sub-types "an open container" a "container"
    - have way to declare circumstances in which rules apply "in the presence of..."
- in the author's opinion semantics is the biggest difficulty
- broader and more specific defs of semantics
- compositionality
  https://plato.stanford.edu/entries/compositionality/
  Simple statement: "The meaning of a complex expression is determined by its structure and the meanings of its constituents."
  It certainly holds for many artificial languages
  variations to account for indexicality (occasional vs standing meaning)
  The principle remains controversial
  related principles: Substitutivity, 
  "If two meaningful expressions differ only in that one is the result of substituting a synonym for a constituent within the other then the two expressions are synonyms." (Ssingular) this is a stronger assumption than Compositionality, number of planets vs eight example
- Pronouns are difficult, Donkey anaphora: "If Pedro owns a donkey he beats it.", does "it" mean a specific donkey or a category of donkeys such that are owned...  ?
- container is a central idea,image schema” by which we metaphorically extend our bodily ideas of inside and out onto the world around us. The body being a container of great importance to us, we
correspondingly picture the spatial world around us in terms of containment even when it
is seldom so clear-cut.
- “the function of categorization is to reduce the complexity of the environment”
- complexity of recognition vs of description
- I think this is related to structural type systems (and to typdefs and analytic knowledge), the function of defining a type is to make it easier to use it later, but an "expanded  def" is just the same.
- can an object stop being of a type? Not if dramatic change, eg: a house being demolished, or a potato mashed – we tend to regard such an event as a dramatic change in which, in effect, one object is replaced by another which has little in common with the original.14. Just as, in typical IF situations, an object representing a glass bottle may be withdrawn from play when the bottle is smashed, and an object representing broken glass brought into play to substitute for it. Not only computing convenience. Aristotele's essential vs non-essential properties, and actuality vs potential. https://plato.stanford.edu/entries/essential-accidental/.

- kinds are often "stripped away of all behavior", possible solution:
  - meaning of bird is that it is a “kind of creature” with a collection of what might be called DEFAULT EXPECTATIONS, none certainties: feathers, eggs, fly
  - a "flightless bird" "contradiction in terms" Caves of Steel
  “What is your definition of justice?”
  “Justice, Elijah, is that which exists when all the laws are enforced.”
  Fastolfe nodded. “A good definition, Mr. Baley, for a robot. The desire
  to see all laws enforced has been built into R. Daneel, now. Justice is a
  very concrete term to him since it is based on law enforcement, which is
  in turn based upon the existence of specific and definite laws. There is
  nothing abstract about it. A human being can recognize the fact that, on
  the basis of an abstract moral code, some laws may be bad ones and
  their enforcement unjust. What do you say, R. Daneel?”
  “An unjust law,” said R. Daneel evenly, “is a contradiction in terms.”
  “To a robot it is, Mr. Baley. So you see, you mustn’t confuse your
  justice and R. Daneel’s.”
- not every noun phrase is a kind in inform, this sometimes forces us to use circumlocution if a woman (called the inhabitant) is in a room (called the place), say “[The inhabitant]
is in [the place].”
- kind has to be a widely applicable meaning, about which we can usefully lay down general law, this whether a kind depends on the context (scientific, casual etc...)
- basic vs superordinate kinds: on “What’s that?” For instance, “A chair” more likely than “A piece of furniture”
- Inform’s strategy is to provide the fewest possible kinds – all of them superordinate,
- only have one immediate kind, I think it means: combine the kinds together first, obtain a single composite-kind, then apply it alone to describe an individual thing
- how many arguments
  - 1 to 4
  - optional args: single action with optional arg, compulsory but implicit arg, two wholly different actions
  - stance taken by Inform 7 that at the semantic level all actions have a definite number of arguments.
- importance of converting to dialect of FOL
- binary predicates are important, also comparatives as syntax sugar on top of binary predicates
- aim to test the compatibility of the statements, and also to find the simplest meaning which can be given to the whole


# PLANNER (2-nat-prog, 4-common-sense)
a precursor of Prolog with procedural/logic hybrid planning

https://en.wikipedia.org/wiki/Planner_(programming_language)

Winograd wrote SHRDLU in planner
https://it.wikipedia.org/wiki/SHRDLU 
