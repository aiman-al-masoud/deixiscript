A variable (aka: entity) (top-level or not) can have:

1: concepts, for which specific getters and setters are available. They are cool new abstractions of the language.

2: properties, which are just regular js attributes, they are for js-interop and bootstrapping reasons.

```
color of x
```

may refer to the concept, in case x has a 'color' concept associated to it, or it may simply refer to a 'color' property on x.


What can a language statement do?

1. Create a variable
    1. Using a cons associated to a predicate
1. Modify a variable
    1. Setting the slot(s) of an existing concept
    1. Creating a concept associated to the var
    1. Setting a property
1. Associate a predicate to a Concept
    1. "big is a size", "red is a color"
1. Modify a class
    1. Setting the slot(s) of an existing concept
    1. Creating a concept associated to the class
1. Return a variable
    1. Getting a concept
    1. Getting a property
1. Create a class
    1. idk ...


## Concept

The "cool new abstraction" of the language. 

Allows the end user to do stuff like asserting that a button is **`red, big and round`** (Color, Size, Roundness), or even **`on this or that div`** (Position) without having to specify style.background=..., style.width=..., style.height=... or style.borderRadius=..., or whatever ...

A Concept is associated to a `setter()` a `getter()` and an `is()` method, implanted by the user on an object or prototype.

A predicate can be associated to a Concept (independently of any object).

The appropriate setter or getter is retrieved from an object, based on the predicate that is being applied on the object. 

For example "red" is associated to the Concept of color, "big" is associated to the Concept of size, etc...

If the object in question isn't associated to that concept, the predicate is treated as a property.


### The `setter()`

For example `setColor()` or `setSize()` or `setRoundness()` ... they will take a predicate (red, big, round ...) as an argument and do something to the object they're invoked on.

They can take multiple args, if the predicate in question has arguments ("on the div") where the predicate is "on".



A predicate can be associated to a Concept or to a constructor.


big is a size.
big is 100vw.

the button is big.



A predicate must be associated to a Concept, as well as a value for that concept sometimes.???



WHEN the button is red ... WHEN the counter is 10 // express TIMES! times as first citizes...

places:

the button is where the div is

the button is on the div





Would be cool:


if any button is big then
	its width is 100vw and
	its height is 100vh and
	its font size is 100em



VARIABLE LEVELS OF ABSTRACTION

VERY 'LOW LEVEL', FOR RAW JS-INTEROP

the background of the style of x is red.

the width of the style of x is 100vw.


INTERMEDIATE LEVEL

the width of x is 100vw.

Simple Aliasing could come handy in this case, you could do something like:

the width of any button is the width of its style. ---> defines alias


Other example:

the background of the style of x is red.

the color of any button is the background of its style. ---> define alias

the color of x is red.

But in this case we also wanna be able to say:

x is red.

red belongs to at least one concept ("color"), the fact that red belongs to the color concept allows x to pick the right property/alias.


Mechanisms:

* property aliasing (eg: 'style.width' is simply 'width').
* concept-grouping of predicates, where a concept relative to an object is simply mapped to a single property or an alias (let's start simple).
* A predicate may be mapped to more than one concept.

This mechanism can be later incorporated into a more general setter/getter logic.

Algo:

"the color of x is red"

1. check if x has a property 'color'.
1. else check if x has an alias 'color'.

in case of "x is red"

1. get the concept of 'red' and use it to set the relevant prop/alias

"the background of the style of x is red"

1. check if x has the style.background property


































