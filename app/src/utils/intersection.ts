import { uniq } from "./uniq"

/**
 * Intersection between two lists of strings.
 */
export function intersection(xs: string[], ys: string[]) {
    return uniq(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))))
}
