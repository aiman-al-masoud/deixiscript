https://medium.com/analytics-vidhya/ontologies-in-detail-2916f9226133


# RULES

1. No single correct way.
1. Iterative process.
1. Concepts close to objects and relationships in domain.

# 1 Determine Domain and Scope

Relevant concepts and relations are a function of competency questions, the kind of problems that the ontology should be able to solve.

# ~~2 Consider Reusing~~

# 3 Enumerate Important Terms

An exhaustive list of terms that should be included in the ontology.

# 4 Define Classes and Hierarchy

## Top Down

Specific concepts first, then generalize.

## Bottom Up

General concepts first, then specify.

## Hybrid

Salient concepts first, then generalize and/or specify.


# 5 Define Slots, aka: properties of Classes

They are the attributes of a class.


# 6 Define the Facets of the Slots

Characteristics of a class' property.

1. Slot Cardinality: how many values a slot can hold.
1. Slot value type: primitive types, or other objects.
1. Domain: name of the property.
1. Range: ???


# 7 Create Objects

1. Choose a class
1. Create an individual instance
1. Fill the slots


# FIRST ITERATION

## Step 1

The ontology should be a valid enough representation of the DOM, and should include some basic programming ideas from javascript, like objects, numbers, lists/arrays, and maybe functions.

Some of the problems it should be able to solve:

* is the button with text 'hello world' red?

* the color of the paragraph with bold text is red.

* does the list of cats include 'arabian mau'?

* if the red button is clicked the paragraph in the black div disappears.

## Step 3 


element
div
image
button
link
paragraph
textarea
click
color
red
green
have
blue
component
tag
document
window
type
input
you
I
user
number
list/array
string
text
title
caption
console
log
page
function
reload
time
position
before
after
above
below

## Step 4

### Object

- Element
- Number
- String
- Collection
- Function
- Color
- Position

### Element

- Body
- Div
- Image
- Button
- Link
- Paragraph
- TextArea

### Collection

- List
- Set

### Position

- Relative
- Absolute


## Step 5/6

### Object
- id : string | number

### Element

- background : Color  (alias color)
- foreground : Color
- position : Position
- children : Element[]
- text : string

### Collection

- objects : Object[]

### Relative

- x : Number
- y : Number

### Absolute

- above: Element
- below : Element (alias under)
- leftof: Element
- rightof: Element
