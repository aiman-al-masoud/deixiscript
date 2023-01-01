import Actuator, { getActuator } from "../actuator/Actuator";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id";
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

        // if (opts?.fromBelow) { // don't tell Actuator what it knows!
        // this.actuator.onUpdate(diff.filter(c=>c.hashCode != clause.hashCode))
        // }else{
        this.actuator.onUpdate(diff)
        // }

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

}