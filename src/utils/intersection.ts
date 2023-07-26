import { deepEquals } from "./deepEquals.ts"
import { hash } from "./hash.ts"
import { include } from "./include.ts"
import { uniq } from "./uniq.ts"

// /**
//  * Intersection between two lists of strings.
//  */
// export function intersection<T extends string>(xs: T[], ys: T[]) {
//     return uniq(xs.filter(x => ys.includes(x))
//         .concat(ys.filter(y => xs.includes(y))))
// }


export function intersection<T>(xs: T[], ys: T[]) {

    return uniq(xs.filter(x => include(ys, x))
        .concat(ys.filter(y => include(xs, y))))
}


