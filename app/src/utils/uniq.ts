/**
 * Remove duplicates from an array. Equality by JSON.stringify.
 */
export function uniq(seq: any[]) {
    let seen = {} as any

    return seq.filter(e => {
        const k = JSON.stringify(e)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
}