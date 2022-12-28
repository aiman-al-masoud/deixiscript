# Semantics: Old Idea

Based on a mapping between verbs and methods, and between nouns and objects. TDLR: verbs are method wrappers and nouns are object wrappers. Verb arguments are mapped over method parameters through prepositions + direct object.

> the first array concatenates with the second array

```
Predicate 'concatenate'

maps to: Array.concat
args: with <other array>
```

> when the user clicks on the button, it becomes red.

```
the user -> standard input (add new event listener)
click -> onclick(), with parameter on=
the button -> an html button
it -> the button
become -> a predicate that assigns new properties to existing entities
red -> css color
```

> if the button is red, then the ...


Verbs -> methods
Verb Args (including subj, obj, compls) -> method params
Nouns -> objects
Adjectives -> object (even nested) attributes

run(predicate, object)



## Enhancing ISO Prolog

### Parametrizing Predicates

To be able to retrieve all unary and binary relations an object participates in, treat the predicate as an argument:

```
instanceof(object, classname)
paratecipatesin(relation, object1, object2)
```

### Logical Negation

Negation in standard Prolog is negation as failure (aka: "closed-world") negation. To obtain "open-world" (aka: logical) negation:

```
not(instanceof(object, classname))
```

|   Q	    |   not(Q)	|   is Q true? |
------------|-----------|----------------
|   yes	    |   yes	    |   error!      | 
|   yes	    |   no	    |   yes         |
|   no	    |   yes	    |   no          |
|   no	    |   no	    |   undefined   |


### Contraddictions

To check for contraddictions:

```
error(X) :- not(X), X.
```

## What about theme-rheme?

assume(theme:string, rheme:string):void

https://en.wikipedia.org/wiki/Topic_and_comment#Practical_applications

theme-rheme is not a good idea at all!

entities in the rheme could be already existing, and entities in the theme may still not exist, as show in the example.

It only works well for very simple cases where the theme contains an entity that already exists and the rheme only contains new stuff...


Instead...


Create a small prolog sanbox and dump all of the clauses in there.

For each entity, get every rule that concerns it.

Search for that entity in the larger global prolog env.

You should obtain a MAPPING between ids of the entities in the sandbox and ids of the entities in the larger prolog env.

For entities that do not exixst yet in the global prolog env, you will generate a new id.

Ids that are variables should be left untouched.


## PROBLEM

DRSs that should mean the same thing (and may indeed produce the same side effects) might not be exactly identical.

This is a problem, because saying that "a button is red" and saying that "the color of a button is red" won't have the same meaning, but they SHOULD!

> `>` the button is red
>
> `>` is the button red?
>
> true
>
> `>` is the color of the button red?
>
> false // WTF?!

> `>` the color of the button is red
>
> `>` is the button red?
>
> false // WTF?!

### Possible Solutions

#### 1 Concepts

Every adjective will point to a concept, eg: (red, green, blue ...) point to "color", (fast, slow ...) point to "speed".

Every concept will also have links to its adjectives.

1 Concept <---> N Adjectives


If the adjective is used directly:

> the button is red

```
red($button)
```

then the concept can be retrieved, and this can be added:

```
color(1)
red(1)
of($button, 1)
```

If the concept is mentioned:

> the color of the button is red

this is the initial DRS

```
color(1)
red(1)
of($button, 1)
```

But this is also added automatically:

```
red($button)
```








## SIMPLE CASE: NO DOM EVENTS

Input 1:
first button is black
second button is black
second button is red if first button is red

```
black(button1)
black(button2)
red(button2) :- red(button1)
```

Actuator receives changes on individual buttons and colors both buttons black.

Input 2:
second button is red

Brain should realize that the first button just became red as well, and also that color predicates are mutually exclusive...

Actuator receives changes and repaints


## TO PRODUCE LIST OF CHANGES FOR ACTUATOR:

1. list all known predicates from session.rules()
2. for each known predicate get all objects that satisfy it
3. save them
3. [apply changes](#applying-a-new-predicate-to-an-entity) 
4. repeat 1,2
5. compare with 3, obtain difference 



## Applying a new predicate to an entity:

1. Get the predicate from its name
2. Get the incompatible predicates for that predicate
3. Remove all (if any) incompatible predicates from that entity (retract)
4. Apply the new predicate (assertz)



## FOR DOM EVENTS

eg: if the button is pressed the div is red

Brain adds this implication straightaway:

```
red(div) :- pressed(button)
```

Brain checks if condition part `pressed(button)` implies listening to an element of the DOM.

If it does, brain adds an onclick listener that asserts/retracts a predicate pressed (aka: clicked) on the id representing the button.






## STUPID EXAMPLE

A button is on the page.
The counter is 0.
If the button is clicked then the counter increments.
The body is green if the counter is even.
The body is red if the counter is odd

## ADDING LISTENERS 

Add all possible listeners at moment of creation of the button (or any other DOM element).

## MINIMAL ONTOLOGY

button
click
body
color
red 
green
number
even
odd
increment


## Two aspects of ontology:

1. purely logical relationship between concepts and properties.

2. binding between concepts/properties and javascript classes/attributes.


## Two kinds of clauses

1. Ideas

"The body is red", "every button is red" ...


2. Events 

"The counter increments"

this one triggers an action by the Actuator (javascript) and doesn't really change anything in the Brain (prolog).


## HOW TO HANDLE "Ideas"

1. get new clause
1. get entities in new clause
1. get full descriptions (all one-arg predicates that apply to each entity)
1. run clause
1. check for contraddictions, remove old facts
1. get new full descriptions
1. get symmetric difference between old and new descriptions
1. pass it down to actuator


## Example

1) x is a button.

```
be(f0, id0, x).
be(f1, id0, button).
```

Actuator creates a new button and **adds a listener for all known properities (click...)**.

2) every button is red.

```
be(_, S, red) :- be(_, S, button).
```

IMPLIES THAT:

```
be(_, id0, red).
```

Actuator makes the button object corresponding to id0 red.

3) if the button is clicked then the button is green

```
be(_, id0, green) :- be(_, id0, clicked).
```

Actuator does nothing because there are no changes.

4) [[the button gets clicked by the user]]

Actuator sends ```be(_, id0, clicked)``` to Brain, which infers ```be(_, id0, green)``` and sends it back to the Actuator, which turns the button object green.

If the Brain finds a contraddiction, it deletes any facts associated to the 
oldest fact-id with retractall(be(oldfid, _, _))).

A contraddiction is defined like so, for example:

```prolog
error(F1, F2) :- be(F1, S, green), be(F2, S, red).
```

**A contraddictions is: two facts that cannot be true simultaneously.**


If this were the case:

```prolog
be(f0, id0, red).   
be(f1, id0, green). 
```

The brain would find that:

```
error(F1, F2).
```
```
> F1 = f0
> F2 = f1
```

The oldest fact would be deleted:

```
retractall(be(f0, _, _)).
```



-----------------------------

What part of ontology.md needs to be translated into prolog?

* Facets of a Slot
* class hierarchy 



-------------------------------

Red, Green and Blue are builtin objects in the environment.

 

