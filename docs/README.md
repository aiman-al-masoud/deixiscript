Compile-time translation, rather than runtime interpretation. Just re-compile everything all the time.

* Mind: associate command templates to *meaning* (program code templates)
* Long Term Memory: recognize and process world model information
* Short Term Memory: resolve anaphora and contextual references.

The compiler takes a bunch of sentences, it splits them by dot, and parses each one of them. You get a list of ASTs.

A World Model is generated from the ASTs and validated against the Conceptual Model

The world model together with the ASTs is used to generate standalone javascript code.

* Mind, Long Term Memory ~ AST processing, Conceptual Model
* Short Term Memory ~ World Model

# AST Patterns
* if-statement
* (non copula) verb sentence could be modelled as method invocation (open to specification by further instructions)
* 

# Conceptual Model Entities
* drawable
* input-field
* text-field
* button
* change-event
* key-press-event
* text-content
* color
* mouse-click-event
* image
* location
* time
* event
* width
* length
* sound
* key

# Derived Props
* happenBefore, happenAfter for naturalistic control flow
