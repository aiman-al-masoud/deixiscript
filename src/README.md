# Programmazione Naturalistica

Due approcci promettenti:

- Approccio Traduttore
- Approccio Advice Taker

# 1 Approccio Traduttore

Cominciare da un AST (albero sintattico astratto) di una frase in linguaggio
naturale, ed elaborarlo finché non si ottiene (uno o più) AST di un linguaggio
di programmazione. Questo tramite una sequenza di "semplici" trasformazioni di
AST. Alcune di queste trasformazioni dipendono dal contesto, altre no.

## Strategia Generale:

1. ottieni AST semantico di una frase in lingua naturale
1. trasformalo tramite una sequenza di trasformazioni di AST
1. ottieni AST di linguaggio di programmazione
1. linearizza AST di linguaggio di programmazione in codice

## Possibile Pipeline delle trasformazioni:

1. espansione dei modificatori (aggettivi)
1. decompressione sintattica
1. trasformazione delle frasi "is" in frase "has", quando necessario.
1. risoluzione dei riferimenti impliciti
1. decompressione semantica
1. espansione dei quantificatori universali
1. aggiunta istruzioni e relazioni use/def al world model
1. ordinamento istruzioni in ordine di esecuzione

## Relazione con Pegasus

Approccio ispirato a paper su Pegasus. L'autore del paper (Roman Knöll) ha
confermato via mail che sta ancora lavorando al problema. Pensa che l'approccio
generale sia quello giusto, ma dice che rendere il sistema configurabile e
flessibile è abbastanza difficile con un linguaggio di implementazione
tradizionale.

## Relazione con Metafor

La programmazione è vista come storytelling. Si presume una relazione fra la
semantica delle frasi di una lingua naturale e la semantica delle istruzioni di
un linguaggio di programmazione. La parte difficile è trovare queste relazioni,
tenendo il sistema flessibile e ri-configurabile.

## Relazione con i transpiler

L'idea delle trasformazioni di AST è un'idea tipica dell'architettura dei
transpiler.

## Grammatical Framework

Ho provato a fare un parser, ma è risultato un po' scomodo da debuggare. Meglio
affidarsi a GF che è un linguaggio specializzato a scrivere e implementare grammatiche, 
e che provvede anche a riconoscere grammatiche ambigue, cioè grammatiche con frasi che ammettono
più d'un albero sintattico, causato per esempio da regole di associazione
inesistenti. L'alternativa è usare le parentesi, che però è difficile fare in un
contesto vocale.

# 2 Approccio Advice Taker

Ispirato a libro "Machines Like Us", a sua volta ispirato all'Advice Taker,
programma ipotizzato da John McCarthy nel lontano 1959 (Programs with Common
Sense).

Il sistema rappresenta lo stato del mondo, e presume che l'accadere degli eventi
possa alterare questo stato in un modo o nell'altro. Una "situazione" è uno
snapshot dello stato del mondo. Lo svolgersi di un evento in una situazione
$s_0$ porta alla creazione di una situazione successiva $s_1$.

Il sistema può acquisire nuove conoscenze in formato dichiarativo (non
imperativo), inclusa la capacità (o incapacità) di un agente di causare un
evento. Dato un agente si può quindi formulare un piano d'azione, a partire da
un obbiettivo prestabilito, e dalla situazione attuale.

Dopo aver formulato un piano d'azione (o "strategia"), il sistema può eseguirlo,
controllare che sia andato a buon fine, e, in tal caso, aggiornare la
rappresentazione interna dello stato del mondo.

Una delle attuali difficoltà riscontrata sta nella ricerca di piani d'azione
quando gli eventi rilevanti non esistono ancora tali e quali nel world model.

Gli eventi possono esistere anche "in potenza", perché il sistema possiede anche
un "modello concettuale". Il modello concettuale contiene generalizzazioni per
classificare gli individui del world model (generalizzazioni con un buon margine
di flessibilità). Permette di dire, per esempio, che a un agente può essere
associato un numero qualsiasi di "eventi movimento". Il problema sta nel trovare
euristiche che consentano di introdurre del world model tutti e soli gli eventi
funzionali alla raggiunta dell'obbiettivo, per evitare esplosioni nella
complessità di calcolo necessaria alla ricerca di piani d'azione.

Un world model non può in generale contenere tutti i possibili individui
implicati dal modello concettuale, perché potrebbero essere infiniti, e perché
anche se non lo fossero la complessità delle operazioni salirebbe a dismisura.


# 3 Idee Condivise dai due approcci

- Risoluzione dei riferimenti impliciti.
- Costruzione di un modello concettuale.
- Per il frontend si potrebbe sempre ricorrere a GF.

# Collegamenti

## Pegasus

[https://www.researchgate.net/publication/221322077_Pegasus_First_steps_toward_a_naturalistic_programming_language
](https://www.researchgate.net/publication/221322077_Pegasus_First_steps_toward_a_naturalistic_programming_language
)

## Metafor

[https://web.media.mit.edu/~lieber/Publications/Metafor-Visualizing-Stories.pdf](https://web.media.mit.edu/~lieber/Publications/Metafor-Visualizing-Stories.pdf)

## Machines Like Us

[https://mitpress.mit.edu/9780262547321/machines-like-us/](https://mitpress.mit.edu/9780262547321/machines-like-us/)

## Advice Taker

[http://jmc.stanford.edu/articles/mcc59/mcc59.pdf](http://jmc.stanford.edu/articles/mcc59/mcc59.pdf)

## Grammatical Framework

[https://www.grammaticalframework.org/](https://www.grammaticalframework.org/)

## Transpiler Architecture

[https://tomassetti.me/how-to-write-a-transpiler/](https://tomassetti.me/how-to-write-a-transpiler/)

## Ambiguità della lingua

[https://link.springer.com/chapter/10.1007/978-3-030-76020-5_7](https://link.springer.com/chapter/10.1007/978-3-030-76020-5_7)

## Naturalistic Types

[https://dl.acm.org/doi/abs/10.1145/2048237.2048243](https://dl.acm.org/doi/abs/10.1145/2048237.2048243)