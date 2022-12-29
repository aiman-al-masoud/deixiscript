import { Clause, clauseOf } from "../clauses/Clause";
import { Map, toVar } from "../clauses/Id";
import { getParser } from "../parser/Parser";
import { getProlog } from "../prolog/Prolog";
import Brain, { AssertOpts } from "./Brain";
import { getAnaphora } from "./Anaphora";
import Constituent from "../ast/interfaces/Constituent";
import getEd from "../actuator/Ed";
import Actuator, { getActuator } from "../actuator/Actuator";
import { Ontology } from "./Ontology";

export default class PrologBrain implements Brain {

    readonly actuator: Actuator

    constructor(readonly kb = getProlog(), readonly ed = getEd()) {
        this.actuator = getActuator(this)
    }

    async inject(ontology: Ontology): Promise<Brain> {

        for (const c of ontology.clauses) {
            await this.assert(c)
        }

        ontology.objects.forEach(o => {
            this.ed.set(o[0], o[1])
        })

        return this
    }

    async execute(natlang: string): Promise<Map[]> {

        let x: Map[] = []

        for (const ast of getParser(natlang).parseAll()) {
            x = await this.executeOne(ast)
        }

        // console.log( x.map( y => Object.values(y).map(z =>  this.ed.get(z) )  ))
        console.log(x)

        return x
    }

    protected async executeOne(ast: Constituent) {

        if (ast.isSideEffecty) {
            await this.assert(ast.toClause())
            return []
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

        const results = await this.kb.query(q)
        const pointedOutIds = results.flatMap(m => Object.values(m)).filter(id => id.toString().includes('id'))
        this.actuator.pointOut(pointedOutIds)
        return results //TODO: maybe return clause list instead, with query.copy({map:mapToVar}).copy({map:queryRes[i]}) //for each queryRes

    }

    async assert(clause: Clause, opts?: AssertOpts): Promise<void> {

        const before = await this.snapshot()

        const anaphoraMap = opts?.noAnaphora ? {} : await getAnaphora(clause).mapTo(this)

        const toBeAsserted = clause
            .copy({ map: anaphoraMap })
            .toProlog({ anyFactId: false })

        for (const c of toBeAsserted) { // TODO: bug finding one entity multiple times
            console.log('asserting', c)
            await this.kb.assert(c)
        }

        const after = await this.snapshot()
        this.actuator.onUpdate(await this.diff(before, after))
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