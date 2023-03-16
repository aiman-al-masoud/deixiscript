/**
 * Remove duplicates from a list of primitives (numbers, bools, strings).
 * Careful using this with objects.
 */
export function uniq(a: any[]) {
    const seen = {} as any
    return a.filter(item => seen.hasOwnProperty(item) ? false : (seen[item] = true))
}