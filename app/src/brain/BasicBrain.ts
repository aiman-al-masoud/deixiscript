import { BasicClause } from "../clauses/BasicClause";
import { Clause, clauseOf } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import { getParser } from "../parser/Parser";
import Brain, { AssertOpts } from "./Brain";
import getEnviro from "./Enviro";

export default class BasicBrain implements Brain {

    constructor(readonly ed = getEnviro()) {

    }

    async execute(natlang: string): Promise<any[]> {

        for (const ast of getParser(natlang).parseAll()) {
            const clause = await ast.toClause()

            console.log(clause, clause.toString(), 'side-effetcs:', clause.isSideEffecty)

            const topLevel = clause.entities
                .map(x => ({ x, owners: clause.ownersOf(x) }))
                .filter(x => x.owners.length === 0)
                .map(x => x.x)

            const secondLevelEntities = clause.ownedBy(topLevel[0])
            const thridLevelEntities = clause.ownedBy(secondLevelEntities[0])

            console.log({ topLevel })
            console.log({ secondLevelEntities })
            console.log({ thridLevelEntities })

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