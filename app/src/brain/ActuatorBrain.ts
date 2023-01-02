import Actuator, { getActuator } from "../actuator/Actuator";
import { BasicClause } from "../clauses/BasicClause";
import { Clause, clauseOf } from "../clauses/Clause";
import { getRandomId, Map } from "../clauses/Id";
import Brain, { AssertOpts } from "./Brain";
import { Ontology } from "./Ontology";
import PrologBrain from "./PrologBrain";

export default class ActuatorBrain extends PrologBrain {

    readonly actuator: Actuator

    constructor() {
        super()
        this.actuator = getActuator(this)
    }

    override async execute(natlang: string): Promise<Map[]> {

        const results = await super.execute(natlang)
        const pointedOutIds = results.flatMap(m => Object.values(m)).filter(id => id.toString().includes('id'))
        this.actuator.pointOut(pointedOutIds)

        return results
    }

    override async assert(clause: Clause, opts?: AssertOpts): Promise<Map[]> {

        const before = await this.snapshot()
        const results = await super.assert(clause)
        const diff = await this.diff(before)

        for (const c of diff) {
            await this.doOntologyStuff(c)
        }

        if (opts?.fromBelow) { // don't tell Actuator what it knows!
            this.actuator.onUpdate(diff.filter(c => c.hashCode != clause.hashCode))
        } else {
            this.actuator.onUpdate(diff)
        }

        return results
    }

    override async inject(ontology: Ontology): Promise<Brain> {

        for (const c of ontology.clauses) {
            await this.assert(c)
        }

        ontology.objects.forEach(o => {
            this.ed.set(o[0], o[1])
        })

        return this
    }

    async doOntologyStuff(clause: Clause) {

        const c = clause as BasicClause

        if (c.predicate === 'button') {

            const buttonId = c.args[0]
            const styleId = (await this.actuator.brain.query(clauseOf('style', 'X').and(clauseOf('of', 'X', buttonId))))[0]?.X ?? getRandomId()
            const bgId = (await this.actuator.brain.query(clauseOf('background', 'X').and(clauseOf('of', 'X', styleId))))[0]?.X ?? getRandomId()

            await this.assert(clauseOf('style', styleId)
                .and(clauseOf('of', styleId, buttonId))
                .copy({ noAnaphora: true }))

            await this.assert(clauseOf('background', bgId)
                .and(clauseOf('of', bgId, styleId))
                .copy({ noAnaphora: true }))

        }

    }

}