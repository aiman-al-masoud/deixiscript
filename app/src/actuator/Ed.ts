import { Id } from "../clauses/Id";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): any
    set(id: Id, object: any): void
}

export default function getEd(): Ed {
    return new BaseEd()
}


class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: any } = {}) {

    }

    get(id: Id) {
        return this.dictionary[id]
    }

    set(id: Id, object: any): void {
        this.dictionary[id] = object
    }

}