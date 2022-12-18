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
