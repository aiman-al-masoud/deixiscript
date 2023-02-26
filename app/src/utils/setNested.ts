export function setNested(object: any, path: string[], value: string) {

    let x = object

    path.slice(0, -1).forEach(p => {
        x = x[p]
    })

    x[path.at(-1)!] = value
}
