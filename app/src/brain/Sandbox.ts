import { Clause, Id, Map } from "../clauses/Clause";
import Brain from "./Brain";

/**
 * Entities in a new sentence potentially point to existing entities
 * in the universe (ie: {@link Brain}). {@link Sandbox} resolves the anaphora.
 */
export interface Sandbox {
    mapTo(universe: Brain): Promise<Map>
}

export function getSandbox(clause: Clause) {
    return new BaseSandbox(clause)
}

class BaseSandbox implements Sandbox {

    constructor(readonly clause: Clause) {

    }

    async mapTo(universe: Brain): Promise<Map> {


        const themeEnts = this.clause.theme.entities
        const rhemeEnts = this.clause.rheme.entities

        // get descriptions of entities in theme omitting relations with entities in rheme
        const themeDescs = themeEnts
            .map(e => this.clause.theme.about(e).reduce((a, b) => a.concat(b))) // get descriptions

        // get descriptions of entities in rheme omitting relations with entities in theme
        const rhemeDescs = rhemeEnts
            .flatMap(e => this.clause.rheme.about(e))
            .filter(c => themeEnts.every(e => !c.entities.includes(e))) // every theme entity is not included in any rhemedesc

        const descriptions = themeDescs.concat(rhemeDescs)
        

        // .flatMap(e => ({ id: e, desc: this.clause.rheme.about(e) }))

        // .filter(c => themeEnts.every(e => !c.entities.includes(e))) // every theme-entity shouldn't be included in description


        // get entities (at least once) in theme, entities in theme should 
        // be looked up in universe without mentioning new info about them in rheme.
        // const themeEntities = this.clause.theme.entities



        // get entities in rheme and not in theme, entitites in rheme 
        // should be looked up without mentioning their relationship with entities in theme.
        // const rhemeEntities = this.clause.rheme.entities.filter(e=>!themeEntities.includes(e))

        // // map entity each to its full description
        // const descriptions = themeEntities.map(e => ({ [e]: this.clause.theme.about(e).reduce((c1, c2)=> c1.concat(c2)) }))
        //                         .concat(rhemeEntities.map(e => ({ [e]: this.clause.rheme.about(e).reduce((c1, c2)=> c1.concat(c2)) })))
        //                         .reduce((a, b) => ({ ...a, ...b }))


        // map entity in sanbox to entity in universe (through description) 


        // universe.query()

        // console.log(descriptions)


        return {}

        // map full description to corresponding id in universe, if any
        // const tuples = descriptions.map(async (d) => {
        // return {sandbox : d.id, universe : (await universe.find(d.description.map(d=>d.toString()).reduce((a,b)=>a+'. '+b)))   [0] }
        // })

        // const mapping = tuples.map(t=> ({ [t.sandbox] : t.universe})).reduce((a,b) => ({...a,...b}))

        // return mapping
        // throw new Error('not implemented!')
    }

}