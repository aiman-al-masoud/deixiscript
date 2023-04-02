import { Clause, emptyClause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import { Enviro, } from "./Enviro";

export default class BaseEnviro implements Enviro {

    protected lastReferenced?: Id

    constructor(
        readonly root?: HTMLElement,
        readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    get = (id: Id): Wrapper | undefined => {

        const parts = id.split('.')
        const p1 = parts[0]
        const w = this.dictionary[p1]

        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'))
        }

        this.setLastReferenced(p1)
        return w
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

    set = (wrapper: Wrapper): Wrapper => {
        this.setLastReferenced(wrapper.id)
        return this.dictionary[wrapper.id] = wrapper
    }

    query = (query: Clause): Map[] => {

        const universe = this.values
            .map(w => w.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        const maps = universe
            .query(query, { it: this.lastReferenced })

        // console.log('query=', query.toString(), 'universe=', universe.toString(), 'maps=', maps)
        return maps
    }

    protected setLastReferenced(lastReferenced: Id) {
        if (Object.keys(this.dictionary).includes(lastReferenced)) {
            this.lastReferenced = lastReferenced
        }
    }


}