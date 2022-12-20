import { Clause, Id, Map } from "../clauses/Clause";
import Brain from "./Brain";

/**
 * Entities in a new sentence potentially point to existing entities
 * in the universe (ie: {@link Brain}). {@link Sandbox} resolves the anaphora.
 */
export interface Sandbox {
    mapTo(universe: Brain): Map
}

export function getSandbox(clause: Clause) {
    return new BaseSandbox(clause)
}

class BaseSandbox implements Sandbox {

    constructor(readonly clause: Clause) {

    }

    mapTo(universe: Brain): Map {

        //TODO: what about entities in rheme? TODOOOOOOOOO

        // get entities in sanbox theme, map each to its full description 
        const descriptions = this.clause.theme.entities.map(e => ({ id: e, description: this.clause.theme.about(e) }))        

        // map full description to corresponding id in universe, if any
        const tuples = descriptions.map(d => {
            return {sandbox : d.id, universe : universe.find(d.description.map(d=>d.toString()).reduce((a,b)=>a+'. '+b))[0]  }
        })
        
        const mapping = tuples.map(t=> ({ [t.sandbox] : t.universe})).reduce((a,b) => ({...a,...b}))

        return mapping

    }

}