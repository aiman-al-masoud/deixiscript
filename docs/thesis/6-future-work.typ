= Conclusions

Before getting to the conclusions, we wish to dedicate part of the last chapter to discussing only some (of the many) possible improvements and extensions that could be made to the current version of Deixiscript.

// We will then conclude the chapter by some brief general considerations about our work.

== Possible Improvements

We propose the addition of Syntactic and Semantic Compression facilities as possible improvements to the Deixiscript language.

=== Syntactic Compression

As we have seen in one of the code examples of last chapter (@playerEnemy) the current version of Deixiscript can produce code that tends to be a little verbose.

We had encountered in the chapter about naturalistic programming (@pegasusCompression) about the concept of syntactic compression, which is listed as one of the mechanisms employed by natural language for redundancy avoidance. 

We think that introducing some syntactic compression capabilities to Deixiscript could help decrease its current verbosity and improve its readability. For instance, instead of writing four almost identical Potential-rules (that differ only in their last word) like the following:

```
an enemy can move right.
an enemy can move left.
an enemy can move up.
an enemy can move down.
```

Deixiscript could instead only accept the following (single) rule, expanding it automatically into the previous four:

```
an enemy can move right/left/up/down.
```

A slightly different kind of expansion could be performed on rules that differ in more than one position, for example the following two rules which differ in two positions (_left_ versus _right_, _increments_ versus _decrements_):

```
an enemy moves right means the x-coord increments.
an enemy moves left means the x-coord decrements.
```

These two rules could be collapsed into the following one alone:

```
an enemy moves right/left means the x-coord increments/decrements.
```

We think that these expansions could be treated as "syntax sugar", so the right place to perform them would be when preprocessing the parse tree (or partially generated Abstract Syntax Tree) before it is really executed by the interpreter.

Perhaps the system could also turn the (expanded) ASTs into some intermediate (human readable) human-readable, expanded version of the code, so that the programmer could verify that the expansion was done correctly.

=== Semantic Compression

Another thing that we have looked at critically (but still have not explained why)  is the manner in which the predicate "near" was defined in the last code example of the previous chapter (@playerEnemy).

The rule defines the relationship "an enemy is near a player" like so:

```
an enemy is near a player means: 
    the enemy's x-coord = the player's x-coord, 
    the enemy's y-coord = the player's y-coord.
```

The number one problem (looking at this code from a Common Sense perspective) is that the user might expect this predicate to behave "symmetrically" i.e., if it is true at any point that _the enemy is near the player_, it should also be true that the _player is near the enemy_.

Unfortunately, this is not the way Definitions work in Deixiscript. This could _not_ be the way they generally work, given that many more predicates other than "near" have a meaning that is "asymmetrical" (e.g. "x is loved by y" does not automatically entail that "y is loved by x").

A possible solution to indicate that a predicate is supposed to be applied symmetrically could be adding a "vice versa" optional clause to a definition (the usage of the phrase "vice versa" is an example of "semantic compression"  as we saw in a previous chapter in @pegasusCompression), this would indicate to the system that the subject and the object could be swapped together without change of meaning.

We would also have to figure out what happens to the body of the Definition in TELL mood, i.e. when "the enemy is near the player" is used as a statement, does it cause the position of the enemy to change to that of the player, or vice versa?


== Possible Extensions: speech
// spoken ambiguous grammar recognition, ALVIN
// relative clauses
// past tense
// experimental studies on usability
// game writing

We suggest that a possible extension to the language that we have designed might be to adapt it to speech, by embedding it into a Voice User Interface (VUI). We have reasons to believe that a spoken programming language could benefit from being built around the principles of naturalistic programming. 

Below we will give a very brief overview of the topic of "voice programming", and why it is has become relevant over the years.

=== The need for speech

Programming by voice has received attention in the last years from both the commercial and the research sector, as an alternative to the widely popular approach of text-based programming @lagergren2021programming, @arnold2000programming.

This has happened as a result of the increase in acquired disabilities realted to long periods of typing: Repetitive Stress Injury (RSI), which can lead to severe neck ache and back pain @lagergren2021programming, @arnold2000programming.

Another advantage of spoken systems is that speech is generally considered to be a faster input medium than typing: most pepople can speak faster than they can type, at least when speaking a natural language.

=== Voice User Interfaces (VUIs)

A Voice User Interface (VUI) is a Human-Computer Interface (HCI) that enables interaction with a computer through an auditive interface. It is usually a complement to the more popular Graphical User Interfaces (GUI), as it is most often seen in virtual assistants, automobile and home automation systems, and the like.

