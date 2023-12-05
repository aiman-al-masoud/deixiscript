#import "template.typ": project

#show: project.with(
  title: "Deixiscript: Exploring and Implementing a Common Sense Approach to Naturalistic Programming",
  authors: (
    (name: "Aiman Al Masoud", 
    email: "", 
    affiliation: "Università degli Studi di Pavia", 
    postal: "", 
    phone: ""),
  ),
  abstract: lorem(59),
)

#include "1-intro.typ"
#pagebreak()
#include "2-programming-languages.typ"
#pagebreak()
#include "3-naturalistic-programming.typ"
#pagebreak()
#include "4-common-sense.typ"
#pagebreak()
#include "5-deixiscript.typ"
#pagebreak()
// #include "6-future-work.typ"
// #pagebreak()
#bibliography("bib.bib")