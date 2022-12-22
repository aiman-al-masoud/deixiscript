import { Clause, clauseOf, Id, Map } from "../clauses/Clause";
import ListClause from "../clauses/ListClause";
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

        const mapToVar = this.clause.entities
            .map(e => ({ [e]: `${e}`.toUpperCase() })) // to variable
            .reduce((a, b) => ({ ...a, ...b }))

        const bigDescClause = themeDescs
            .concat(rhemeDescs).reduce((c1, c2) => c1.concat(c2))
            .copy({ map: mapToVar })

        const res = (await universe.query(bigDescClause)) as { [id: string]: Id[];[id: number]: Id[]; }

        const reverseMapToVar = Object.fromEntries(Object.entries(mapToVar).map(e => [e[1], e[0]]))

        return Object.keys(res)
            .map(k => ({ [reverseMapToVar[k]]: res[k][0] ?? reverseMapToVar[k] }))
            .reduce((a, b) => ({ ...a, ...b }))

    }

}