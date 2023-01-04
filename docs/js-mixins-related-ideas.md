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


















