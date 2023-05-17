export function deepMapOf<K, V>(entries?: readonly (readonly [K, V])[] | null): DeepMap<K, V> {
    const map = new DeepMap<K, V>()

    entries?.forEach(e => {
        map.set(e[0], e[1])
    })

    return map
}

export class DeepMap<K, V> extends Map<K, V>{

    readonly helperMap: Map<string, V> = new Map()

    override get(key: K): V | undefined {
        return this.helperMap.get(JSON.stringify(key))
    }

    override set(key: K, value: V): this {
        this.helperMap.set(JSON.stringify(key), value)
        return super.set(key, value)
    }

}

// const map = deepMapOf([[{ x: 1 }, 1], [{ y: 2 }, 2]])
// console.log(map.get({ x: 1 }))