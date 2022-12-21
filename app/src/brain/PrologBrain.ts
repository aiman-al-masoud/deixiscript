import { Clause, Id } from "../clauses/Clause";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";

export default class PrologBrain implements Brain{

    readonly kb:Prolog

    constructor(){
        this.kb = getProlog()
    }

    async query(query: Clause): Promise<boolean | Id[]> {

        // TODO: combine list into anded conditions of query
        // TODO: deal with dot at a lower level

        const q = query.flatList().map(c => c.toString())[0] + '.'
        console.log({q})
        return await this.kb.query(q)
    }

    async assert(clause: Clause): Promise<void> {

        clause.flatList().map(c => c.toString()).forEach(async c=>{
            console.log({c})
            await this.kb.assert(c)
        })
        
    }
    
}