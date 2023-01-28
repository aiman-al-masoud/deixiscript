A variable (aka: entity) (top-level or not) can have:

1: concepts, for which specific getters and setters are available. They are cool new abstractions of the language.

2: properties, which are just regular js attributes, they are for js-interop and bootstrapping reasons.

```
color of x
```

may refer to the concept, in case x has a 'color' concept associated to it, or it may simply refer to a 'color' property on x.


What can a language statement do?

1. Create a variable
    1. Using a cons associated to a predicate
1. Modify a variable
    1. Setting the slot(s) of an existing concept
    1. Creating a concept associated to the var
    1. Setting a property
1. Associate a predicate to a Concept
    1. "big is a size", "red is a color"
1. Modify a class
    1. Setting the slot(s) of an existing concept
    1. Creating a concept associated to the class
1. Return a variable
    1. Getting a concept
    1. Getting a property
1. Create a class
    1. idk ...


## Concept

The "cool new abstraction" of the language. 

Allows the end user to do stuff like asserting that a button is **`red, big and round`** (Color, Size, Roundness), or even **`on this or that div`** (Position) without having to specify style.background=..., style.width=..., style.height=... or style.borderRadius=..., or whatever ...

A Concept is associated to a `setter()` a `getter()` and an `is()` method, implanted by the user on an object or prototype.

A predicate can be associated to a Concept (independently of any object).

The appropriate setter or getter is retrieved from an object, based on the predicate that is being applied on the object. 

For example "red" is associated to the Concept of color, "big" is associated to the Concept of size, etc...

If the object in question isn't associated to that concept, the predicate is treated as a property.


### The `setter()`

For example `setColor()` or `setSize()` or `setRoundness()` ... they will take a predicate (red, big, round ...) as an argument and do something to the object they're invoked on.

They can take multiple args, if the predicate in question has arguments ("on the div") where the predicate is "on".



A predicate can be associated to a Concept or to a constructor.


big is a size.
big is 100vw.

the button is big.



A predicate must be associated to a Concept, as well as a value for that concept sometimes.???



WHEN the button is red ... WHEN the counter is 10 // express TIMES! times as first citizes...

places:

the button is where the div is

the button is on the div





Would be cool:


if any button is big then
	its width is 100vw and
	its height is 100vh and
	its font size is 100em



VARIABLE LEVELS OF ABSTRACTION

VERY 'LOW LEVEL', FOR RAW JS-INTEROP

the background of the style of x is red.

the width of the style of x is 100vw.


INTERMEDIATE LEVEL

the width of x is 100vw.

Simple Aliasing could come handy in this case, you could do something like:

the width of any button is the width of its style. ---> defines alias


Other example:

the background of the style of x is red.

the color of any button is the background of its style. ---> define alias

the color of x is red.

But in this case we also wanna be able to say:

x is red.

red belongs to at least one concept ("color"), the fact that red belongs to the color concept allows x to pick the right property/alias.


Mechanisms:

