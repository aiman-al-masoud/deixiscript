/**
 * Return copy of array with deduplicated elements in the same order
 * as first occurrence in original array. Equality by JSON.stringify.
 */
export function uniq<T>(seq: T[]): T[] {
    const seen: { [key: string]: boolean } = {}

    return seq.filter(e => {
        const k = JSON.stringify(e)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
}