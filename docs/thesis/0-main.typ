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
  abstract: "\n\n\nNaturalistic programming is broadly defined as the attempt to write computer executable code in a varyingly complex subset of natural language. Our goal in this work has been to explore how the existing naturalistic programming languages try to bring program specifications a little bit closer to the way humans naturally describe things and processes, relating it to the broad topic of Common Sense in AI. The thesis also includes a practical part, where we try building a simple prototype of a rule-based naturalistic language following the principles of the ones that we surveyed, and introducing a limited notion of automated planning to facilitate declarative programming.\n\n\n\nLa programmazione naturalistica si può definire generalmente come il tentativo di scrivere del codice eseguibile in un sottoinsieme del linguaggio naturale che varia in complessità. Il nostro obbiettivo in questo lavoro è stato quello di esplorare come i linguaggi di programmazione naturalistici esistenti provano ad avvicinare la specifica di un programma al modo in cui gli esseri umani naturalmente descrivono le entità e i processi, e di metterlo in relazione con il più ampio argomento del Buon Senso (Common Sense) nell'ambito dell'IA. La tesi prevede anche una parte pratica, dove si prova a costruire un semplice prototipo di un linguaggio naturalistico 'rule-based' seguendo i principi dei linguaggi naturalistici già esaminati, e introducendo una nozione limitata di pianificazione automatica per agevolare la programmazione dichiarativa.",
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