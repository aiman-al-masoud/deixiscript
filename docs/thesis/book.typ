#set heading(numbering: "1.")
#set par(justify: true, leading: .5em)
#set page(paper: "a4", margin: 3cm, numbering: "1.")
#set text(font:"Times New Roman", size:13pt)

#show heading.where(level:1): it => [
    #pagebreak()
    #set align(center)
    #set text(30pt, weight: "bold")
    #block(it) //.body
]

#outline(indent: true)

#include "0-intro.typ"
#include "1-voice-interfaces.typ"
#include "2-linguistics.typ"
#include "3-philosophy.typ"
#include "4-artificial-intelligence.typ"
#include "5-programming-languages.typ"
#include "6-naturalistic-programming.typ"
#include "7-deixiscript.typ"

#bibliography("bib.bib")