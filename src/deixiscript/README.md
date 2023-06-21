# What is LLang missing to become Deixiscript?

## Core Features

- integrating anaphora
  - done, but:
  - what if findAll() finds many?
  - refactor test()!!!
  - every/and/or
- mathematical operations
  - introduced by letting test() return other than boolean
  - must refactor... (good) repercussions on anaphora
  - is MathExpression an Atom ??!
- full dump()
  - dump full knowledge base (including derivation clauses)
  - if-else
  - existential quantifier creates new entity in case it doesn't exist
- single eval() to access test/findAll/dump etc...
  - find all free vars to decide between findAll and test
  - eval takes "side-effect" param, with inferred default
  - question AST

## Frontend

- a more palatable syntax

## Interop (for later)

- how to integrate method calls?
- how to integrate object attribute modifications?
  - convertToJs(wm: WorldModel, id: string, obj:any)
  - a concept has a default filler for js-object?
- how to integrate events?

## Problems

- can you entirely do away with variable assigments

# Pipeline:

- source is parsed by grammatical framework
- grammatical framework produces a semantic AST
- GF AST is transformed into LLang json AST (mostly GeneralizedSimpleFormula)
- the LLang AST is fed to eval() OR it is used by compiler

Use generalized ASTs to implement sentences:

```
$({subject : 'x:element', verb: 'v:be', predicate:'c:color' }).when(
  there exists y:style where
  x:element has y:style as style
  and y:style has c:color as color
)

$({subject : 'button#1', verb: 'is', predicate:'red' })

button#1 is red
```
