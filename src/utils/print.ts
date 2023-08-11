
/**
 * Like console.log() but can be overridden via a repr() method.
 */
export function print(x: unknown) {

    if (typeof x === 'object' && x !== null && 'repr' in x && typeof x.repr === 'function') {
        console.log(x.repr())
        return
    }

    console.log(x)
}