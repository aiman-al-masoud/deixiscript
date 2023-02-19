# SETTING PROPERTY ON PROTOTYPE DYNAMICALLY JAVASCRIPT

```javascript
Object.defineProperty(HTMLButtonElement.prototype, 'color', {value: ['style', 'background']}) 
```

# SETTING FUNCTION (METHOD) ON PROTOTYPE

```javascript
Object.defineProperty(Number.prototype, 'plus' , {value : function(a) { return this + a }  }) 
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


# ALL KEYS/PROPS
```javascript
export function keys(object: object, iter = 4) {

    let obj = object
    let res: string[] = []

    while (obj && iter) {
        res = [...res, ...Object.keys(obj)]
        res = [...res, ...Object.getOwnPropertyNames(obj)]
        obj = Object.getPrototypeOf(obj)
        iter--
    }

    return res
}
```

# TREE
```javascript
export function tree(object: any, iter = 3): any {


    
    if (iter > 0) {
        return keys(object).map(x => {
            
            console.log(x)
            
            try {
                return { [x]: tree(object[x], iter - 1) }
            } catch {
                return { [x]: undefined }
            }

        })
    }

    return keys(object).map(x => {
        try {
            return { [x]: keys(object[x]) }
        } catch {
            return { [x]: undefined }
        }
    })

}
```