* property aliasing (eg: 'style.width' is simply 'width').
* concept-grouping of predicates, where a concept relative to an object is simply mapped to a single property or an alias (let's start simple).
* A predicate may be mapped to more than one concept.

This mechanism can be later incorporated into a more general setter/getter logic.

Algo:

"the color of x is red"

1. check if x has a property 'color'.
1. else check if x has an alias 'color'.

in case of "x is red"

1. get the concept of 'red' and use it to set the relevant prop/alias

"the background of the style of x is red"

1. check if x has the style.background property



.appendChild can MOVE an element within another element (MOVE not copy!) ok great


IDEA: owned properties have no say in anaphora resulution


# OLDER IDEAS ----------------------------------


Can you do away with prolog?

> every button is red

get everything that is a button from EntityDictionary and set its color to red.


ed: EntityDictionary

ed.items.filter(x=> x.value.is(klass)).map(x=>x.key)


"that is a button" -> the object will tell you whether or not it's a button, or if it's red, or black etc...  dynamic and distributed approach

if a button is X and X is a color then the background of the style of the button is X.


a new button is added



the background of the style of the red button is red ->  

THEME:
background(X).
of(X, Y).
style(Y).
of(Y, Z).
red(Z).
button(Z).

RHEME:
red(X).


The "top level object" is Z, the button, since there is no 'of(Z, _)'.

get an object that is red and is a button, then:

get an object that is on the button and is a style:

redButton.style

then get an object that is on the style and is a background

redButton.style.background 

set this object to red

redButton.style.background  = red





ed.items.filter(x=>)


isRel(x, 'of', y)






x is a red button. 

theme
x(x).
rheme
red(x).
button(x).

every clicked button is green.

theme
clicked(X).
button(X).
rheme
green(X).




the cat is black

theme
cat(x).
rheme
black(x).

{ cat : true, black : true  }



the background of the style of the button is black if a button is black.


condition:

button(X).
black(X).

outcome:

background(Z).
black(Z).
of(Z, Y).
style(Y).
of(Y, X).



Keep implications in brain (MAYBE PROLOG), keep state of objects in EntityDictionary


x is of y

theme:
x(1).
rheme:
y(2).
of(1, 2).

pointerToY =  {  x : pointerOrIdToX  }

pointerToX = {  of : pointerOrIdToY }


Simplifying assumption: one object can only have ONE owner

is x of y?

x(1).
y(2).
of(1, 2).

get y (top level object)

does an "x" object exist on y?


of ~= in

is a red button in y ?


red(1).
button(1).
y(2).
of(1, 2).


does a red(1). button(1). object exist on y?



What about polymorphism through multiple inheritance (mixins)??????? 

Instead of treating implications as disembodied conditions and checking each one of them,
add extra behavior to each object that individually checks 

Yeah, but what about a condition on object X that determines an action on ANOTHER object Y ????

You still gotta broadcast the change in state!!!!!!!!!!!!!!!!


Every object has a setter that can be overloaded in multiple ways.


"""
red is a color.
green is a color.
if any x is color y then background of style of x is y .
x is a red button.
"""


if any x is color y then background of style of x is y .

condition:

x(1).
y(1).
color(y).

outcome:

background(2).
of(2, 3).
style(3).
of(3, 1).
y(2).


trait Blacker{

	set(attribute){
	
		if attribute instanceof color {
			this.style.background = attribute
			this.listener.onChange(this.id, attribute)
		}
	}
	
}


# Example

```
every red button is big
```

## OOP+JS Approach

add a property to the button class that checks if the button becomes red and 
makes it big in that case.

Maybe with setInterval??

```
setInterval(()=>{
	
	if(this.is('red')){
		this.big(true)
	}

}, 100)
```

Where `.red()` (or `.is('red')` ...) ...

```
red(){
	return this.style.background === 'red'
}
```

## Prolog Approach

whenever a change comes, call something like:

```
be(X, Y)
```

to determine changes. Then push them down to the Actuator.

### Problems
* Duplication of state (KB + JS objects).
* A button can have two colors simultaneously in its prolog representation.



Any button is color y if background of style of button is y.

.is(predicate){

}

.be(predicate){
	
	if (predicate.is('color')){
		this.style.background = predicate.value
	}

}

button1.be(Color.get('red'))


red and green and blue are colors.


red, green, blue are colors.
if a button is color y then the background of the style of the button is y.
x is a red button.



```
red is a color.
```

creates an object that is a 'color' and has value 'red'



```
if a button is color y then the background of the style of the button is y.
```
(or something to that effect)


overrides the be method adding in some extra behavior that deals with colors.


```
x is a red button.
```

x(1).
red(1).
button(1).

creates an object that is red and is a button. When the property 'red' is set on the button, this triggers a polymorphically defined behavior specific to buttons and other similar html elements, that sets the value of the style.background property.


setInterval(()=>{
	
	if(this.is('red')){
		this.style.background = 'red'
	}

}, 100)



if any x is color y then background of style of x is y .

high level (describes top-level object x):

x(1).
y(1).
color(y).

low level (describes properties of top-level object):

background(2).
of(2, 3).
style(3).
of(3, 1).
y(2).

// INCORRECT syntax, just as an example:

prototype['setColor'] = (color) => {
	this.style.background = color
}

prototype['isColor'] = (color) => this.style.background === color


is the button red?

b1.is('red')

'red' is a color, call .isColor('red')

# RULES

An object has setters and getters.

Even a getter can accept a parameter.

A setter/getter pair can be associated to a certain class of objects (a concept, such as color).

There is a top level `set(arg)` and `get(arg)` method that determine what submethods to call based on: (these can be functions)

1. the class (concept) the argument belongs to.
1. whether the `this` object has a setter/getter for that concept.

If no specific setter/getter pair is present, then you can simply add a getter that returns true, eg:

the button is a cat.

buttonObj['isCat'] = () => true

Prototypes/classes are used for generalization, behavior is added in mixin-style, eg:

every button is red

buttonPrototype.set('red')

'red' is a color, so use: `.setColor('red')`

Classes can be created on the fly. Any class can be modified and extended dynamically.













```
the background of the style of the button is red if the button is red
```

interpret this as a double implication, aka iff, or definition.


































