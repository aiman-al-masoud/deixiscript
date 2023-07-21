# Deixiscript

# Core Features

- anaphora
  - refactor and complete decompress()
  - first/second/ ordinal vs cardinal...
- tell()
  - less than and greater than as commands
- parser
  - "cat number 2" ---> explicit reference to constant "cat#2" ?

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
- press-state (down/up)
- key-code

when any of these basic properties is edited, the Panel automatically changes

JS doesn't need to know about is-a relationships, just has relationships.
Default fillers can be computed in tell() as a result of new is-a relationships.
To Accomplish this everything must be the same. Only "Thing", no "Panel", and
when visible-cum-attached is set to true a div is created.

Only fixed positioning (absolute coordinates), on single root object.

### event handler

evaluate(ExistentialQuantifier) // create the event evaluate(HappenSentence) //
make it happen

You also need some basic properties for buttons (down/up,key...).

# Problems

- in match() for loop there is no guarantee that the most specific rule will be
  found first. Descending sort derivation clauses by "specificity".

- maybe need to pass down new kb not old one within body of ask() for correct
  anaphora

- if tell() gets a derived property that is also a has-formula, it will ignore
  the derived property and just serialize the formula as is.

- possible problem with where in instantiateConcept() and multiple legal values
  on same attribute.

- tell()/instantiateConcept()/expand()/isConst() are currently serializing '*',
  which is partial information, as a constant, that may be very dangerous!!

- implicit references may be ambiguous from the point of view of creating a new
  thing, or erroring out if you don't find an old one. Maybe the/a distinction
  could help disambiguating. "A mouse which has the/a house as location".

- entities and strings are sealized in the same way.

- newly created entities in tell() should be on top of deictic dict.

- is a concept supposed to be (isa) itself?

- when adding new props (treated as defaults) to a concept you have to add them to all existing instances of the concept.

## Limitations

- no context sentitivity
  - the cat eats the kibble piece
  - it jumps it resolves to "the kibble piece"
- no cataphora.
- no ambiguous sentence recognition and multi-tree parse, but possiblility to "disambiguate" (change default parse order) using parentheses.

# Notes

- tell() and ask() do NOT have ANY side effects (like all other functions).
  tell() and ask() both return a brand new knowledge base object, because even
  ask() may produce updated versions of the deictic dictionary and add newly computed numbers to the world model.

- at the most basic level there is nothing but: entities, is-a-relations and
  has-as-relations. This is the "interface" through which Deixiscript
  communicates with the outer world, including JS, which only uderstands has-as
  properties (not is-a ones because JS doesn't have multiple inheritance).

- assignments are completely replaced by anaphora, also in theme-rheme phrase
  style split in two sentences, also intermediate numerical computations.

- anaphora can also be used to replace if-statements, one big function with lots
  of ifs = lots of small "functions" with naturalistic type arguments created on the fly.

- anaphora work as if each entity got the current timestamp whenever it is
  mentioned. When function ask() is called from findAll() the deictic dict is
  NOT updated.

- pronouns are defined through derivation clauses that have an entity as "conseq" part.

- 3 basic and 1 semi-basic verbs (EQUALS,IS-A,HAS-AS,BE), EQUALS cannot be
  overriden, all the others can, BE defaults to EQUALS in the most general case.
  All other verbs need to be prefixed with a helper/auxiliary (do/does) to let
  the parser know they're being used as verbs.
