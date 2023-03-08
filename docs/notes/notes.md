# Actions as Objects

cf: statement level anaphora/temporal referencing/out of order execution.

console logs something before any x is red.

x is red. before that then x is a button.

---

ActionWrapper or wrap(action) [cf 1](#aop-support), [cf 2](#object-vs-action-pronoun)

---

need a way to favor (regular) objects in lastReferenced/pronoun/it business, or else the last action becomes the last referenced object and breaks stuff:


1. x is a button.
1. it is black. // "it" should be "the button", not the "x is a button" action!


---
Breaking down Actions

A button is red.
The last instruction repeats. // full, or just "is red" or just "is button"

---

Naturalistic iterators

with [actions as objects](#actions-as-objects), eg:

* The next 2 actions repeat while x < 10.
* x increments.
* console logs x.

As well as:

* x increments.
* console logs x.
* The previous 2 actions repeat while x < 10.

----

Verb (method) definition

with [actions as objects](#actions-as-objects), eg:

* The next 3 actions are blink of any button.
* the button is red.
* the button is green.
* the button is red.

defines a new intransitive verb "blink" on (attaches a method without args other than self) to the button prototype.


# Lexemes as Objects

polymorphic value of a predicate?
---

Any kind of lexeme should be definable and editable from within deixiscript.

problem telling lexeme modifying action from macro, solved by fact that macro can't contain certain kinds of words:

* 'x is adjective' // is macro
* 'x is an adjective' // not macro 

---

lexemes should be (mutable) objects.

---

Lexemes and Actions should be "discouraged" from appearing as anaphora, "regular" (structure) objects should appear first.

Maybe Lexeme subclass of BaseWrapper with overridden clause() that searches for 'relevant' props (proto, cardinality, root...) or else requires a "lexeme" lexeme to return anything non-empty.

---


26-02-2023

tried with LexemeWrapper extends BaseWrapper. By adding lexemes to enviro from Context.setLexeme().

* if clause() returns info unconditionally Very very slow execution because of many hundreds of lexemes (I assume that's the reason for slow down).

* bearable if clause() checks if query contains relevant info first, but makes it more complicated.

* Must simplify BaseWrapper before going forward with Lexemes and Actions as objects.

---

Wrapper.dynamic():Lexeme[] returns inferred grammatical type of each member of object.

---

Lexeme.extrapolate() extrapolates declinations/cojugation of a lexeme.

---

Lexemes point to each other. A lexeme may have a _root lexeme, for example "is" has "be" as a root, plus extra morpheme related information. "Normalized" model.

---

Lexeme order of operands, for lexmes with same meaning (of, own, have) but different order of operands (x of y === y owns x).

---


Lexemes may have to take up the responsibility to store aliases and other data from js prototypes (which hold it currently). 

A combination of lexemes eg: (dangerous button) may correspond to a wholly new set of aliases and rules than the single (dangerous, button) lexemes.

-----

A Lexeme is a mutable object.

A Lexeme can extend (multiple) other Lexemes.

button is a noun and proto of it is HTMLButtonElement.
every button is an element.
every button is an object.

A Lexeme inherits aliases and methods/props from Lexemes it extends.


color is a noun.  // kind of like a class
red and blue are colors. // ... and subclasses

Need to fuse together: concepts, proto, (and maybe) _root.

---
A lot of problems with order of application of predicates (lexemes) upon creation of object.

Currently solved by putting reference to aliases on prototype.

----

https://stackoverflow.com/questions/9163341/multiple-inheritance-prototypes-in-javascript

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

--------


setters and getters inherited from noun lexeme instead of alias path.

setColor
getColor

----

# Negation

Negation as undoing any particular action, requires general solution when no ad hoc solution is available.

A general solution could be:

At any edit action A1 on an object X, a new copy is made of X and is kept up to date, except for what happened at A1.

When "A1 is negated" the copy is retrieved and it "replaces" (how?) the current object X.

# Macros

No more hardcoded names of grammar constituents.

Contextual lexing with heuristic.


# Adjective-Verb-Preposition Equivalence

Adjective = Intransitive Verb
* x is hidden
* x hides

Verb = Preposition 
* x appendChilds y
* y is on x
* position of y is x

cf: Lexeme order of operands

# Lexer

* Eager lexer lexes everything before new grammar pieces start getting added as lexemes, so you cannot run one single string as startup command, because eager lexer has it all lexed at the beginning.

* Other problem with lexer: it cannot discern distinct but concatenated "words", such as 1+1

* string literals

* number literals

* multi word lexemes
---

LazyLexer possible idea:

1. read until whitespace.
1. word is a lexeme? you got a lexeme.
1. word is not a lexeme (not even dynamic)? then hold word and concatenate until you get to a word that is a know lexeme. not gonna work to define 'zero or more', because 'or' is a lexeme!.

Consider ignoring multiword lexemes temporarily?

---

Tried turning prelude from string[] to string:

must feed dynamicLexeme() words of sentence (delimited by .) or else it gets the heuristic wrong. But it doesn't work for some reason, or it's tricky.

# Context Dependent/Relative Predicates

First/Last

* the first button ----> button with smallest ID
* the last button -----> button with largest ID
* the third button -----> button with third ID

----

Biggest/Smallest

For sortable types

# Possessive Adjectives

x is a button and **its** color is red.


# Plurals

Plurals are treated like implications. 

'buttons are red' = 'every button is red' = 'button(X) -> red(X)'

Problem with 'and sentences':

'x and y and z are colors'
Temporary Solution: in toClause(), don't call makeImply() if current ast is and sentence. Plurals work.

It would be great if (x and y and z) would just behave like a noun phrase... 
BUT this is a problem for and-sentence: 'x is a button and it is red' if noun-phrase contains 'and then noun-phrase' because left copula sentence gets parsed but within it there is the 'and it' and-phrase!

# Full Subordinate Clauses

* The button that is blue (OK)
* The button that is on the red div
* The div that appendChilds the button 
* ...

# And between consecutive adjectives

Can and between ajectives be safely removed, to allow for desired meaning without complicating andToClause()?

big and red ------> big red

# Low Level JS Access

* add of any number is "a=>this+a"

# Phatic words, fillers and partial parsing

"then" is needed and currenlty employed as a filler, it is used as a delimiter.

Some words should be ignored all the time ("uhm", "errm", "ah", "oh"...)

Maybe some words should be treated as "fillers"/phatics and ignored just in some contexts! (please)

# Morphology

* Extract basic hardcoded English morphology that remains to be extracted. 
* Make a more general morphological model to support languages that are more synthetic than English.

# Case Insensitivity

https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively


# Child Wrapper convey props

test 8 used to fail because child wrapper doesn't convey props to parent.

this also affected: "color of button is yellow"

Need to set name of child when creating it from parent in get(), because the name of the child is part of the chain of props.

(DONE), but may be better.


# Comparisons and Assignments

if both objects on left and right side of copula, call "Wrapper.compare()".

1. x is 1
1. y is 1
1. if x is y then b is a red button


# BUGS

## And Sentence Bug

'x and y are buttons and every button is green'

problem is probably due to two ands in one sentence.

## Negation Bugs
* every button that is not red (BUG!)

## And.query() Bugs

probably buggy

## Boolean Property Bug

"hidden of x is true" doesn't work.

## Number BUG

value of number being treated as simplePredicate even after reassignment

## Adjective as Noun BUG

x and y are buttons. color of x is yellow. y is red. 

yellow button.

returns two asts, and highlights both buttons. Reason being that 'yellow' wasn't declared as an adjective, and is a noun by default.

Fixed by allowing for zero or more nouns in a noun-phrase.

# Paraphrases

Many different paraphrasing styles could aid in debugging?

# "Prototyping"

Defining classes/blueprints (especially a component) from a single prototype (eg: a one-off attempt at creating a component). You could accomplish this with Wrapper.copy().

# Position Getter/Setter trick

Object.defineProperty(window.id1661,  'pos', { get: getPosition, set: setPosition, name:'pos'} )

function setPosition(pos){
    pos.appendChild(this)
}

function getPosition(){
    return this.parentNode
}

this needs set(Predicate|Wrapper) or usage of opts.args.


#

Eliminate the need for "aliases" in BaseWrapper.get(), maybe by new getNested that incorporates wrapping capabilities to attach parent to each object.

