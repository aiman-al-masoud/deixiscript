/**
 * 
 * Apply predicate to each element e in the iterable, stop when 
 * you find a non-nullish image of e, and return the image.
 */
export function first<T, U>(iterable: T[], predicate: (x: T, i: number) => U): U | undefined {

    for (let i = 0; i < iterable.length; i++) {
        const e = iterable[i]
        const maybeResult = predicate(e, i)

        if (maybeResult !== undefined && maybeResult !== null) {
            return maybeResult
        }
    }

}
