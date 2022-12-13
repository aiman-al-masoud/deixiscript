SIMPLE CASE: NO DOM EVENTS

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

"LOWER LEVEL" PROLOG INTERFACE, make it synchronous and eager:

assume('red(button).')  // creates a dynamic predicate (assertz)
retract('red(button).') // retracts the clause of a predicate 
predicates(arity:number):string[]
isTrue('red(button).')
query('red(X).')

Maybe ?:

assume(theme:string, rheme:string):void
https://en.wikipedia.org/wiki/Topic_and_comment#Practical_applications


## Applying a new predicate to an entity:

1. Get the predicate from its name
2. Get the incompatible predicates for that predicate
3. Remove all (if any) incompatible predicates from that entity (retract)
4. Apply the new predicate (assertz)

