# SETTING PROPERTY ON PROTOTYPE DYNAMICALLY JAVASCRIPT

```javascript
Object.defineProperty(HTMLButtonElement.prototype, 'color', {value: ['style', 'background']}) 
```
# BINDING FUNCTION TO OBJECT AND INVOKING IT

```javascript
object[getSetterName(x)].bind(object)(prop)
```

# ASYNC SLEEP FUNCTION

```javascript

 async function sleep(millisecs: number) {
     return new Promise((ok, err) => {
         setTimeout(() => {
             ok(true)
         }, millisecs)
     })
 }

```

# RANGE

```javascript
const range = (n: number) => [...new Array(n).keys()]
```

# UNIQUE

```javascript
const uniq = (x: any[]) => Array.from(new Set(x))
```