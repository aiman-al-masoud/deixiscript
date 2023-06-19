# What is LLang missing to become Deixiscript?

## Core Features

- how to integrate anaphora?
  - new AST type in LLang (Atom)
  - contains description (formula) and head (variable)
  - error out if findAll() finds many?
- a more palatable syntax
- single eval() to access test/findAll/dump etc...
- mathematical operations

## Interop (for later)

- how to integrate method calls?
- how to integrate object attribute modifications?
  - convertToJs(wm: WorldModel, id: string, obj:any)
  - a concept has a default filler for js-object?

# Pipeline:

- source is parsed by grammatical framework
- grammatical framework produces a semantic AST
- GF AST is transformed into LLang json AST (mostly GeneralizedSimpleFormula)
- the LLang AST is fed to eval() OR it is used by compiler

Use generalized ASTs to implement sentences:

```
$({subject : 'x:element', verb: 'v:be', predicate:'c:color' }).when(
	there exist jo:jsobject, s:jsobject and bg:jsobject where
	jo:jsobject has s:jsobject as style 
	and s:jsobject has bg:jsobject as background
	and bg:jsobject is c:color
)

$({subject : 'button#1', verb: 'is', predicate:'red' })
```
