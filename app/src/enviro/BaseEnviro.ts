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
        this.lastReferenced = id
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

    query(query: Clause): Map[] { // TODO: refactor and handle pronouns better

        const universe = this.values
            .map(w => w.clause())
            .reduce((a, b) => a.and(b), emptyClause)

        const maps = universe.query(query)

        const proMap = pronounsMap(query, this.lastReferenced)

        const maps2 = maps
            .map(m => ({ ...m, ...proMap }))
            .concat([proMap])

        return maps2
    }

}

function pronounsMap(query: Clause, lastReferenced?: Id): Map {

    if (!lastReferenced) {
        return {}
    }

    const pronextras = query
        .entities
        .filter(e => query.describe(e).some(x => x.type === 'pronoun'))
        .map(e => ({ [e]: lastReferenced }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    return pronextras

}