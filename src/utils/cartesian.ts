
/**
 * Computes the n-wise combinations between a set of n vectors.
 * https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
 */
export function cartesian<T>(...args: T[][]): T[][] {
    const results: T[][] = []
    const max = args.length - 1

    function helper(arr: T[], i: number) {
        for (let j = 0, l = args[i].length; j < l; j++) {

            const a = arr.slice(0)// clone arr

            a.push(args[i][j])

            if (i == max) {
                results.push(a)
            } else {
                helper(a, i + 1)
            }
        }
    }

    helper([], 0)
    return results
}