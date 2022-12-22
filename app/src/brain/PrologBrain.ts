import { Clause, Id, toVar } from "../clauses/Clause";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";
import { getSandbox } from "./Sandbox";

export default class PrologBrain implements Brain {

    readonly kb: Prolog

    constructor() {
        this.kb = getProlog()
    }

    async query(query: Clause): Promise<{ [id: Id]: Id[] } | boolean> {

        const mapToVar = query.entities.map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const q = query.copy({ map: mapToVar })
                       .flatList()
                       .map(c => c.toString()).reduce((a, b) => `${a}, ${b}`) + '.' // TODO: deal with dot at a lower level ?

        return await this.kb.query(q)
    }

    async assert(clause: Clause): Promise<void> {

        const anaphoraMap = await getSandbox(clause).mapTo(this)
        console.debug({ anaphoraMap })

        const clauses = clause
            .copy({ map: anaphoraMap })
            .flatList()
            .map(c => c.toString())

        console.debug('asserting', clauses)

        for (const c of clauses) {
            await this.kb.assert(c)
        }

    }

}