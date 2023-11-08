#import "template.typ": project

#show: project.with(
  title: "Deixiscript",
  authors: (
    (name: "Aiman Al Masoud", 
    email: "", 
    affiliation: "unipv", 
    postal: "", 
    phone: ""),
  ),
  abstract: lorem(59),
)

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
#pagebreak()
#bibliography("bib.bib")