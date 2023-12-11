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
  abstract: "\n\n\nNaturalistic programming is broadly defined as the attempt to write computer code in a varyingly complex subset of natural language. This work explores how existing naturalistic programming languages try to bring program specifications a little bit closer to the way humans naturally describe things and processes, relating it to the broad topic of \"Common Sense\" in Artificial Intelligence. Moreover, the thesis proposes a new prototype of rule-based naturalistic language, which follows the principles of the languages surveyed, but also introduces a notion of automated planning to facilitate declarative programming.\n\n\n\nLa programmazione naturalistica si può definire generalmente come il tentativo di scrivere del codice sorgente in un sottoinsieme del linguaggio naturale di diversa complessità. Questo lavoro analizza come i linguaggi di programmazione naturalistici esistenti cercano di avvicinare la scrittura di un programma al modo in cui gli esseri umani naturalmente descrivono entità e processi, e di metterlo in relazione con il più ampio argomento del \"Buon Senso\" (\"Common Sense\") nell'ambito dell'Intelligenza Artificiale. La tesi propone inoltre un nuovo prototipo di linguaggio naturalistico 'rule-based', che segue i principi dei linguaggi naturalistici esaminati ma introduce anche una nozione di pianificazione automatica per agevolare la programmazione dichiarativa.",
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