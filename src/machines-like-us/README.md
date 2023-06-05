# Parts

## World Model

Represents the state of the world.

- link from an individual to a concept.
- link from an individual to another individual via a role.

> TypeName#XX is a TypeName
>
> TypeName#XX has Something as PropertyName.

## Conceptual Model

A framework of generalizations to classify the items in the world model.

### 1 Concept

a category linked to a more general one.

### 2 Role

a basic property associated with a concept.

### 3 Restriction

a limit on the number or category of a role filler. Can be on type or number or
others (eg: identity) ...

### 4 Annotation

a cancellation of a restriction or a default filler for a role.

> NB: restrictions are also objects, so that annotations can refer to them
> later.

> NB: number of roles associated with a concept != number of fillers. For eg 2
> parents for role "parent", or same individual for multiple roles.

### Also:

- Importance of a role
- and strength of an annotation.
- Other annotations such as similarity, epistemology (source of belief) ...

A conceptual model can be seen as a world model at a meta level, where the
concepts of the world model (person, mother, birthEvent) are the individuals of
the conceptual model and the concepts of the concept model are:
numberRestriction, role...

# Reasoning

- Is P true now?
- Would P be true if I took action A?
- What actions could I take to make P true?

## Language L

> Term = Constant | Variable

> Constant = an individual in the world

> Variable = a placeholder for an individual of type t.

> SimpleFormula = AtomicFormula | Equality

