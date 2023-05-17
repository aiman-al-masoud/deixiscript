/**
 * 
 * Apply predicate to each element e in the iterable, stop when 
 * you find a non-nullish image of e, and return the image.
 */
export function first<T, U>(iterable: T[], predicate: (x: T) => U): U | undefined {

    for (const e of iterable) {
        const maybeResult = predicate(e)
                
        if (maybeResult !== undefined && maybeResult !== null) {
            return maybeResult
        }
    }

}