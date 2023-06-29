# Deixiscript

# Core Features

- integrating anaphora
  - fix and test deictic dict (too many increments for some entities, no limit
    on "stack")
  - what if findAll() finds many?
  - every/and/or, use list-literal?
- recomputeKb()
  - existquant defaults
  - mutually exclusive is-a superconcepts
- general
  - copula should default to equality
- parser
  - special case for copula verb (not require "does")

# JS INTEROP

- getThingById(id:string, things:ThingDict):Thing
- createThingInCase(id:string, things:ThingDict)
- update(additions:HasSentence[], eliminations:HasSentence[], things:ThingsDict)
- updateThing(additions:HasSentence[], eliminations:HasSentence[], object:Thing)

### objects

- Thing
- set(key, value:ThingObject|WmAtom)
- remove(key)

Panel

- xcoord (absolute)
- ycoord (absolute)
- width
- height
- color
- z-index
- visibility-cum-attachedness (favor WYSIWYG) text image

when any of these basic properties is edited, the Panel automatically changes

JS doesn't need to know about is-a relationships, just has relationships.
Default fillers can be computed in recomputeKb() as a result of new is-a
relationships. To Accomplish this everything must be the same. Only "Thing", no
"Panel", and when visible-cum-attached is set to true a div is created. 

Only fixed positioning (absolute coordinates), on single root object.

### event handler

evaluate(ExistentialQuantifier) // create the event evaluate(HappenSentence) //
make it happen

# Problems

- should GeneralizedSimpleFormula become compound? (ie:accept other formulas as
  args?)
- in match() for loop there is no guarantee that the most specific rule will be
  found first

## Limitations

- no context sentitivity
  - the cat eats the kibble piece
  - it jumps it resolves to "the kibble piece"
- no cataphora

# Notes

- recomputeKb() and ask() DO HAVE side effects; not for what concerns the world
  model and derivation clauses, but on the deictic dictionary.

- at the basic level there is nothing but: entities, is-a-relations and
  has-relations. This is the "interface" through which Deixiscript communicates
  with the outside world, including JS.

- assignments are completely replaced by anaphora, also theme-rheme phrase
  style.
