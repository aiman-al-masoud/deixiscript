import { Clause, clauseOf } from "../clauses/Clause";
import { Map, toVar } from "../clauses/Id";
import { getParser } from "../parser/Parser";
import { getProlog } from "../prolog/Prolog";
import Brain, {  BrainState } from "./Brain";
import { getAnaphora } from "./Anaphora";
import getEd from "../actuator/Ed";
import { Ontology } from "./Ontology";

export default class PrologBrain implements Brain {

    constructor(readonly kb = getProlog(), readonly ed = getEd()) {

    }

    async inject(ontology: Ontology): Promise<Brain> {
        return this
    }

    async execute(natlang: string): Promise<Map[]> {

        let x: Map[] = []

        for (const ast of getParser(natlang).parseAll()) {
            const clause = await ast.toClause()
            x = await (ast.isSideEffecty ? this.assert(clause) : this.query(clause))
        }

        return x
    }

    async query(query: Clause): Promise<Map[]> {

        const mapToVar = query.noAnaphora ? {} : query.entities.map(e => ({ [e]: toVar(e) })).reduce((a, b) => ({ ...a, ...b }))

        const q = query
            .copy({ map: mapToVar })
            .toProlog({ anyFactId: true })
            .reduce((a, b) => `${a}, ${b}`) + '.' // TODO: deal with dot at a lower level ?

        return await this.kb.query(q)
    }

    async assert(clause: Clause): Promise<Map[]> {

        const anaphoraMap = clause.noAnaphora ? {} : await getAnaphora(clause).mapTo(this)

        const toBeAsserted = clause
            .copy({ map: anaphoraMap })
            .toProlog({ anyFactId: false })

        for (const c of toBeAsserted) { // TODO: bug finding one entity multiple times
            console.info('asserting', c)
            await this.kb.assert(c)
        }
        
        return []
    }

    async snapshot(): Promise<BrainState> {

        const is = (await this.query(clauseOf('X', 'Y')))
            .map(e => clauseOf(e.X as string, e.Y))

        const does = (await this.query(clauseOf('P', 'A', 'B')))
            .map(e => clauseOf(e.P as string, e.A, e.B))

        const isNot = (await this.query(clauseOf('X', 'Y').copy({ negate: true })))
            .map(e => clauseOf(e.X as string, e.Y))

        const doesNot = (await this.query(clauseOf('P', 'A', 'B').copy({ negate: true })))
            .map(e => clauseOf(e.P as string, e.A, e.B))

        return { be: is, rel: does, relNot: doesNot, beNot: isNot }
    }

    async diff(before: BrainState): Promise<Clause[]> {

        const now = await this.snapshot()
        const beDiff = now.be.filter(c => !(before.be.map(c => c.hashCode)).includes(c.hashCode))
        const relDiff = now.rel.filter(c => !(before.rel.map(c => c.hashCode)).includes(c.hashCode))
        const res = beDiff.concat(relDiff)

        return res.filter((e, i) => res.map(c => c.hashCode).indexOf(e.hashCode) === i) //TODO: de-uglify deduplication
    }

}