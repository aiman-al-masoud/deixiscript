import { Clause, emptyClause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper, { wrap } from "./Wrapper";
import { Enviro } from "./Enviro";

export default class BaseEnviro implements Enviro {

    protected lastReferenced?: Id

    constructor(
        readonly root?: HTMLElement,
        readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    get(id: Id): Wrapper | undefined {
        return this.dictionary[id]
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

    set(id: Id, object?: object): Wrapper {

        this.lastReferenced = id

        const placeholder = this.dictionary[id]
        return this.dictionary[id] = placeholder?.copy({ object: object }) ?? wrap(id, object)

    }

    query(clause: Clause): Map[] { // TODO: refactor and handle pronouns better

        const universe = this.values
            .map(x => x.clause)
            .reduce((a, b) => a.and(b), emptyClause)

        const maps = universe.query(clause)
        const pronentities = clause.entities.filter(e => clause.describe(e).some(x => x.type === 'pronoun'))

        const pronextras = pronentities
            .map(e => ({ [e]: this.lastReferenced ?? '' }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        const maps2 = maps.map(m => ({ ...m, ...pronextras })).concat([pronextras])
        this.lastReferenced = maps2.flatMap(x => Object.values(x)).at(-1) ?? this.lastReferenced

        return maps2  // return list of maps, where each map should should have ALL ids from clause in its keys, eg: [{id2:id1, id4:id3}, {id2:1, id4:3}].
    }

}