> AtomicFormula = a [world model sentence](#world-model), but allowing for
> variables. And with optional `after` clause followed by a sequence of events.
> If empty `after` it's assumed that the AtomicFormula is true even after no
> events.

> Equality = between two terms

> CompositeFormula = Conjunction | Disjunction | Negation |
> ExistentialQuantification

> Conjunction = formula with `"and"` between two formulas, both are true

> Disjunction = formula with `"or"` between two formulas, at least one is true

> Negation = `"it is not the case that"`, meaning embedded formula is not true

> ExistentialQuantification = `"there is"` followed by some variables followed
> by `"where"` followed by another formula for the properties

> DerivedPropertyDefinition = AtomicFormula `"when"` ExistentialQuantification

> NB: a formula such as "Person:x has “Harry” as a firstName" has NO TRUTH
> VALUE.
>
> To get a truth value, it must appear in the scope of an existential
> quantifier:
>
> There is a Person:x where Person:x has “Harry” as a firstName.

## Answering Factual Questions

- Yes-No questions ---> [TEST](#test)
- Wh- questions (and "how many" questions) ---> [FIND-ALL](#find-all)

Both [TEST](#test) and [FIND-ALL](#find-all) work by breaking down formula
argument into atomic formulas and looking for those in the world model.

## Deriving New Properties

An expression using when, and a formula from L-lang used to represent a derived
property.

```
person x has person y as mother 
when 
there is an event z where person x has event z as birth 
and event z has person y as mother.
```

```
person x has city c as birthCity
when
there is an event e and spacePoint p where
person x has event e as birth
event e has p as location
and p has c as enclosing city.
```

```
thing x1 is larger in volume than thing x2 
when
there is a number v1 and a number v2 where
thing x1 has number v1 as a volume and
thing x2 has number v2 as a volume and 
number v1 > v2
```

```
Person:x has Person:y as an ancestor
when
there is a Person:p where
Person:x has Person:p as a parent and
Person:p is Person:y or Person:p has Person:y as an
ancestor.
```

## Simulating Change

There are events in the world model, just **don't** assume that they've actually
happened.

Use `after` clause in AtomicSentence, described above.

A derivation clause (when) can be used to define how a kind of event (or
sequence thereof) will change some kind of thing.

TEST can be used to determine if an event will cause another, and FIND-ALL can
be used to find the relevant event, BUT ONLY IF the relevant events are already
present in the world model.

We can update the basic properties in the world model, and we could store the
old one if we needed to rembember the past.

### Example query

```
door#1 has open as state after [door-opening-event#1]
```

### Recursive derivation clause expressed without syntactic sugar

_pg: 178_

```
Door:d has State:z as a doorState after Seq:s|Event:e
	when
	Event:e is a door-opening-event and Event:e has Door:d as an object and State:z is “open”
	or Event:e is a doorClosingEvent and Event:e has Door:d as an object and State:z is “closed”
	or Door:d has State:z as a doorState after Seq:s.
```

Problem: this is not equivalent to the derivation clause shown by the authors on
page 178, what they really mean is this:

```
Door:d has State:z as a doorState after Seq:s|Event:e
when
if Event:e is a doorOpeningEvent and Event:e has Door:d as an object
	return State:z is "open"
else if Event:e is a doorClosingEvent and Event:e has Door:d as an object
	return State:z is "closed"
else Door:d has State:z as a doorState after Seq:s.
```

> return is equivalent to then

You have to return, not fall through, in case you find the right event with
right conditions, asserting the "correct" value of State:z in that case.
Otherwise you will end up finding an older event in the sequence that matches,
but it is older: it should've been overriden by a new one checked before!

> **NB: Event:e is the LAST EVENT IN THE CHAIN!!!**

> NB: assuming higher operator precedece for AND, as is usually the case

> after: Term[] | { seq: Variable, tail: Variable } | Variable
>
> Because it can be:
>
> - an explicit list of terms
> - sequence variable and tail variable
> - only a sequence variable

## Planning for Change

An "action" is an event that is caused by an agent.

The possibility of a "primitive" event relative to an agent can be defined like
so:

```
Event:e is possible for Agent:x
when
Event:e is a doorClosingEvent and
there is a Door:d where
Event:e has Door:d as an object,
Agent:x is near Door:d, and
Door:d has “open” as a doorState.
```

Simplifying assumption that non-primitive events are characterized as sequences
of primitive events only.

For a non-primitive event to be possible, it must be possible to perform the
first action of the sequence, then, in the state that results from that, the
second, and so on...

To determine if it is possible for an agent to perform action, you can test that
the agent can perform the sequence of events AND that the sequence results in
the action. Assuming you know the sequence (maybe derive starting from proximate
cause of action?)

```
Seq:s is a possibleSequence for Agent:x when Seq:s is [].


Seq:s|Event:e is a possibleSequence for Agent:x
when
Seq:s is a possibleSequence for Agent:x and
Event:e is possible for Agent:x after Seq:s.
```

But what about the side effects on the world model that events could cause and
rely on as preconditions? They are not taken into account by this derivation
clause.

## Finding a sequence of actions of fixed length that achieves a goal

```
[Event:u,Event:v] is a possibleSequence for Person#17
and Door#58 has “closed” as a doorState after
[Event:u,Event:v].
```

## Answering Generic Questions

> Is a bird a flying animal?

> Can a baby drive a car?

> Will a haircut take longer than a birthday party?

> Does a grizzly bear weigh more than a wheelbarrow?

These are all questions referred to the CONCEPTS! Not to the individuals!

> "Is a bird a flying animal?" $\neq$ "Is every bird a flying animal?"

The first might be true and the second false, or viceversa.

Idea for a solution: instantiate a new bird in the world model using the bird
concept, check if that new (hypothetical) bird is a flying animal.

# Operations

## FIND-PATH

compute a path between two individuals in the model.

## GET-PARTS

Find all parts (roles, restrictions, or annotations) inherited by a given
concept.

## TEST

The argument must be a formula **without any free variables**, because the
argument must have a truth value!

## FIND-ALL

Accepts formulas with free variables as arguments, interprets them as Wh-
questions.

## PLAN

Takes an agent and a goal formula as arguments. Returns sequence of actions that
an agent can perform starting from the current state to make the goal formula
true.

Note that FIND-ALL can be used to compute PLAN, provided that:

- The events of the sequence are all present as constants in the world model
- The length of the chain of events is know/reasonably short ??

## MODIFY-PLAN

...

# My Notes

- Is the default annotation filler an existing object or a brand new object, or
  either of the two depending on the context? It is a concept. This is because
  it is part of the conceptual model. The default filler concept can be
  instantiated just like the parent concept.

- What about circular inheritance graphs?

- Problem with cancelling annotations by id, if you imagine the input is natural
  language from the user, you first need to find the restriction's id based on
  its name and props, then cancel it. Do I even need a restriction id? Yes, you
  need it. It makes it easier to reference the restriction/annotation.

- Providing a proof by logging the passages of test for debugging purposes,
  similar to writer monad

- inheritance chains AND INHERITED PROPS, how does test() take them into
  account?
