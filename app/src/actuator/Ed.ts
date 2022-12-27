import { Id } from "../clauses/Id";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): any
    set(id: Id, object: any): void
    get keys():Id[]
    get values():any[]

}

export default function getEd(): Ed {
    return new BaseEd()
}


class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: any } = {}) {

    }

    get(id: Id) { //TODO consider making async 
        return this.dictionary[id]
    }

    set(id: Id, object: any): void {
        this.dictionary[id] = object
    }

    get keys():Id[]{
        return Object.keys(this.dictionary)
    }

    get values():Id[]{
        return Object.values(this.dictionary)
    }

}