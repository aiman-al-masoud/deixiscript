= Future Work & Conclusions

We wish to dedicate the last chapter of this work to discussing only some (of the many) possible improvements that could be made to the work we have detailed until now in Deixiscript.

We will end the chapter by some brief considerations and conclusions about this work.

== Syntactic Compression

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

== Semantic Compression

Another thing that we have looked at critically (but still have not explained why)  is the manner in which the predicate "near" was defined in the last code example of the previous chapter (@playerEnemy).

The rule defines the relationship "an enemy is near a player" like so:

```
an enemy is near a player means: 
    the enemy's x-coord = the player's x-coord, 
    the enemy's y-coord = the player's y-coord.
```

The number one problem (looking at this code from a Common Sense perspective) is that the user might expect this predicate to behave "symmetrically" i.e., if it is true at any point that _the enemy is near the player_, it should also be true that the _player is near the enemy_.

Unfortunately, this is not the way Definitions work in Deixiscript. This could _not_ be the way they generally work, given that many more predicates other than "near" have a meaning that is non-symmetrical (e.g. "x is loved by y" does not automatically entail that "y is loved by x").

One could say that the equal sign in the Definition of the predicate "near" is a pretty good indication that the predicate should be symmtrical. This is true, but (as we know) the equal sign has two interpretations in Deixiscript.

When the sentence "the enemy is near the player" is used as a statement (i.e. in TELL mood) we would want/expect that it is the enemy to "move closer" to the player and not vice versa. 

We want this behavior because (in the full example detailed in @playerEnemy) the sentence "the enemy is near the player" is used as a precondition for "the enemy can hit the player", so the most obvious expectation is that it is the enemy to move towards the player and not the player to come closer to the enemy 

If the enemy tries to achieve the goal "the enemy is near the player" by trying to get the player to move and not vice versa, the enemy will never be able to achive its goal of making sure "the player is dead". Although of course if one had the proper kinds of rules, the enemy's strategy could be precisely that of luring in the player maybe using some kind of bait.

We think that a partial solution to this problem could be in two words that we have used repeatedly in the previous paragraphs ("vice versa"). The rule could be written with an extra "vice versa" (optional) clause, i.e.:

```
an enemy is near a player means (and vice versa): 
    the enemy's x-coord = the player's x-coord, 
    the enemy's y-coord = the player's y-coord.
```

This could be used by the 




// spoken ambiguous grammar recognition, ALVIN
// semantic compression (near)
// relative clauses
// past tense
// experimental studies on usability
// game writing


== Voice Interfaces

// We think that a spoken programming language ...

Programming by voice has received attention in the last years from both the commercial and the research sector, as an alternative to the widely popular approach of text-based programming @lagergren2021programming, @arnold2000programming.

This has happened as a result of the increase in acquired disabilities realted to long periods of typing: Repetitive Stress Injury (RSI), which can lead to severe neck ache and back pain @lagergren2021programming, @arnold2000programming.

A Voice User Interface (VUI) is a Human-Computer Interface (HCI) that enables interaction with a computer through an auditive interface. It is usually a complement to the more popular Graphical User Interfaces (GUI), as it is most often seen in virtual assistants, automobile and home automation systems, and the like.

If one could overcome the many challenges behind building a suitable VUI for the task of writing, reading and maintaining code, it would improve the quality of life of many a disabled software developer and/or people interacting with computers that have motor health issues but are nonetheless capable of using speech to interact with such a hypothetical system.

There are quite a few hurdles on this path, some of them are general to the design of a VUI, and some are specifically related to the deployment of such a system for the purpose of programming.

Some of the more general problems are related to: (1) the ephemeral nature of speech as compared to text (it is harder to edit and refine a document using speech) @farinazzo2010empirical. (2) issues in discoverability; or making sure the user is aware of the options available to him/her at any point of using a voice enabled system. (3) issues in transcription: there is a tradeoff between the size of the available vocabulary and the precision with which the words are recognized @farinazzo2010empirical. (4) privacy and noise-related concerns (eg: at a crowded workplace), obviously since everyone in the proximity of the user of a Voice User Interface could hear him/her speak.

Some of the more programming-specific problems are: (1) recognizing keywords and abbreviations in code (at least in "traditional" code) that aren't contemplated by off-the-mill voice recognition software @arnold2000programming. (2) dealing with multiple levels of nesting in programming language structures @arnold2000programming.

There have been multiple attempts at designing voice-enabled programming systems, and the approaches that were taken have been diverse.

One approach, detailed in @arnold2000programming, involves the idea of a Syntax-directed voice editor. A Syntax-directed editor, as the authors of the article explain, takes advantage of the regularities of a formal language to provide automatic completion for common language constructs, saving the user time and typing. 

When applied to voice programming, the authors hypothesize that it can help reduce the mental toil of spelling out loud a potentially convoluted piece of programming syntax character by character. The Syntax-directed editor married to the voice recognition software produces a programming environment that is easy to reconfigure for many different programming languages.

Another project @lagergren2021programming, a little more recent than the one we just mentioned, focused on the idea of applying the Reactive Paradigm (rather than the more traditional Imperative style) to voice programming. 

The researchers' goal was comparing the efficiency of the two paradigms by preparing spoken versions of a set of programs in Java versus RxJava, a library that provides Reactive Extensions to the language.

The Reactive Paradigm is oriented around data flow and the propagation of change. It deals with asynchronous data streams where the data is events and vice versa @lagergren2021programming.

The researchers found out that the Reactive style usually produces longer code in both characters, syllables, and words as compared to the Imperative style. However, owing to the higher expressiveness of Reactive constructs, those words themselves produced more effective work @lagergren2021programming. 

Moreover, those words contained a higher percentage of English-dictionary words, rather than word abbreviations: which are harder to pronounce and harder to be recognized by general purpose voice recognition software; this perhaps owing to the fact that Reactive programming makes less use of temporary variables and short variable names @lagergren2021programming.

A general overview of what it means, practically speaking, to design an effective VUI is given by @farinazzo2010empirical. As already hinted, a VUI is a specific instance of a HCI, and as such it is subject to such general considerations that can be made on the usability of any computer interface.

Some of the HCI general concerns discussed here, are: (1) Providing suitable feedback, (2) Allowing for user diversity (novice vs expert), (3) Minimizing memorization efforts, (4) Error prevention, (5) Error handling, and others.

Some of the more VUI specific ones are: (1) Appropriate output sentences (2) Output Voice Quality (3) Proper entry recognition.

Discoverability, Mixed Initiative and (mutlimodal) output remain some of the key challenging aspects of designing a speech enabled system.

Speech output, especially when enumerating avaiable options, can be slow and tedious, it may therefore be of some benefit to provide an alternative alley for the output of a VUI system: such as a Graphical User Interface when feasible, thus making the system multimodal.

An advantage of spoken systems is that speech is generally considered to be a faster input method than typing: most pepople can speak faster than they can type, at least when speking a natural language.



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