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
        this.lastReferenced = id
        return this.dictionary[id]
    }

    get values(): Wrapper[] {
        return Object.values(this.dictionary)
    }

    set = (wrapper: Wrapper): Wrapper => {
        this.lastReferenced = wrapper.id
        return this.dictionary[wrapper.id] = wrapper
    }

    query = (query: Clause): Map[] => {

        const universe = this.values
            .map(w => w.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        const maps = universe
            .query(query, { it: this.lastReferenced })
        // .map(m => this.convertMap(m))

        // console.log('query=', query.toString(), 'universe=', universe.toString(), 'maps=', maps)
        return maps
    }


}