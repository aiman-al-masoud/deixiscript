import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id";
import { getParser } from "../parser/Parser";
import Brain, { AssertOpts, BrainState } from "./Brain";
import getEd from "./Ed";

export default class BasicBrain implements Brain {

    constructor(readonly ed = getEd()) {

    }

    async execute(natlang: string): Promise<Map[]> {

        for (const ast of getParser(natlang).parseAll()) {
            const clause = await ast.toClause()
            console.log(clause)
        }

        return []
    }

    async query(query: Clause): Promise<Map[]> {
        return this.ed.query(query)
    }

    async assert(code: Clause, opts?: AssertOpts): Promise<Map[]> {
        // throw new Error("Method not implemented.");

        return []
    }

}