#set heading(numbering: "1.")

#set par(justify: true, 
leading: 1.5em, 
first-line-indent: 1em, 
linebreaks: "simple")

#set page(paper: "a4",   margin: (right:3cm, left:3cm, top:4.5cm, bottom:4.5cm), numbering: "1.", header: [], footer: [])

#set text(font:"Times New Roman", size:13pt)

#show heading.where(level:1): it => [
    #pagebreak()
    #set align(center)
    #set text(size:13pt, weight: "bold")
    #block(it) //.body
]

#outline()

#include "0-intro.typ"
#include "1-voice-interfaces.typ"
#include "2-linguistics.typ"
#include "3-philosophy.typ"
#include "4-artificial-intelligence.typ"
#include "5-programming-languages.typ"
#include "6-naturalistic-programming.typ"
#include "7-deixiscript.typ"

#bibliography("bib.bib")