If one could overcome the many challenges behind building a suitable VUI for the task of writing, reading and maintaining code, it would improve the quality of life of many a disabled software developer and/or people interacting with computers that have motor health issues but are nonetheless capable of using speech to interact with such a hypothetical system.

A general overview of what it means, practically speaking, to design an effective VUI is given by @farinazzo2010empirical. As already hinted, a VUI is a specific instance of a HCI, and as such it is subject to such general considerations that can be made on the usability of any computer interface.

Some of the HCI general concerns discussed here, are: (1) Providing suitable feedback, (2) Allowing for user diversity (novice vs expert), (3) Minimizing memorization efforts, (4) Error prevention, (5) Error handling, and others.

Some of the more VUI specific ones are: (1) Appropriate output sentences (2) Output Voice Quality (3) Proper entry recognition.

Discoverability, Mixed Initiative and (mutlimodal) output remain some of the key challenging aspects of designing a speech enabled system.

Speech output, especially when enumerating avaiable options, can be slow and tedious, it may therefore be of some benefit to provide an alternative alley for the output of a VUI system: such as a Graphical User Interface when feasible, thus making the system multimodal.

=== Difficulties in the application of voice to programming

There are quite a few hurdles on this path, some of them are general to the design of a VUI, and some are specifically related to the deployment of such a system for the purpose of programming.

Some of the more general problems are related to: (1) the ephemeral nature of speech as compared to text (it is harder to edit and refine a document using speech) @farinazzo2010empirical. (2) issues in discoverability; or making sure the user is aware of the options available to him/her at any point of using a voice enabled system. (3) issues in transcription: there is a tradeoff between the size of the available vocabulary and the precision with which the words are recognized @farinazzo2010empirical. (4) privacy and noise-related concerns (eg: at a crowded workplace), obviously since everyone in the proximity of the user of a Voice User Interface could hear him/her speak.

Some of the more programming-specific problems are: (1) recognizing keywords and abbreviations in code (at least in "traditional" code) that aren't contemplated by off-the-mill voice recognition software @arnold2000programming. (2) dealing with multiple levels of nesting in programming language structures @arnold2000programming.

=== Syntax-directed voice editors

There have been multiple attempts at designing voice-enabled programming systems, and the approaches that were taken have been diverse.

One approach, detailed in @arnold2000programming, involves the idea of a Syntax-directed voice editor. A Syntax-directed editor, as the authors of the article explain, takes advantage of the regularities of a formal language to provide automatic completion for common language constructs, saving the user time and typing. 

When applied to voice programming, the authors hypothesize that it can help reduce the mental toil of spelling out loud a potentially convoluted piece of programming syntax character by character. The Syntax-directed editor married to the voice recognition software produces a programming environment that is easy to reconfigure for many different programming languages.

=== Voice programming and the Reactive Paradigm

Another project @lagergren2021programming, a little more recent than the one we just mentioned, focused on the idea of applying the Reactive Paradigm (rather than the more traditional Imperative style) to voice programming. 

The researchers' goal was comparing the efficiency of the two paradigms by preparing spoken versions of a set of programs in Java versus RxJava, a library that provides Reactive Extensions to the language.

The Reactive Paradigm is oriented around data flow and the propagation of change. It deals with asynchronous data streams where the data is events and vice versa @lagergren2021programming.

The researchers found out that the Reactive style usually produces longer code in both characters, syllables, and words as compared to the Imperative style. However, owing to the higher expressiveness of Reactive constructs, those words themselves produced more effective work @lagergren2021programming. 

Moreover, those words contained a higher percentage of English-dictionary words, rather than word abbreviations: which are harder to pronounce and harder to be recognized by general purpose voice recognition software; this perhaps owing to the fact that Reactive programming makes less use of temporary variables and short variable names @lagergren2021programming.

=== Natural Language and Voice

The authors of the paper "Voice-commanded Scripting Language for Programming Navigation Strategies On-the-fly"

We think that natural language would be the _natural_ choice for a spoken programming language. 

As the authors of 


== Conclusions

All in all, we think that the importance of natural language in the field of programming (and computer science as a whole) will grow in the years to come

// Usability Tests are necessary




// % TODO: cite ALVIN 
// % TODO
// % https://www.typingmaster.com/speech-speed-test/
// % https://en.wikipedia.org/wiki/Speech_tempo
// % https://typing-speed-test.aoeu.eu/
// % https://en.wikipedia.org/wiki/Words_per_minute
// % https://en.wikipedia.org/wiki/Repetitive_strain_injury
// % https://en.wikipedia.org/wiki/Eye_strain
// % https://en.wikipedia.org/wiki/Voice_user_interface
// % https://userguiding.com/blog/voice-user-interface/ 