import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import Wrapper from "../concepts/Wrapper";
import { Enviro } from "./Enviro";

export default class BaseEnviro implements Enviro {

    constructor(readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    async get(id: Id): Promise<Wrapper> {
        return this.dictionary[id]
    }

    set(id: Id, object: Wrapper): void {
        this.dictionary[id] = object
    }

    async query(clause: Clause): Promise<{ [id: Id]: Id | undefined }> {

        // for each entity in the clause, get the entities that match 
        // its description in the dictionary
        //TODO tmp solution, for anaphora resolution, but without taking (multi-entity) relationships into account

        const universe = Object
            .entries(this.dictionary)

        const query = clause
            .entities
            .map(e => ({ e, d: clause.describe(e) }))

        const res = query
            .map(q => ({ [q.e]: universe.find(u => q.d.every(s => u[1].is(s)))?.[0] }))
            .reduce((a, b) => ({ ...a, ...b }))

        return res
    }

}