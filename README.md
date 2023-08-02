# Deixiscript

## Notes on Philosophy & Method

- At the most basic level there is nothing but: entities, is-a-relations and
  has-as-relations. This is the "interface" through which Deixiscript
  communicates with the outer world, including JS, which only uderstands has-as
  properties (not is-a ones because JS doesn't have multiple inheritance).

- The user, instead, communicates with Deixiscript through well formed formulas,
  which include a subset of grammatical english sentences.

- Assignments are completely replaced by anaphora (implicit references), also in
  theme-rheme phrase style split in two sentences, also useful for intermediate
  numerical computations.

- Implicit References + Derivation Clauses can also be used to replace
  if-statements, because one big function with lots of ifs can be expressed as
  lots of small derivation clauses with naturalistic type (implicit reference)
  arguments declared on the fly.

- Implicit references work as if any entity got the current timestamp whenever
  it was mentioned. When function ask() is called from findAll() the deictic
  dict is NOT updated, because the results from ask() are ignored.

- Pronouns are defined through derivation clauses that have a constant (entity)
  as their "conseq" part and an implicit reference as their "where" part.

- There are 3 basic and one 1 semi-basic verbs (EQUALS,IS-A,HAS-AS,BE), EQUALS
  cannot be overriden, all the others can, BE defaults to EQUALS in the most
  general case. All other verbs need to be prefixed with a helper/auxiliary
  (do/does) to let the (current) parser know they're being used as verbs.

- Verbs aren't functions, verbs are procedures. Noun-phrases (including implicit
  references) are expressions, and thus are much more akin to functions.

- If the new derivation-clause-based parser will be adopted, the core language
  will preferably be purely analytic (one morpheme at most per space-delimited
  word), because the lexer will (mainly) just split strings by whitespaces.
  Future synthetic/agglutinative extensions are possible, by complicating the
  lexer.

- [Communication with the outer world](./src/io/README.md)

- Functions tell() and ask() do NOT have ANY side effects (like most other
  functions). tell() and ask() both return a brand new knowledge base object,
  because even ask() may produce updated versions of the deictic dictionary and
  add newly computed numbers to the world model. Pure functions and immutable
  data structs whenever possible.

## Solved Problems

- in match() for loop there is no guarantee that the most specific rule will be
  found first. Descending sort derivation clauses by "specificity" of their
  conseq. Has to be further tested. Tests: 64, 78

- match() may have to take care of derivation clauses, semantic match rather
  than purely syntactic match. Imagine an event expressed in terms of basic
  has-sentences, but event handler expressed in higher level way. Tests 79,80,81

- is a concept supposed to be (isa) itself? NO! But match() does check equality of consts before isa.

## Half Solved Problems

- maybe need to pass down new kb not old one within body of ask() for correct
  anaphora

- implicit references may be ambiguous from the point of view of creating a new
  thing, or erroring out if you don't find an old one. Maybe the/a distinction
  could help disambiguating. "A mouse which has the/a house as location". An
  'isNew' prop has been added to ImplicitReference, it remains to be seen how to
  use it in tell().

- cat number 2 ---> explicit reference to constant "cat#2"? 'cat#2' works with
  new parser, obviously still inconvenient for voice mode.


## Problems

- if tell() gets a derived property that is also a has-formula, it will ignore
  the derived property and just serialize the formula as is.

- possible problem with where in instantiateConcept() and multiple legal values
  on same attribute.

- tell()/instantiateConcept()/expand()/isConst() are currently serializing
  'thing' as partial information in "has" without "as".

- entities and strings are serialized in the same way.

- tell() should also affect the deictic dict, currently it doesn't.

- when adding new props (treated as defaults) to a concept you have to add them
  to all existing instances of the concept.

- avoid default-creation-loops (an entity is created as a default for another, a
  third entity is created as a default for the default etc...)

- ordinal anaphora, first/second (or "the other...")

- less than greater than as vague commands (tell)

- most used derivation clauses (annotations) get their own LLangAst

## Limitations (Out of Scope Problems)

- context sentitivity is incomplete
  - the cat eats the kibble piece
  - it jumps it resolves to "the kibble piece"
- no cataphora.
- no ambiguous sentence recognition and multi-tree parse, but possiblility to
  "disambiguate" (really: change default parse order) using parentheses.
