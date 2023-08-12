
/**
 * Like console.log() but can be overridden via a repr() method.
 */
export function print(...printable: unknown[]) {

    const printList = printable.map(x => {
        if (typeof x === 'object' && x !== null && 'repr' in x && typeof x.repr === 'function') {
            return x.repr()
        }
        return x
    })

    console.log(...printList)
}