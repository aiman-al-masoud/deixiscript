
```ebnf
noun := str | number | bool
which := head:np 'which' which:ast
numerality := 'the' card:number=1 head:np
np := noun | which | numerality
binexp := left:ast op:binop right:ast
binop := 'and' | 'or' | '+' | 'when' | 'after'
unexp := op:unop val:ast 
simplesentence := subject:ast='' 'does' verb:np='' object:ast=''
```

lexer
literals
defaults
unions
sequences
names (for AST)