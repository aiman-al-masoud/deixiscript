# Deixiscript

## Notes on Philosophy & Method

- Pronouns are defined through derivation clauses that have a constant (entity)
  as their "conseq" part and an implicit reference as their "where" part.

- If the new derivation-clause-based parser will be adopted, the core language
  will preferably be purely analytic (one morpheme at most per space-delimited
  word), because the lexer will (mainly) just split strings by whitespaces.
  Future synthetic/agglutinative extensions are possible, by complicating the
  lexer.

## Solved Problems

- in match() for loop there is no guarantee that the most specific rule will be
  found first. Descending sort derivation clauses by "specificity" of their
  conseq. Has to be further tested. Tests: 64, 78

- is a concept supposed to be (isa) itself? NO! But match() does check equality of consts before isa.

- entities and strings are serialized in the same way. They are the same thing.

- if tell() gets a derived property that is also a has-formula, it will ignore the derived property and just serialize the formula as is. Nomore, now it checks for definitionOf().

## Half Solved Problems

- maybe need to pass down new kb not old one within body of ask() for correct
  anaphora

- cat number 2 ---> explicit reference to constant "cat#2"? 'cat#2' works with
  new parser, obviously still inconvenient for voice mode.

- match() may have to take care of derivation clauses, semantic match rather
  than purely syntactic match. Imagine an event expressed in terms of basic
  has-sentences, but event handler expressed in higher level way. Tests 79,80,81

- tell()/instantiateConcept() are currently serializing 'thing' as partial information in "has" without "as". Is this a problem?

- possible problem with where in tell()'s existquant and multiple legal values
  on same attribute. Latest wins out.

- most used derivation clauses (annotations) get their own LLangAst. Less of a problem with shorter and better and less annotations.

## Problems

- tell() should also affect the deictic dict, currently it doesn't.

- when adding new props (treated as defaults) to a concept you have to add them
  to all existing instances of the concept. Maybe: x:thing has y:thing as z:thing after w:thing which x:thing isa has y:thing as z:thing

- avoid default-creation-loops (an entity is created as a default for another, a
  third entity is created as a default for the default etc...)

- ordinal anaphora, first/second (or "the other...")

- less than greater than as vague commands (tell)

- derivation clause from test88 crashes a couple of other tests if added to prelude

- implicit references may be ambiguous from the point of view of creating a new
  thing, or erroring out if you don't find an old one. Maybe the/a distinction
  could help disambiguating. "A mouse which has the/a house as location".

## Limitations (Out of Scope Problems)

- no cataphora.

