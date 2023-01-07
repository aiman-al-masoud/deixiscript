import { takeAction } from "../action/Action";
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

            if (clause.isSideEffecty) {
                takeAction(clause, this.enviro)
            } else {
                // TODO: highlight ("point out") element(s)
            }

        }

        return []
    }

}