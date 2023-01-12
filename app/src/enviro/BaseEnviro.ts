import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import { Enviro } from "./Enviro";
import { Placeholder } from "./Placeholder";

export default class BaseEnviro implements Enviro {

    constructor(readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    async get(id: Id): Promise<Wrapper> {
        return this.dictionary[id] //TODO: could be undefined!
    }

    set(id: Id, object: Wrapper): void {

        const placeholder = this.dictionary[id]

        if (placeholder && placeholder instanceof Placeholder) {

            placeholder.predicates.forEach(p => {
                object.set(p)
            })

            this.dictionary[id] = object
        }

    }

    async query(clause: Clause): Promise<Map> {

        //TODO this is a tmp solution, for anaphora resolution, but just with descriptions, without taking (multi-entity) relationships into account

        const universe = Object
            .entries(this.dictionary)
            .map(x => ({ e: x[0], w: x[1] }))

        const query = clause
            .entities
            .map(e => ({ e, desc: clause.theme.describe(e) }))

        const res = query
            .map(q => ({ from: q.e, to: universe.find(u => q.desc.every(d => u.w.is(d))) }))
            .filter(x => x.to !== undefined)
            .map(x => ({ [x.from]: x.to?.e }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return res as Map
    }

    setPlaceholder(id: Id): void {
        this.dictionary[id] = new Placeholder()
    }

    exists(id: Id): boolean {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder)
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

}