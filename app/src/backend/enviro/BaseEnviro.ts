import { Clause, emptyClause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper, { wrap } from "../wrapper/Wrapper";
import { Enviro, SetArgs1, SetArgs2 } from "./Enviro";

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

    set = (args: SetArgs1 | SetArgs2): Wrapper => {

        switch (args.type) {
            case 1:
                this.lastReferenced = args.id
                return this.dictionary[args.id] = wrap(args)
            case 2:
                this.lastReferenced = args.wrapper.id
                return this.dictionary[args.wrapper.id] = args.wrapper
        }

    }

    query = (query: Clause): Map[] => {

        const universe = this.values
            .map(w => w.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        return universe.query(query, { it: this.lastReferenced })

    }

}