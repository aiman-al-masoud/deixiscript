import { Id } from "../clauses/Id";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): Promise<any>
    set(id: Id, object: any): void
    get keys(): Id[]
    get values(): any[]
}

export default function getEd(): Ed {
    return new BaseEd()
}

class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: any } = {}) {

    }

    async get(id: Id) {

        const object = this.dictionary[id]

        if (object) {
            return object // in case id is available immediately
        }

        return new Promise((ok, err) => {
            setTimeout(() => {
                ok(this.dictionary[id])
            }, 400) // wait some ms for id to be populated
        })

    }

    set(id: Id, object: any): void {
        this.dictionary[id] = object
    }

    get keys(): Id[] {
        return Object.keys(this.dictionary)
    }

    get values(): Id[] {
        return Object.values(this.dictionary)
    }

}