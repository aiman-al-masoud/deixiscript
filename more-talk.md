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


