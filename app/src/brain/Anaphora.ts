import { Clause, emptyClause } from "../clauses/Clause";
import { Id, isVar, Map, toVar } from "../clauses/Id";
import Brain, { getBrain } from "./Brain";

/**
 * Entities in a new sentence potentially point to existing entities
 * in the universe (ie: {@link Brain}). {@link Anaphora} resolves the anaphora.
 */
export interface Anaphora {
    mapTo(universe: Brain): Promise<Map>
    mapToClause(clause: Clause): Promise<Map>
}

export function getAnaphora(clause: Clause): Anaphora {
    return new BaseAnaphora(clause)
}

class BaseAnaphora implements Anaphora {

    constructor(readonly clause: Clause) {

    }

    async mapTo(universe: Brain): Promise<Map> {

        if (this.clause.entities.every(e => isVar(e))) { // this is a pure implication //TODO: possbile problem: every cat that is on the mat
            return {}
        }

        const themeEnts = this.clause.theme.entities

        // get descriptions of entities in theme omitting relations with entities in rheme
        const themeDescs = this.clause.theme.flatList()

        // get descriptions of entities in rheme omitting relations with entities in theme
        const rhemeDescs = this.clause.rheme.flatList()
            .filter(c => themeEnts.every(e => !c.entities.includes(e)))

        const mapToVar = this.clause.entities
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const reverseMapToVar = Object.fromEntries(Object.entries(mapToVar).map(e => [e[1], e[0]]))

        const bigDescClause = themeDescs
            .concat(rhemeDescs)
            .reduce((c1, c2) => c1.and(c2), emptyClause())

        const entities = bigDescClause.entities 

        // to avoid that one single standalone entity break all of the query by preventing the other entities from being found
        const separatedDescs = entities.map(e => bigDescClause.about(e))

        // console.log('searching for anaphora x')
        // separatedDescs.forEach(c=>{
            // console.info(c.copy({map:mapToVar}).toProlog({anyFactId:true}))
        // })

        const forEachEntity = await Promise.all(separatedDescs.map(c => universe.query(c.copy({ map: mapToVar }))))

        const candidates = forEachEntity.map(m => m[0] ?? {}) //TODO: better choice criterion !!!
        
        const chosen = candidates.reduce((a,b)=>({...a,...b}))

        const anaphora = Object
            .keys(chosen)
            .map(k => ({ [reverseMapToVar[k]]: chosen[k] ?? reverseMapToVar[k] }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return anaphora
    }

    async mapToClause(clause: Clause): Promise<Map> {
        const brain = await getBrain({ withActuator: false })
        await brain.assert(clause)
        return this.mapTo(brain)
    }

}

