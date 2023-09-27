The language of the code is Python (specifically version 3.10), annotated with type-hints and type checked by the Pyright static type checker.

Tests are performed with the Pytest framework.

The bulk of the code will adhere to a Functional Programming style: immutable objects and pure functions.

The English subset will be interpreted rather than compiled.

The core components of the interpreter will require no dependecies besides Python's (included) standard library.

The code will be available under GPLv3 for inspection and future research.

- Functions tell() and ask() do NOT have ANY side effects (like most other
  functions). tell() and ask() both return a brand new knowledge base object,
  because even ask() may produce updated versions of the deictic dictionary and
  add newly computed numbers to the world model. Pure functions and immutable
  data structs whenever possible.

What follows is an overview of packages and modules. TODO.

- core
- parser
- main


