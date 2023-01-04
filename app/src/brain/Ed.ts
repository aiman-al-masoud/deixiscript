import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";


/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed {
    get(id: Id): Promise<any>
    set(id: Id, object: any): void
    query(clause: Clause): Promise<Map[]>
    get keys(): Id[]
    get values(): any[]
}

export default function getEd(): Ed {
    return new BaseEd()
}

class BaseEd implements Ed {

    constructor(readonly dictionary: { [id: Id]: any } = {}) {
        
    }
    
    async query(clause: Clause): Promise<Map[]> {
        // throw new Error("Method not implemented.");
        return []
    }

    async get(id: Id): Promise<any> {

        return new Promise((ok, err) => {

            const interval = setInterval(() => {

                if (this.dictionary[id]) {
                    clearInterval(interval)
                    ok(this.dictionary[id])
                }

            }, 100)
        })

    }

    set(id: Id, object: any): void {
        this.dictionary[id] = object
    }

    get keys(): Id[] {
        return Object.keys(this.dictionary)
    }

    get values(): any[] {
        return Object.values(this.dictionary)
    }

}