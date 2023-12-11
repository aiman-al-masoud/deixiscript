#import "template.typ": project

#show: project.with(
  title: "Deixiscript: Exploring and Implementing a Common Sense Approach to Naturalistic Programming",
  authors: (
    (name: "Aiman Al Masoud", 
    email: "", 
    affiliation: "Università degli Studi di Pavia", 
    postal: "", 
    phone: "",    
    ),
  ),
)

#include "1-intro.typ"
#pagebreak(to: "even")
#include "2-programming-languages.typ"
#pagebreak(to: "even")
#include "3-naturalistic-programming.typ"
#pagebreak(to: "even")
#include "4-common-sense.typ"
#pagebreak(to: "even")
#include "5-deixiscript.typ"
#pagebreak(to: "even")
#include "6-future-work.typ"
#pagebreak(to: "even")
#bibliography("bib.bib", title: "References")