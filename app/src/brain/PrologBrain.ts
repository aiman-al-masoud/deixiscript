import { Clause, Id } from "../clauses/Clause";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";

export default class PrologBrain implements Brain {

    readonly kb: Prolog

    constructor() {
        this.kb = getProlog()
    }

    async query(query: Clause): Promise<{[id:Id] : Id[]} | boolean>{

        // TODO: deal with dot at a lower level ?

        const q = query.flatList().map(c => c.toString()).reduce((a,b)=>`${a}, ${b}`)+'.'
        // console.log({ q })
        return await this.kb.query(q)
    }

    async assert(clause: Clause): Promise<void> {

        const clauses = clause.flatList().map(c => c.toString())

        for (const c of clauses) {
            await this.kb.assert(c)
        }

    }

}