# Deixiscript

# Core Features

- integrating anaphora
  - refactor and complete decompress()
  - nested anaphor clauses
- tell()
  - less than and greater than as commands
- general
  - copula should default to equality
- parser
  - special case for copula verb (not require "does")
  - "cat number 2" ---> explicit reference to constant "cat#2"

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
- visibility-cum-attachedness (favor WYSIWYG)
- text
- image

when any of these basic properties is edited, the Panel automatically changes

JS doesn't need to know about is-a relationships, just has relationships.
Default fillers can be computed in tell() as a result of new is-a relationships.
To Accomplish this everything must be the same. Only "Thing", no "Panel", and
when visible-cum-attached is set to true a div is created.

Only fixed positioning (absolute coordinates), on single root object.

### event handler

evaluate(ExistentialQuantifier) // create the event evaluate(HappenSentence) //
make it happen

# Problems

- in match() for loop there is no guarantee that the most specific rule will be
  found first

- maybe need to pass down new kb not old one within body of ask() for correct
  anaphora

- if tell() gets a derived property that is also a has-formula, it will ignore
  the derived property and just serialize the formula as is.

- possible problem with where in instantiateConcept() and multiple legal values
  on same attribute.

- tell()/instantiateConcept()/expand()/isConst() are currently serializing '*',
  which is partial information, as a constant, that may be very dangerous!!

## Limitations

- no context sentitivity
  - the cat eats the kibble piece
  - it jumps it resolves to "the kibble piece"
- no cataphora

# Notes

- tell() and ask() do NOT have ANY side effects (like all other functions).
  tell() and ask() both return a brand new knowledge base object, because even
  ask() may produce updated versions of the deictic dictionary and add computed
  numbers to the world model.

- at the most basic level there is nothing but: entities, is-a-relations and
  has-as-relations. This is the "interface" through which Deixiscript
  communicates with the outer world, including JS, which only uderstands has-as
  properties (not is-a ones because JS doesn't have multiple inheritance).

- assignments are completely replaced by anaphora, also theme-rheme phrase
  style, also intermediate numerical computations.

- anaphora work as if each entity got the current timestamp whenever it is
  mentioned. When function ask() is called from findAll() the deictic dict is
  NOT updated.
