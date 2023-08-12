export function hasUnmatched(iterable: string[]) {
    const open = iterable.filter(x => x === '(').length
    const close = iterable.filter(x => x === ')').length
    return open !== close
}