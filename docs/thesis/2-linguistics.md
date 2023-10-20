# All Grammars Leak

Edward Sapir, 19/20th century linguist famous for the Sapir–Whorf hypothesis on linguistic relativity once wrote: 

> Were a language ever completely "grammatical" it would be a perfect engine of 
> conceptual expression. Unfortunately, or luckily, no language is tyrannically
> consistent. All grammars leak.

https://en.wikiquote.org/wiki/Edward_Sapir

This is to say that it is highly unlikely that we will ever come up with a grammar that perfectly describes all of the nuances of how a real natural language is actually used in day to day speech, especially not in this thesis, but compromises need to be made if we want to be able to run this naturalistic language on a machine in the manner of a more traditional programming language.

# Analytic vs Synthetic

The analytic vs synthetic distinction has more than one linguistical definition because it relies on the fuzzy concept of "word". There are diachronic interpretations of what is means for a linguistical construct to be analytic or synthetic. A third category is agglutinating.

[Diachronic Interpretation](../../attachments/analytic-and-synthetic-typological-change-in-varieties-of-european-languages.pdf)

The simple idea, using the "intuitive" idea of "word", is that an analytic grammar isolates morphemes (ie: basic units of meaning) into separate words, agglutinating grammar sticks them together without changing them, and a synthetic grammar sticks up multiple morphemes in the same word while also attributing multiple meanings to the same morpheme.

Languages can be more or less synthetic/analytic. The more synthetic the language, the more complex its morphology (ie: word building rules) and the more flat its syntax (ie: word order).

Conversely, if a language is more analytic and thus has a simple morphology, it can make up for it with a more rigid syntax.

An example an analytic language is Chinese, one of a highly synthetic language is Latin and one of an agglutinating language is Turkish.

The same language can have multiple roughly equivalent "competing" synthetic and analytic constructs that express a similar meaning, an example in English is the usage of the preposition "of" **(the x of the y)** versus the usage of the Saxon S **(y's x)** to mark the genitive case (ie: an owner-to-owned relationship).

An analytic grammar has clear implementational advantages over a synthetic one: each symbol corresponds exactly to one morpheme, and the morphemes are conveniently separated in different words, which simplifies the implementation of the lexer.

English is traditionally considered a synthetic language, although it tends towards the analytic side of synthetic spectrum. It is therefore easy enough to define a usable subset of English which is purely analytic.

These guys say dependency parsing is better for rich morphology:
[](../../attachments/dependency-parsing.pdf)

But these guys state the opposite!:
https://www.geeksforgeeks.org/constituency-parsing-and-dependency-parsing/

We will therefore propose a simplified grammar that is an (almost: yes, it leaks a little) correct subset of English. It is rigid enough to be specified in a few production rules, but flexible enough to support implicit references and syntactic compression.


Deep grammar vs shallow grammar?

We will begin by saying that the core of the language is actually not defined as EBNF (Extended Backus Naur Form) production rules or anything of the like, but rather as a set of pure AST (Abstract Syntax Tree) types, represented as Python dataclasses: this has the advantage of not tying the core of the language to any specific "linearization", "frontend" or "dialect", but rather to leave that as open ended as possible.

[language](../../../src/core/language.py)

The main distinction is made between noun phrases and sentences. There is also a vaster category of constituents that could be either "noun phrasish" or not depending on the sub-constituents they contain.

A noun phrase can be "implicit" or "explicit"...

- [Choosing the Constituents]()
- [noun-phrases]()
- [relative clauses & gapping]()
- [simple sentences]()
- [compound and complex sentences]()

implicit references may be ambiguous from the point of view of creating a new thing, or erroring out if you don't find an old one. "A mouse which has the/a house as location". The solution is to wrap a nounphrase in a Command wrapper.


everything the user says will be assumed to be Implicit and Idiomatic, but explicit ids and ad-litteram sentences need to be considered at a certain point during the execution in the interpreter.



## Drawing a parallel with programming language structures

[programmatic semantics](../../attachments/programmatic-semantics.pdf)
[](../../attachments/a-survey-of-naturalistic-programming-techniques.pdf)

But:
- noun-phrases: expressions, constructors => point to things
- simple sentences: statements, procedures => point to actions, propositions or truth values

- Assignments are completely replaced by anaphora (implicit references), also in
  theme-rheme phrase style split in two sentences, also useful for intermediate
  numerical computations.

- Implicit References + Derivation Clauses can also be used to replace
  if-statements, because one big function with lots of ifs can be expressed as
  lots of small derivation clauses with naturalistic type (implicit reference)
  arguments declared on the fly.


- Verbs aren't functions, verbs are procedures. Noun-phrases (including implicit
  references) are expressions, and thus are much more akin to expressions/functions.

- All verbs need to be prefixed with a helper/auxiliary (do/does) to let the (basic) parser know they're being used as verbs.


Parsing is any process that transforms a sequence of symbols, which is a linear, monodimensional structure (such as a string of text or a snippet of speech), into a bidimensional, hierarchical structure, typically a parse tree or an Abstract Syntax Tree, "abstract" because it preserves less of the minute syntactical details. This is something that our brains do remarkably well, so much so that we're seldom conscious about it. It is quite different when it comes to implementing a similar process by hand in a programming language.



--------------


> From: Language and Communication Problems in Formalization: A Natural Language Approach (Alessandro Fantechi et al)

# Syntactic

They all mostly have to do with unclear associativity.

## Analytical Ambiguity
“software fault tolerance”, can be tolerance to software faults or fault tolerance achieved by
software.

* (software fault) tolerance
* software (fault tolerance)


## Attachment Ambiguity
“I go to visit a friend with a red car” means either that I go with the red car or that the friend I’m visiting has a red car.

* (I go to visit (a friend with a red car))
* (I go to visit (a friend) (with a red car))


## Coordinator Ambiguity
“She likes red cars and bikes”, where it is not clear whether she likes all bikes or
only red ones (two coordinators in a sentence)

* She likes (red (cars and bikes))
* She likes (red cars) and (bikes)


# Anaphoric Ambiguity

Which antecedent does a noun phrase point to?

(+ Cataphoric and Deictic in general)

# Vagueness

Leads to loose interpretations, especially when quantities are involved. "many/few"... Temporal ambiguity is a special case.

# Comparatives and Superlatives

Comparatives without a comparison term. Superlatives with an unclear context.

# Disjunctions

Special case of coordinator ambiguity. In the case of a sentence with side-effects, which branch of the OR should run?

# Escape Clauses

“The system, if possible, updates the data every 2 h”. Makes a requirement weak, vague or unverifiable. 

# Usage of a Weak Verb

"May" or "may not" ...

# Quantifiers

“All pilots have a red car”

* "All" pilots in what context?
* The same, shared, red car; or a different one each?
* Does it describe the general concept of a "pilot", or every individual pilot? (Machines Like Us)

# Underspecification

generic term that lacks a specifier.

“It shall be possible for the driver to store numbers in the radio”

What numbers? Related to anaphora, because it could be resolved by context.

# Passive Voice

The doer of the action may be omitted.

