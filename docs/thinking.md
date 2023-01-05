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
1. Modify a class
    1. Setting the slot(s) of an existing concept
    1. Creating a concept associated to the class
1. Create a class
    1. idk ...
1. Return a variable
    1. Getting a concept
    1. Getting a property


## Concept

The "cool new abstraction" of the language. 

Allows the end user to do stuff like asserting that a button is **`red, big and round`**, or even **`on this or that div`** without having to specify style.background=..., style.width=..., style.height=... or style.borderRadius=..., or whatever ...

A Concept is associated to a `setter()` a `getter()` and an `is()` method, implanted by the user on an object or prototype.

The appropriate setter or getter is retrieved from an object, based on the predicate that is being asserted about the object (a predicate can be associated to a concept (independenly of any object), otherwise it's just treated as a name/description).

For example "red" is associated to the Concept of color, "big" is associated to the Concept of size, etc...

If the object in question isn't associated to that concept, the predicate is treated as a property.


### The `setter()`

For example `setColor()` or `setSize()` or `setRoundness()` ... they will take a value 





