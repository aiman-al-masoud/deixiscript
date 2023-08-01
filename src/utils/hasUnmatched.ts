export function hasUnmatched(iterable: string[]) {
    const open = iterable.map(x => x === '(' ? 1 : 0).reduce((a: number, b) => a + b, 0)
    const close = iterable.map(x => x === ')' ? 1 : 0).reduce((a: number, b) => a + b, 0)
    return open !== close
}
