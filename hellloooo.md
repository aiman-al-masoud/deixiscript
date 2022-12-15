## PROBLEM

DRSs that should mean the same thing (and may indeed produce the same side effects) might not be exactly identical.

This is a problem, because saying that "a button is red" and saying that "the color of a button is red" won't have the same meaning, but they SHOULD!

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

### What about theme-rheme?

assume(theme:string, rheme:string):void
https://en.wikipedia.org/wiki/Topic_and_comment#Practical_applications


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
