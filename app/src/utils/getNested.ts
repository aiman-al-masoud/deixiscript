export function getNested(object: any, path: string[]) {

    let x = object[path[0]] // assume at least one

    path.slice(1).forEach(p => {
        x = x?.[p]
    })

    return x

}
