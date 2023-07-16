import { hash } from "./hash.ts"

/**
 * Return copy of array with deduplicated elements in the same order
 * as first occurrence in original array.
 */
export function uniq<T>(seq: T[]): T[] {
    const seen: { [key: string]: boolean } = {}

    return seq.filter(e => {
        const k = hash(e)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
}