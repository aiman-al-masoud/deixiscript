import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import Wrapper from "../concepts/Wrapper";
import { Enviro } from "./Enviro";

export default class BaseEnviro implements Enviro {

    constructor(readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    async get(id: Id): Promise<Wrapper> {

        // return this.dictionary[id] // TODO: could be undefined!

        return new Promise((ok, err) => {

            const interval = setInterval(() => {

                if (this.dictionary[id]) {
                    clearInterval(interval)
                    ok(this.dictionary[id] as Wrapper)
                }

            }, 100)
        })

    }

    set(id: Id, object: Wrapper): void {
        // this.dictionary[id] = object

        const placeholder = this.dictionary[id]

        if (placeholder && placeholder instanceof Placeholder) {

            placeholder.predicates.forEach(p => {
                object.set(p)
            })

            this.dictionary[id] = object
        }

    }

    async query(clause: Clause): Promise<{ [id: Id]: Id | undefined }> {

        // for each entity in the clause, get the entities that match its description in the dictionary
        //TODO tmp solution, for anaphora resolution, but without taking (multi-entity) relationships into account

        const universe = Object
            .entries(this.dictionary)
            
        const query = clause
            .entities
            .map(e => ({ e, d: clause.theme.describe(e) }))

        const res = query
            .map(q => ({ [q.e]: universe.find(u => q.d.every(s => u[1]?.is(s)))?.[0] }))
            .reduce((a, b) => ({ ...a, ...b }))

        return res
    }

    setPlaceholder(id: Id): void {
        this.dictionary[id] = new Placeholder()
    }

    exists(id: Id): boolean {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder)
    }

}

class Placeholder implements Wrapper {

    constructor(readonly predicates: string[] = []) {

    }

    set(predicate: string, props: string[]): void {
        console.log({props})
        this.predicates.push(predicate)
    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return this.predicates.includes(predicate)
    }

}