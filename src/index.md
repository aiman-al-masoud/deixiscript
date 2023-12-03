# ASTs

- nounphrase: implicit-phrase, string, num, bool, genitive, variable, pronoun
- expression: idea, nounphrase, mathexp, logicexp, assignexp, compareexp
- statement: def, order, potential, repeat, prog

# FACTS & EVENTS

## Similarities

Events and Facts are collectively known as "Ideas". Facts and Events are both represented by simple sentences; those simple sentences have to be defined (or else they have no meaning), and the meaning can be applied as TELL (changing the world model) or as ASK (just checking if already true). A simple sentence has: a subject, an (optional) object, and a predicate (a non-copular verb in case of an Event, an adjective in case of a Fact).

## Procedural Interpretation

Facts and Events can be implemented as functions/procedures. When running an Event (or a Fact in TELL mode) you just care about the side-effects on the world model. When you run a Fact in ASK mode, you care about the return value (true or false). 

There is no such thing as an Event in ASK mode; for instance: "the enemy moves right?" is considered a nonsensical question, because there is no tense attached to the sentence. On the other hand, the question: "the enemy is near the window?" is perfectly fine, because it refers to the present tense and to a static state of affairs.

## Differences

Events can be performed by an agent, Facts cannot. For example: an agent can "move right/left" but an agent cannot "be near the window".

Facts have no duration, Events have a duration. For instance: it takes X seconds to move right/left, but it is considered nonsense to say that "it takes X seconds to be near the window". In any case, an agent can achieve a goal (which is a state of affairs: a Fact) by performing Events.

There is an equivalence between Facts and noun phrases with adjectives, because a Fact uses a predicative adjective, and a noun phrase uses an attributive adjective, and the meaning of predicative and attributive adjectives is assumed to be equivalent. For instance: the adjective "red" in "a red cat" and "a cat is red" has the same meaning.

An adjective can be negated, for instance: "a non-red non-hungry cat".

## Discerning Events

Any Idea is assumed to be a Fact. It "becomes" an Event when it is associated to a Potential, ie: when some agent can do it (can cause the Event to happen). A Potential defines the preconditions and the duration of a kind of Event (associated to an Idea template). A precondition can be as trivial as "always true".

## Obeying Orders

An order instructs an agent (represented by a noun phrase) to accomplish a goal (which is just any expression, it may be a Fact).

# Knowledge Base (KB)

A Knowledge Base stores the World Model (WM), the Short Term Memory (STM) and the list of Defs, Potentials and Orders.

## World Model (WM)

The world is modelled as entities and their properties. There is a list, the list contains "individuals". An index of the list is the ID of an individual. Each "individual" is a bundle (dictionary) of properties. There is one compulsory property called "type". If an entity is destroyed, it needs to be replaced with a placeholder (so as not to alter the IDs).

```js
[{type:'cat', color:'red'}, {type:'cat', color:'black'}]
```

Each object can have a single value for a given property, while this is limiting, it makes it easier to implement read/write buffers.

# EXECUTION OF A PROGRAM

1. Defs and Potentials hoisted up.
2. Create/initialize entities and their properties (WM).
3. Enter main loop (which deals with orders). User can also optionally inject code (questions or statements).

-	run main loop:
	- for each entity (meaning for each order) compute a plan with fixed duration equal to CLOCK_FREQUENCY
	- execute the plans
	- wait for CLOCK_FREQUENCY (handle time it took to recompute??)
	- update the GUI (or call listeners or whatever)

# PLAN

1. if max duration exceeded, return error!
2. if goal is already accomplished, return list of steps.
3. search for steps

- search for steps
	1. TELL order's goal to current KB, create new "target" KB
	1. compute global world-model error
	1. get potentials of agent (what it can do AS A SUBJECT)
	1. for each potential: if error decreases, add to list
	1. you now have a list of possibly relevant potentials
    1. if list is empty, return error!
	1. if agent still can't do something, issue intermediate orders
	1. if agent can do everything, just add events to list of steps and
	update the plan's duration (get it from potentials).


# MATCH

Syntactic (only) match between two ASTs. Produces a mapping (a dictionary) of AST to AST. In case of no match, the dictionary is empty.

Maybe a var should match everything except for another var (a var with a different name).

# Noun Phrases

When a noun phrase is executed, it can either create an appropriate individual in the Knowledge Base (TELL), or resolve to the ID of an appropriate already-existing individual (ASK). A constant noun phrase cannot create anything (no TELL), it can only resolve to itself.

EVAL calls ASK or TELL, based on the value of the CMD flag in an AST. A copy of an AST can be created, the copy may be created with a different CMD flag. The CMD flag can be turned off recursively via a "kill-switch method". 

