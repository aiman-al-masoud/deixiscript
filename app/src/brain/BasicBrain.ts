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


            const topLevelEntities =
                clause.
                    entities
                    .map(e => ({ e, c: clause.about(e) }))
                    .filter(x => !x.c.flatList().some(i =>
                        (i as BasicClause).predicate === 'of'
                        && (i as BasicClause).args[0] === x.e))
                    .map(x => x.e)

            const ownedBy = (owner: Id) =>
                clause
                    .entities
                    .map(e => ({ e, c: clause.about(e) }))
                    .filter(x => x.c.flatList().some(i =>
                        (i as BasicClause).predicate === 'of'
                        && (i as BasicClause).args[0] === x.e
                        && (i as BasicClause).args[1] === owner
                    ))
                    .map(x => x.e)

            const secondLevelEntities = ownedBy(topLevelEntities[0])
            const thridLevelEntities = ownedBy(secondLevelEntities[0])

            console.log({ topLevelEntities })
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