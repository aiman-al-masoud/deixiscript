
/**
 * To do type-narrowing on Object.entries()'s type of value of entry
 */
export function valueIs<T>(f: (x: unknown) => x is T): (e: [string, unknown]) => e is [string, T] {
    return (e): e is [string, T] => f(e[1])
}

