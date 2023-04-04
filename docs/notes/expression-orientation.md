Can you force logical clauses to behave like espressions? (composable AND return a value) And also some clauses should represent fixed values and take no arguments.

toClause() is the most suitable place to do this

y is 2 plus the first number 
((y) is ((2) plus (the first number)))

noun phrases could "resolve to variables"

the button is red

((the button) is (red))

the red button appendChilds y

((the red button) appendChilds (y))

((the red button) appendChilds (y and z))

resolve (the red button) to one or more vars
resolve y and z to two or more vars
apply appendChilds from each subject to each object

((x) is (red)) 
((x) is (a button)). 
((y) is (a green button)).


((the color of (the button)) is (red))

resolve (the color of (the button))
resolve (red)
apply rhs to lhs


(if ((x) is (red)) then ((y) is (a blue button)))


resolve condition
if condition is not empty run the consequence

