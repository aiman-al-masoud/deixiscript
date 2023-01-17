import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import { Enviro } from "./Enviro";
import { Placeholder } from "./Placeholder";

export default class BaseEnviro implements Enviro {

    constructor(readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    async get(id: Id): Promise<Wrapper | undefined> {
        return this.dictionary[id]
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

    setPlaceholder(id: Id): void {
        this.dictionary[id] = new Placeholder()
    }

    exists(id: Id): boolean {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder)
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

    async query(clause: Clause): Promise<Map[]> { //TODO this is a tmp solution, for anaphora resolution, but just with descriptions, without taking (multi-entity) relationships into account

        const universe = Object
            .entries(this.dictionary)
            .map(x => ({ e: x[0], w: x[1] }))

        const query = clause // described entities
            .entities
            .map(e => ({ e, desc: clause.theme.describe(e) }))

        const res = query
            .flatMap(q => ({ from: q.e, to: universe.filter(u => q.desc.every(d => u.w.is(d))) }))

        const resSize = Math.max(...res.map(q => q.to.length));
        const fromToTo = (from: Id) => res.filter(x => x.from === from)[0].to.map(x => x.e);
        const range = (n: number) => [...new Array(n).keys()]

        const res2 = range(resSize).map(i =>
            clause
                .entities
                .filter(from => fromToTo(from).length > 0)
                .map(from => ({ [from]: fromToTo(from)[i] ?? fromToTo(from)[0] }))
                .reduce((a, b) => ({ ...a, ...b })))

        return res2 // return list of maps, where each map should should have ALL ids from clause in its keys, eg: [{id2:id1, id4:id3}, {id2:1, id4:3}].
    }

}