TOTAL 22 mins

# Greetings & Title

Good morning everyone. The title of my thesis is: Deixiscript: Exploring and Implementing a Common Sense Approach to Naturalistic Programming.

# Naturalistic Programming: what is it, why is it relevant

Broadly understood as attempt to write computer code in subset of natural language.

Natural language (despite apperences) is intricate system. Up until recently never seen wide usage in programming.

Natural language can be ambiguous and verbose. Attempts to use it for programming have been widely disregarded. Prominent critics such as Edsger Dijsktra [SHOW QUOTE].

Reasons to think that status quo is about to change drastically. 

Introduction of Large Language Models (LLMs), and Prompt Engineering and AI-Assisted coding. Rapidly changing the way programmers write code.

Matt Welsh, a computer scientist, predicts that in the arc of 10 to 30 years the whole field of computer science won't be remotely recognizable. 

Traditional programming languages may become (virtually) extinct.

Benefits: more people will be able to do more things with computers. 

Problems: legal, economic change.

From purely scientific viewpoint: it's hard to be content with developing larger and larger deep learning black boxes.

Eminent linguists and thinkers (Noam Chomsky) have expressed doubts regarding LLMs' capacity to model language acquisition in humans. 

LLMs learn artificial languages just as easily.

From our point of view: paramount to understand how natural language is better (and how worse) than programming languages at describing computer programs.

# Programming Languages History

Just like natural languages, programming languages change and evolve [SHOW TIMELINE OF IMPORTANT PROGRAMMING LANGUAGES].

A Programming language tends to follow a programming paradigm (and some are multiparadigm).

The four most popular paradigms of all times: procedural, functional, object oriented and logic. 

Paradigms in turn can be classified as declarative or imperative.

Imperative programming is about telling computer how to do something. Declarative more about the what, leaving details out.

# The need for naturalistic programming

Programming languages are precise.

But there is tradeoff between the precision and the expressiveness of a language. 

[DESCRIBE GRAPH OF CONTROLLED NATURAL LANGUAGE SURVEY].

Also issue of semantic gap.

[DEFINE SEMANTIC GAP].

Semantic gap often causes unclear/obfuscated exposition of ideas in code. 

Some researchers call this: "the scattering of ideas".

Disproportionate effort to understand simple logic expressed in a programming, versus a natural language.

Improvement is possible.

Aspect Oriented Programming increases modularity of code by separation of cross-cutting concerns. Similar to referential capabilities of "chapters" in a book.

# Existing Work (maybe timeline)

There has been substantial work in field of naturalistic programming. We mention a few.

Pegasus: 2006, general purpose system, allows context dependent implicit references, syntactic/semantic compression, uses language independent notation under the hood.

CAL: 2006, English compiler, implemented in CAL itself, more procedural style.

Inform 7: 2005/2006, for interactive fiction, wider usage, has past tense, is also  slightly context dependent, rule-based with circumstances, recently open sourced (2022).

SN: 2019, more formal-looking than the others, naturalistic iterators through introspection.

Metafor: not full system, generates scaffolding code, uses common sense knowledge from big Open Mind corpus. storytelling

Literate programming: from the 80's, not single language, approach, by Donald Knuth, code for humans not for machine, markup+programming language.

# Naturalistic Ideas

Some general ideas from the surveyed languages.

Implicit reference: using noun phrases rather than variable names.

Implied Knowledge: context dependent resolution of noun phrases [DISCUSS TABLE/BALL EXAMPLE].

Revisable rules: (and defaults) revise assumptions made about general class when talking about specific class. More drastic than OOP (which has Liskov limitation).

Liskov: any property that holds for a superclass should still hold for a subclass.

Error handling: (as Inform 7 Graham Nielsen says) should happen in natural terms, should give suggestions. We may say: "speak the user's language" (Jakob Nielsen's 10 usability heuristics).

High-leve/Low-level integration: allows to relate high-level knowledge to low-level details. As creators of CAL say: like a maths textbook. Formal code interspersed in natural language. Also like Literate Programming.


# Common Sense in relation to naturalistic programming

There is relation between common sense in AI and naturalistic programming.

[DEFINE COMMON SENSE IN AI]

Early usage of term by John McCarthy in paper.

Common Sense is hard compared to narrow problem solving (such as chess).

[LIST OUT SIMILARITIES WITH NATURALISTIC PROGRAMMING]

AI approaches can be seen as a kind of declarative programming.

Automated planning: Intelligence is seen as ability to achieve goals, so planning is needed.

# Criticism of natural language programming

[LIST OUT CRITICISMS]

# Deixiscript

[SEE SLIDES]

# Implementation Details

[SEE SLIDES]

# interpreter pattern

[SHOW UML DIAGRAM]

Terminal (leaf) vs Compound expressions.

Same interface.

Solve (or "eval") method that takes context.

Terminal evaluates to itself.

Compound evaluates children, then applies further logic.

Result returned. Context is modified if needed.

In our case, new context object is returned (functional approach).

# Simple Sentences

[SEE SLIDES]

# noun phrases
    -
# Syntactic matching
    - Definitions
# Knowledge Base
    - world model
    - short term memory
# Orders and planning
    - facts vs events
    - potentials
    - search heuristic
# Pronouns Example
# Fish Example
# Player/Enemy Example
# Player/Enemy/Defender Example
# Improvements
    - syntactic compression
    - semantic compression
    - better heuristics
# Extensions
    - voice programming
# Final Remarks
    - natural language will grow in importance
# Thank You!


<!-- 
Image Sources
https://www.javatpoint.com/what-is-machine-language
https://www.discovercoding.ca/hello-world-mips-assembly/
https://it.wikipedia.org/wiki/Fortran#/media/File:Fortran_acs_cover.jpeg 
https://www.iconfinder.com/icons/109573/dead_fish_pollution_raw_simple_waste_icon
https://www.onlinewebfonts.com/icon/499063

https://www.spreadshirt.ie/shop/design/bird+silhouette+mug-D5e04f1dc2225094733b7e163?sellable=lzAQD1LeVvsGZ19RzLgq-31-32
https://www.cleanpng.com/png-bird-png-54892/preview.html
https://www.hiclipart.com/free-transparent-background-png-clipart-oypba/download

https://upload.wikimedia.org/wikipedia/commons/a/ac/Green_tick.svg
https://similarpng.com/red-cross-mark-icon-on-transparent-background-png/
-->


