
/**
 * A functional sort() without side-effects.
 */
export function sorted<T>(iterable: T[], cmp?: (a: T, b: T) => number): T[] {
    const shallowCopy = [...iterable]
    shallowCopy.sort(cmp)
    return shallowCopy
}

// const ar = [3, 2, 1, -1, 0]
// const st = sorted(ar, (a, b) => a - b)
// console.log(ar, st)
