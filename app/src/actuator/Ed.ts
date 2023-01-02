import { Id } from "../clauses/Id";
import { wrap, WrapOpts, Wrapper } from "./Wrapper";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): Promise<Wrapper>
    set(id: Id, object: any, opts?: WrapOpts): void
    get keys(): Id[]
    get values(): Wrapper[]
}

export default function getEd(): Ed {
    return new BaseEd()
}

class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    async get(id: Id): Promise<Wrapper> {

        return new Promise((ok, err) => {

            const interval = setInterval(() => {

                if (this.dictionary[id]) {
                    clearInterval(interval)
                    ok(this.dictionary[id])
                }

            }, 100)
        })

    }

    set(id: Id, object: any, opts?: WrapOpts): void {
        this.dictionary[id] = wrap(object, opts)
    }

    get keys(): Id[] {
        return Object.keys(this.dictionary)
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

}