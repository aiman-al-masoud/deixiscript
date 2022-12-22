import Constituent from "../ast/interfaces/Constituent";
import NounPhrase from "../ast/phrases/NounPhrase";
import CopulaQuestion from "../ast/sentences/CopulaQuestion";
import { Clause, Id, toVar } from "../clauses/Clause";
import { getParser } from "../parser/Parser";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";
import { getSandbox } from "./Sandbox";

export default class PrologBrain implements Brain {

    readonly kb: Prolog

    constructor() {
        this.kb = getProlog()
    }

    async execute(natlang: string): Promise<boolean | { [id: Id]: Id[] }> {

        const ast = getParser(natlang).parse()

        if (ast instanceof CopulaQuestion || ast instanceof NounPhrase) {
            const query = ast.toProlog()
            return await this.query(query)
        } else {
            this.assert(ast.toProlog())
            return true
        }
    }

    async query(query: Clause): Promise<{ [id: Id]: Id[] } | boolean> {

        const mapToVar = query.entities.map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const q = query.copy({ map: mapToVar })
            .flatList()
            .map(c => c.toString())
            .reduce((a, b) => `${a}, ${b}`) + '.' // TODO: deal with dot at a lower level ?

        return await this.kb.query(q)
    }

    async assert(clause: Clause): Promise<void> {

        const anaphoraMap = await getSandbox(clause).mapTo(this)
        console.debug({ anaphoraMap })

        const toBeAsserted = clause
            .copy({ map: anaphoraMap })
            .flatList()
            .map(c => c.toString())

        console.debug({ toBeAsserted })

        for (const c of toBeAsserted) { // TODO: bug finding one entity multiple times
            await this.kb.assert(c)
        }

    }

}