
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
