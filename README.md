# Deixiscript

# Core Features

- integrating anaphora
  - what if findAll() finds many?
  - every/and/or, use list-literal?
  - possible sol: getAnaphor() and ask() return Atom[], Anaphor.number
- tell()
  - existquant defaults (TRIGGERED WITH IS-A)
  - mutually exclusive is-a superconcepts
  - less than and greater than as commands
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
- visibility-cum-attachedness (favor WYSIWYG) 
- text 
- image

when any of these basic properties is edited, the Panel automatically changes

JS doesn't need to know about is-a relationships, just has relationships.
Default fillers can be computed in tell() as a result of new is-a
relationships. To Accomplish this everything must be the same. Only "Thing", no
"Panel", and when visible-cum-attached is set to true a div is created. 

Only fixed positioning (absolute coordinates), on single root object.

### event handler

evaluate(ExistentialQuantifier) // create the event evaluate(HappenSentence) //
make it happen

# Problems

- in match() for loop there is no guarantee that the most specific rule will be
  found first

- maybe need to pass down new kb not old one within body of ask() for correct anaphora

## Limitations

- no context sentitivity
  - the cat eats the kibble piece
  - it jumps it resolves to "the kibble piece"
- no cataphora

# Notes

- tell() and ask() do NOT have ANY side effects, but they both return a brand new knowledge base object, because also ask() can "modify" stuff like deixis and (maybe in the future) add number constants.

- at the basic level there is nothing but: entities, is-a-relations and
  has-relations. This is the "interface" through which Deixiscript communicates
  with the outside world, including JS.

- assignments are completely replaced by anaphora, also theme-rheme phrase
  style.

- anaphora work "as if" each entity got the current timestamp whenever it is mentioned. When function ask() is called from findAll() the deictic dict is NOT updated.
