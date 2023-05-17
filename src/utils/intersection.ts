import { uniq } from "./uniq.ts"

/**
 * Intersection between two lists of strings.
 */
export function intersection<T extends string>(xs: T[], ys: T[]) {
    return uniq(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))))
}
