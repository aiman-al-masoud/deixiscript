import { Clause, Id, Map, toVar } from "../clauses/Clause";
import Brain from "./Brain";

/**
 * Entities in a new sentence potentially point to existing entities
 * in the universe (ie: {@link Brain}). {@link Sandbox} resolves the anaphora.
 */
export interface Sandbox {
    mapTo(universe: Brain): Promise<Map>
}

export function getSandbox(clause: Clause): Sandbox {
    return new BaseSandbox(clause)
}

class BaseSandbox implements Sandbox {

    constructor(readonly clause: Clause) {

    }

    async mapTo(universe: Brain): Promise<Map> {

        const themeEnts = this.clause.theme.entities

        // get descriptions of entities in theme omitting relations with entities in rheme
        const themeDescs = this.clause.theme.flatList()
            .filter(e => !e.isImply)

        // get descriptions of entities in rheme omitting relations with entities in theme
        const rhemeDescs = this.clause.rheme.flatList()
            .filter(c => themeEnts.every(e => !c.entities.includes(e)))
            .filter(e => !e.isImply)

        const mapToVar = this.clause.entities
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const reverseMapToVar = Object.fromEntries(Object.entries(mapToVar).map(e => [e[1], e[0]]))

        const bigDescClause = themeDescs
            .concat(rhemeDescs).reduce((c1, c2) => c1.concat(c2))
            .copy({ map: mapToVar })

        const res = (await universe.query(bigDescClause)) as { [id: Id]: Id[] }

        return Object.keys(res)
            .map(k => ({ [reverseMapToVar[k]]: res[k][0] ?? reverseMapToVar[k] }))
            .reduce((a, b) => ({ ...a, ...b }), {})

    }

}