import Actuator, { getActuator } from "../actuator/Actuator";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id";
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

    override async assert(clause: Clause): Promise<Map[]> {

        const before = await this.snapshot()
        const results = await super.assert(clause)
        this.actuator.onUpdate(await this.diff(before))

        return results
    }

}