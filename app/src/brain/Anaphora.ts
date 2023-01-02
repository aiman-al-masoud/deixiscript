import { Clause, emptyClause } from "../clauses/Clause";
import { Map, toVar } from "../clauses/Id";
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

    async mapTo(universe: Brain): Promise<Map> { // nothing 'new' should be said about any entity // to "not say anything new" about theme entities -> get their desc only from theme // to "not say anything new" about rheme entities -> don't mention anything about their relation to theme entities // rheme entities should NOT include any entities in rheme BUT ALSO IN THEME.

        if (this.clause.entities.length === 0) {
            return {} // no entities --> no anaphora
        }

        // console.log('entities', this.clause.entities)

        const themeDesc = this.clause.theme
        const themeEntities = this.clause.theme.entities

        // console.log({ themeEntities })

        const rhemeDesc = this.clause.rheme
            .flatList()
            .filter(c => !themeEntities.some(e => c.entities.includes(e)))
            .reduce((a, b) => a.and(b), emptyClause())

        // console.log({ rhemeDesc })

        const heyDesc = themeDesc.and(rhemeDesc)

        // console.log({ heyDesc })

        const mapToVar = heyDesc.entities.map(e => ({ [e]: toVar(e) })).reduce((a, b) => ({ ...a, ...b }))

        // console.log({ mapToVar })

        const reverseMapToVar = Object.fromEntries(Object.entries(mapToVar).map(e => [e[1], e[0]]))

        // console.log({ reverseMapToVar })

        const brainState = (await universe.snapshot()).be
        
        // console.log({brainState})

        // ----------------
        const candidates = await universe.query(heyDesc.copy({ map: mapToVar }))

        const chosen = candidates[0] ?? {}

        // console.log({ chosen })

        const anaphora = Object
            .keys(chosen)
            .map(k => ({ [reverseMapToVar[k]]: chosen[k] ?? reverseMapToVar[k] }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        // console.log({ anaphora })
        return anaphora
        // --------------------------------

        

        // const separatedDescs = heyDesc.entities.map(e => heyDesc.about(e))

        // console.log({separatedDescs})

        // const separatedRes = await Promise.all(separatedDescs.map(c => universe.query(c.copy({ map: mapToVar }))))


        // const candidates = separatedRes.map(m => m[0] ?? {}) //TODO: better choice criterion !!!
        // const chosen = candidates.reduce((a, b) => ({ ...a, ...b }))

        // const anaphora = Object
        //     .keys(chosen)
        //     .map(k => ({ [reverseMapToVar[k]]: chosen[k] ?? reverseMapToVar[k] }))
        //     .reduce((a, b) => ({ ...a, ...b }), {})

        // console.log({anaphora})

        // return anaphora
    }

    async mapToClause(clause: Clause): Promise<Map> {
        const brain = await getBrain({ withActuator: false })
        await brain.assert(clause)
        return this.mapTo(brain)
    }

}