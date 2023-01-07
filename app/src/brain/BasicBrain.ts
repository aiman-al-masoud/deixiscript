import { getAction } from "../action/Action";
import { getParser } from "../parser/Parser";
import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";


export default class BasicBrain implements Brain {

    constructor(readonly enviro = getEnviro()) {

    }

    async execute(natlang: string): Promise<any[]> {

        for (const ast of getParser(natlang).parseAll()) {

            const clause = await ast.toClause()
            console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)
            getAction(clause, this.enviro)

        }

        return []
    }

    // async query(query: Clause): Promise<Map[]> {
    //     throw new Error('not implemented!')
    // }

    // async assert(code: Clause, opts?: AssertOpts): Promise<Map[]> {
    //     throw new Error('not implemented!')
    // }

}