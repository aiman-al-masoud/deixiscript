/**
 * Remove duplicates from a list of primitives (numbers, bools, strings).
 * Careful using this with objects.
 */
export function uniq(seq: any[]) {
    const seen = {} as any

    return seq.filter(e => {
        const k = JSON.stringify(e)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
}