
/**
 * Puts a new separator element in between every two consecutive elements of the array.
 * 
 * putInBetween(['a', 'b', 'c'], '|') = ['a', '|', 'b', '|', 'c']
 */
export function putInBetween<T>(array: T[], sep: T) {
    return array.flatMap((v, i, a) => i === a.length - 1 ? v : [v, sep])
}
