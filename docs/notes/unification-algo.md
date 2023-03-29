# Example 1

## query

```
background(X),of(X,Y),style(Y),of(Y,Z),button(Z),red(X).
```

## universe

```
background(1),of(1,2),style(2),of(2,3),button(3),red(1),background(10),of(10,11),
style(11),of(11,12),button(12),red(10).
```

Each row represents a list of maps that may agree or disagree with other rows:

```
{x:1},{x:10}
{x:1,y:2},{x:2,y:3},{x:10,y:11},{x:11,y:12}
{y:2},{y:11}
{y:1,z:2},{y:2,z:3},{y:10,z:11},{y:11,z:12}
{z:3},{z:12}
{x:1},{x:10}
```

Rearrange just for simplicity:

```
{x:1},{x:10}
{x:1},{x:10} //duplicate
{y:2},{y:11}
{z:3},{z:12}
{x:1,y:2},{x:2,y:3},{x:10,y:11},{x:11,y:12}
{y:1,z:2},{y:2,z:3},{y:10,z:11},{y:11,z:12}
```

![](../res/solving-map-unif-equation.png)

---

# Example 2

## query

```
background(X),of(X,Y),style(Y),of(Y,Z),button(Z),red(X).
```

## universe

```
background(1),of(1,2),style(2),of(2,3),button(3),red(1),background(10),of(10,11),
style(11),of(11,12),button(12),green(10).
```

```
{x:1},{x:10}
{x:1,y:2},{x:2,y:3},{x:10,y:11},{x:11,y:12}
{y:2},{y:11}
{y:1,z:2},{y:2,z:3},{y:10,z:11},{y:11,z:12}
{z:3},{z:12}
{x:1}
```

Rearrange:

```
{x:1}
{x:1},{x:10}
{y:2},{y:11}
{z:3},{z:12}
{x:1,y:2},{x:2,y:3},{x:10,y:11},{x:11,y:12}
{y:1,z:2},{y:2,z:3},{y:10,z:11},{y:11,z:12}
```

### Eliminating conflicts

In this case you first need to resolve the conflict: _**`{x:1}` vs `{x:1},{x:10}`**_, by
eliminating the most permissive, ie: `{x:1},{x:10}`. This is `removeLongest()`'s
job.


### "foobar x" BUG


#### example 1

> foobar x

```
query = foobar(id1),x(id1)
universe = x(id11),button(id11)
```

* []             // for foobar
* [{id1:id11}]   // for x

#### example 2

> foobar x and baz y

```
query = foobar(1),x(1),baz(2),y(2)
universe = baz(22),y(22),x(11),button(11)
```

* []
* [{1:11}]
* [{2:22}]
* [{2:22}]

Maybe:


* [{1:undefined}]
* [{1:11}]
* [{2:22}]
* [{2:22}]

so that id 1 will just map to nothing




