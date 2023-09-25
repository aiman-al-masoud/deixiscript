# Functional Programming

While it is a tenet of OOP that state should be hidden behind objects, Functional Programming takes the more radical approach of abolishing state (aka: mutable state) altogether from most of the codebase, isolating it from the core logic.

Pure functional programming is a declarative...

A very concise way of defining pure FP is that it is about: Pure Functions and immutable data structures.

A pure function is a function whose output depends entirely on its inputs (referential purity) and whose evaluation does not alter the state of any data structure (absence of side-effects).

An example of an impure function would be, for example, anything that has to do with I/O, like even a simple print function.

As a consequence of this, FP bans the use of iteration and iterative control flow strcutures such as loops: because they require mutable variables, and only makes use of recursion as the basic way of repeating instructions; but it builds numerous higher level abstractions on top of it, many of which (functions as first class citizens and higher order functions) have since made it into most mainstream programming languages.

In theory, FP and OOP are compatible to a large extent (cf. Scala) and it is possible to write a program using immutable objects which respects the rules of both paradigms to a large degree.

Functional programming takes most of its ideas from lambda calculus, a field of pure mathematics.

https://en.wikipedia.org/wiki/Functional_programming

https://www.amazon.com/Functional-Programming-Simplified-Alvin-Alexander/dp/1979788782