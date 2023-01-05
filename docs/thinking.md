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











