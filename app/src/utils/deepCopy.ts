export function deepCopy(object: object) {

    if (object instanceof HTMLElement) {
        const wrapped = object.cloneNode() as HTMLElement
        wrapped.innerHTML = object.innerHTML
        return wrapped
    } else {
        return { ...object }
    }

}