Every implicit noun phrase can resolve at most to a single ID (can point to a single referent). In case this isn't possible (due to ambiguity), an error should be returned.

In all cases, the Short Term Memory (STM) should be updated.

# Nouns vs Strings

- the enemy moves right
- the enemy hits the player

The word "right" is not supposed to be resolved to an ID, but treated like a (constant) string. On the other hand, the noun phrase "the player" has to be resolved to an ID. How to distinguish between these two cases? The easiest way for now is to require an article (the/an/a) in the latter case.

# Orphaned Properties in Definitions

Just a property name (without any explicit owner) may be used in the definition part of a Def, if there is no ambiguity, such as: "a player is dead means: health = 0", where "health" or "the health" is a property implied to be of the player (the subject).

When adding a new Def to the Knowledge Base, you will need to perform the following substitution:

- PROP   -> the SUBJECT's PROP

For instance:

- health -> the player's health

In case the sentence contains an object alongisde the subject, error out for ambiguity. More sophisticated strategies are also possible.

Note that strings (not just implicit phrases) are also treated as props. **Problem: this also happens to strings that happen to be used as right values (they're expanded to SUBJECTS's STRING)**.

# PRONOUNS (Deixis)

1. A pronoun **must** refer to one of the (max 4) noun phrases in the STM. When evalutating a sentence (Idea) with a pronoun, try substituting the pronoun by a noun phrase from the STM until you get a match. If there is no match, then the sentence is ambiguous!

2. This can also apply to a Genitive phrase with a pronoun as the owner.

A pronoun in a Def must refer to the subject.

# WM, STM and Disambiguation

Any two individuals in the WM must be distinct by at least one property (the index is NOT considered a property). 

Storing "specific enough" noun phrases in the STM must be equivalent to storing IDs. For instance (suppose there are two cats, and suppose STM is initially empty):

- "the cat" -> error, "the cat" may refer to two distinct individuals.
- "the red cat" -> returns ID=1 (suppose) STM stores "the red cat".
- "the non-red cat" -> returns ID=0, STM throws away "the red cat" and stores "the non-red cat"
- "the cat" -> returns ID=0, STM keeps "the non-red cat"
- "the red cat" -> returns ID=1, STM throws away "the non-red cat" and stores "the red cat"
- and so on...

The STM has a maximum size (4 elements). The Knowledge Base has the STM. 

When the Knowledge Base is queried (with a noun phrase) the Knowledge Base gets all of the matching IDs. If there is only one matching ID, the STM is updated and the ID is returned. If there are multiple matching IDs for a noun phrase, then you check if the STM has a matching noun phrase, and you use that to disambiguate, in case there is no matching noun phrase in the STM then you error out (for ambiguity).

Updating the STM: the STM is a list, insert the new noun phrase at the beginning of the list, and make sure the new list is smaller than max size (throwing away the last element if necessary). If the new noun phrase is less specific than any of the ones already present, then LEAVE STM UNCHANGED.

When the Knowledge Base receives the order to create a new individual (with a noun phrase) the Knowledge Base checks if there are existing individuals matching the noun phrase and errors out if there are. Otherwise, it creates a new individual and updates the STM.

Similarly, Knowledge Base handles read/write accesses to properties.

Problem: at the moment of creation, an individual "X THING" is still just a "THING", because ajectives are added later. But if there are other preexisting "THINGs", this prevents from ever selecting the right "THING" when trying to apply the adjectives!!! You can't use IDs to refer to the newly created individual, because you may not pick the right rule. Solution: Have a special wrapper AST "TypeCast"/"TreatAs" that matches the specified type but evaluates to whatever arbitrary noun phrase it was given (such as an ID).

# EXAMPLE PROGRAM

```
after x's y increments, y = y + 1.
after x's y decrements, y = y - 1.
an enemy can move left/right/up/down.  // syntax sugar
enemy can hit player, if enemy is near player.
enemy is near player, means player's x-coord = enemy's x-coord, 
                            player's y-coord = enemy's y-coord.
player is dead, means health = 0.
after enemy hits player, player's health decrements.
after enemy moves right/left, x-coord increments/decrements.
after enemy moves up|down, y-coord decrements|increments.
player's health = 4.0.
player's x-coord is 3.0.
enemy's x-coord is 1.0.
player's y-coord is 3.0.
enemy's y-coord is 1.0.
```

# MISCELANEOUS
- There is no "which", therefore no transitive/intransitive verb gaps problem for now.
- swapping r-val and l-val makes all the difference (also in planning) eg: the enemy's x-coord = the player's x-coord or vice versa.
- rules need to be declared in order if they depend on each other
