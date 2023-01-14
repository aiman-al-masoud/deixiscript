An elementary subset of the language that is basically a natural language sugar-coat over javascript. It corresponds to how some programmer could "declaim" a line of code, in correct English. It may have a minimum level of syntactic flexibility. It serves the purpose of bootstrapping the rest of the language onto it. Examples:

```
background of style of x is red. 
```

```javascript
x.style.background = 'red'
```

```
invoke push on x with 1.
```
```javascript
x.push(1)
```

```
invoke appendChild on x with y.
```

```javascript
x.appendChild(y)
```

A set of mechanisms to create higher order abstractions, bootstrapped on the basic js-like subset of the language:

```
background of style of x is color of x.
```

```
y is on x means invoke appendChild on x with y.
```