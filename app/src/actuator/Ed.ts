import { Id } from "../clauses/Id";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): Promise<any>
    set(id: Id, object: any, opts?: SetOpts): void
    getJsName(id: Id): Promise<string | undefined>
    get keys(): Id[]
    get values(): any[]
}

export default function getEd(): Ed {
    return new BaseEd()
}

export interface SetOpts {
    jsName: string
}

class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: any } = {},
        readonly jsNames: { [id: Id]: string | undefined } = {}) {

    }

    async get(id: Id) {

        return new Promise((ok, err) => {

            const interval = setInterval(() => {

                console.log('interval running for id:', id)

                if (this.dictionary[id]) {
                    clearInterval(interval)
                    ok(this.dictionary[id])
                }

            }, 100)
        })

    }

    set(id: Id, object: any, opts?: SetOpts): void {
        this.dictionary[id] = object
        this.jsNames[id] = opts?.jsName
    }

    get keys(): Id[] {
        return Object.keys(this.dictionary)
    }

    get values(): Id[] {
        return Object.values(this.dictionary)
    }

    async getJsName(id: Id): Promise<string | undefined> {

        const object = this.jsNames[id]

        if (object) {
            return object // in case id is available immediately
        }

        return new Promise((ok, err) => {
            setTimeout(() => {
                ok(this.jsNames[id])
            }, 3000) // wait some ms for id to be populated
        })

    }

}