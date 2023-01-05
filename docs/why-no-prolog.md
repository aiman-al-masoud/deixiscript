# Problem with Prolog Approach:

* The attributes of an entity have to be treated as equal entities, like global variables, this is both ugly and probably not very scalable.

* The attributes of an entity have to be declared SOMEHOW beforehand AND then mapped to the actual attributes on the js object, when they WOULD OTHERWISE BE ALREADY AVAILABLE IN JS. This is duplication of effort.

* Dealing with mutually exclusive properties is a pain, you need a general way of dealing with contraddictions in prolog. 

* Also, making sure these are all paraphrases of each other: "the color of the button is red", "the button is red", "the background of the style of the button is red" would be a nightmare with prolog, probably easier to accomplish with a dynamic dispatch/distributed approach.

* Js is very much capable of using mixins and injecting new behavior into objects and prototypes on the fly, it's also got timers, intervals, event handlers, first order functions etc... 

