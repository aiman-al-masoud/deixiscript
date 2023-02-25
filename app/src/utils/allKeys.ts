

export function allKeys(object: object, iter = 5) {

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