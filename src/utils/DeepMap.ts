import { hash } from "./hash.ts"

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
        return this.helperMap.get(hash(key))
    }

    override set(key: K, value: V): this {
        const h = hash(key)
        if(this.helperMap.has(h)) return this
        this.helperMap.set(h, value)
        return super.set(key, value)
    }

    repr() {
        return this.helperMap
    }

}
