
/**
 * Remove duplicates from a list of primitives (numbers, bools, strings).
 * Careful using this with objects.
 */
// export const uniq = (x: any[]) => Array.from(new Set(x))


export function uniq(a: any[]) {
    var seen = {} as any
    return a.filter(item => seen.hasOwnProperty(item) ? false : (seen[item] = true))
}