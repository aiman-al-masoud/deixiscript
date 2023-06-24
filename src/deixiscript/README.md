# What is LLang missing to become Deixiscript?

## Core Features

- integrating anaphora
  - anaphora within same sentence and with temporal order: deictic dict (DONE)
  - what if findAll() finds many?
  - every/and/or
- mathematical operations
  - refactor test()
  - is MathExpression an Atom ??!
- finish up recomputeKb()
  - implement not
  - existquant defaults
- single eval() to access test/findAll/recomputeKb etc...
  - ask vs tell AST
  - find all free vars to decide between findAll and test

## Frontend

- a more palatable syntax

## Interop (for later)

- how to integrate method calls?
- how to integrate object attribute modifications?
  - convertToJs(wm: WorldModel, id: string, obj:any)
- how to integrate events? there-is + happens

## Problems

- can you entirely do away with variable assigments? replaced by anaphora, also
  theme-rheme style on separate sentences joined with pronouns
- should GeneralizedSimpleFormula become compound? (ie:accept other formulas as
  args?)

# Pipeline:

- source is parsed by grammatical framework
- grammatical framework produces a semantic AST
- GF AST is transformed into LLang json AST (mostly GeneralizedSimpleFormula)
- the LLang AST is fed to eval() OR it is used by compiler

# Notes

- recomputeKb() and test() DO HAVE side effects; not for what concerns the world
  model and derivation clauses, but on the deictic dictionary.

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
