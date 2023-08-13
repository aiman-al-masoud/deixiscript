export function isNotNullish<T>(x: T | undefined | null): x is T {
    return x !== undefined && x !== null
}

export function isNullish<T>(x: T | undefined | null): x is undefined | null {
    return !isNotNullish(x)
}
