import { Clause, Id, Map, toVar } from "../clauses/Clause";
import { getParser } from "../parser/Parser";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";
import { getSandbox } from "./Sandbox";

export default class PrologBrain implements Brain {

    readonly kb: Prolog

    constructor() {
        this.kb = getProlog()
    }

    async execute(natlang: string): Promise<boolean | Map[]> {
        const ast = getParser(natlang).parse()

        if (ast.isSideEffecty) {
            await this.assert(ast.toClause())
            return true
        } else {
            return await this.query(ast.toClause())
        }
    }

    async query(query: Clause): Promise<boolean | Map[]> {


        const mapToVar = query.entities
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const reverseMapToVar = Object.fromEntries(Object.entries(mapToVar).map(e => [e[1], e[0]]))

        const q = query
            .copy({ map: mapToVar })
            .toProlog()
            .reduce((a, b) => `${a}, ${b}`) + '.' // TODO: deal with dot at a lower level ?

        const queryRes = await this.kb.query(q) as Map[]

        // return Object.keys(queryRes)
            // .map(k => ({ [reverseMapToVar[k]]: queryRes[k] }))
            // .reduce((a, b) => ({ ...a, ...b }), {})

        // const x = queryRes.map(e=> Object.entries(e) )
        //                   .map(e=>   Object.fromEntries(e.map(e=> ({ [reverseMapToVar[e[0]]] : e[1] })   ))  )

        //TODO: reverse map to original constant used for query
        return queryRes

    }


    async assert(clause: Clause): Promise<void> {

        const anaphoraMap = await getSandbox(clause).mapTo(this)

        const toBeAsserted = clause
            .copy({ map: anaphoraMap })
            .toProlog()

        for (const c of toBeAsserted) { // TODO: bug finding one entity multiple times
            await this.kb.assert(c)
        }

    }

}