#set heading(numbering: "1.")
#set par(justify: true, leading: .5em)
#set page(paper: "a4", margin: 3cm, numbering: "1.")
#set text(font:"Times New Roman", size:13pt)

// #show heading: it => [
//   #set align(center)
//   #set text(12pt, weight: "regular")
//   #block(smallcaps(it.body))
// ]

#include "0-intro.typ"
#pagebreak()
#include "1-voice-interfaces.typ"
#pagebreak()
#include "2-linguistics.typ"
#pagebreak()
#include "3-philosophy.typ"
#pagebreak()
#include "4-artificial-intelligence.typ"
#pagebreak()
#include "5-programming-languages.typ"
#pagebreak()
#include "6-naturalistic-programming.typ"
#pagebreak()
#include "7-deixiscript.typ"


#bibliography("bib.bib")
