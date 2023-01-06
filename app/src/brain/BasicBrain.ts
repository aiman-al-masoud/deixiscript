import { getAction } from "../action/Action";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id";
import { getParser } from "../parser/Parser";
import Brain, { AssertOpts } from "./Brain";
import getEnviro from "./Enviro";

export default class BasicBrain implements Brain {

    constructor(readonly ed = getEnviro()) {

    }

    async execute(natlang: string): Promise<any[]> {

        for (const ast of getParser(natlang).parseAll()) {
            const clause = await ast.toClause()
            console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)
            getAction(clause)
        }

        return []
    }

    async query(query: Clause): Promise<Map[]> {
        throw new Error('not implemented!')
    }

    async assert(code: Clause, opts?: AssertOpts): Promise<Map[]> {
        throw new Error('not implemented!')
    }

}