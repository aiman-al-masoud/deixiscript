export function deepCopy(object: object) {

    if (object instanceof HTMLElement) {
        const wrapped = object.cloneNode(true) as HTMLElement
        wrapped.innerHTML = object.innerHTML
        return wrapped
    } else {
        // return { ...object }
        return { __proto__: object }
    }

}
