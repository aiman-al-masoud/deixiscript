import { Clause, emptyClause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map, ThingMap } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import { Enviro, } from "./Enviro";

export default class BaseEnviro implements Enviro {

    protected lastReferenced?: Id

    constructor(
        readonly root?: HTMLElement,
        readonly dictionary: { [id: Id]: Wrapper } = {}) {

    }

    protected get = (id: Id): Wrapper | undefined => {
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

    query = (query: Clause): ThingMap[] => {

        const universe = this.values
            .map(w => w.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        const maps = universe
            .query(query, { it: this.lastReferenced })
            .map(m => this.convertMap(m))

        // console.log('query=', query.toString(), 'universe=', universe.toString(), 'maps=', maps)
        return maps
    }

    protected convertMap(map: Map): ThingMap {

        return Object
            .entries(map)
            .map(e => ({ [e[0]]: this.get(e[1])!/* TODO! */ }))
            .reduce((a, b) => ({ ...a, ...b }), {})
    }

}