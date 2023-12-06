= Future Work & Conclusions

== Voice Interfaces

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

// We think that a spoken programming language ...

// spoken ambiguous grammar recognition, ALVIN
// past tense

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