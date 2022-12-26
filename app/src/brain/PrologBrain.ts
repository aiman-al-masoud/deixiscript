import { Clause, clauseOf, Map, toVar } from "../clauses/Clause";
import { getParser } from "../parser/Parser";
import Prolog, { getProlog } from "../prolog/Prolog";
import Brain from "./Brain";
import { getAnaphora } from "./Anaphora";
import Constituent from "../ast/interfaces/Constituent";

export default class PrologBrain implements Brain {

    readonly kb: Prolog

    constructor() {
        this.kb = getProlog()
    }

    async execute(natlang: string): Promise<boolean | Map[]> {

        let x: boolean | Map[] = false

        for (const ast of getParser(natlang).parseAll()) {
            x = await this.executeOne(ast)
        }

        return x
    }

    protected async executeOne(ast: Constituent) {

        if (ast.isSideEffecty) {
            await this.assert(ast.toClause())
            return true
        } else {
            return await this.query(ast.toClause())
        }

    }

    async query(query: Clause): Promise<Map[]> {

        const mapToVar = query.entities
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }))

        const q = query
            .copy({ map: mapToVar })
            .toProlog({ anyFactId: true })
            .reduce((a, b) => `${a}, ${b}`) + '.' // TODO: deal with dot at a lower level ?

        return await this.kb.query(q)
        //TODO: maybe return clause list instead, with query.copy({map:mapToVar}).copy({map:queryRes[i]}) //for each queryRes

    }

    async assert(clause: Clause): Promise<void> {

        const before = await this.snapshot()

        const anaphoraMap = await getAnaphora(clause).mapTo(this)

        const toBeAsserted = clause
            .copy({ map: anaphoraMap })
            .toProlog({ anyFactId: false })

        for (const c of toBeAsserted) { // TODO: bug finding one entity multiple times
            await this.kb.assert(c)
        }

        const after = await this.snapshot()
        console.log('changes', (await this.diff(before, after)).flatMap(c => c.toProlog({})))
    }

    protected async snapshot(): Promise<State> {
        const is = (await this.query(clauseOf('X', 'Y'))).map(e => clauseOf(e.X as string, e.Y))
        const isNot = (await this.query(clauseOf('X', 'Y').copy({ negate: true }))).map(e => clauseOf(e.X as string, e.Y))
        const does = (await this.query(clauseOf('P', 'A', 'B'))).map(e => clauseOf(e.P as string, e.A, e.B))
        const doesNot = (await this.query(clauseOf('P', 'A', 'B').copy({ negate: true }))).map(e => clauseOf(e.P as string, e.A, e.B))

        return { is, does, isNot, doesNot }
    }

    /**
     * Get a list of WHAT CHANGED.
     * @param before 
     * @param after 
     */
    protected async diff(before: State, after: State): Promise<Clause[]> {

        const a = after.is.filter(c => !(before.is.map(c => c.hashCode)).includes(c.hashCode))
        const b = after.does.filter(c => !(before.does.map(c => c.hashCode)).includes(c.hashCode))

        const res = a.concat(b)
        return res
        // return res.filter((e,i)  => res.map(c=>c.hashCode).indexOf(e.hashCode) === i ) //TODO: de-uglify deduplication
    }

}

interface State {
    is: Clause[]
    does: Clause[]
    isNot: Clause[]
    doesNot: Clause[]
}