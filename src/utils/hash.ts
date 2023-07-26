import { sorted } from "./sorted.ts"


export function hash(obj: unknown) {
    const sortedObject = sortObjectKeys(obj)
    const s = JSON.stringify(sortedObject)
    return s
}

function sortObjectKeys<T>(obj: T): T
function sortObjectKeys(obj: unknown): unknown {

    if (obj == null || obj == undefined) return obj

    if (typeof obj !== 'object') return obj

    if (obj instanceof Array) return obj.map(sortObjectKeys)

    if (obj instanceof Map) {
        const x = Object.fromEntries(Array.from(obj.entries()))
        return sortObjectKeys(x)
    }

    type Indexable = { [s: string]: object }

    const indexable = obj as Indexable

    return sorted(Object.keys(indexable)).reduce((acc, key) => {

        const e = indexable[key]

        if (e instanceof Array) {
            acc[key] = e.map(sortObjectKeys)
        }
        else if (typeof e === 'object') {
            acc[key] = sortObjectKeys(e)
        }
        else {
            acc[key] = e
        }

        return acc
    }, {} as Indexable)
}