import { clauseOf } from "../../clauses/Clause";
import { getRandomId, Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { makeSensor } from "../sensors/Sensor";
import Action from "./Action";

export class MakeButton implements Action {

    constructor(readonly id: Id, readonly actuator: Actuator) {

    }

    async run(): Promise<void> {

        if (document.getElementById(this.id.toString())) {
            return
        }

        const button = document.createElement('button')
        button.id = this.id.toString()
        document.body.appendChild(button)
        button.innerText = 'button'

        const styleId = (await this.actuator.brain.query(clauseOf('style', 'X').and(clauseOf('of', 'X', this.id))))[0]?.X
        const bgId = (await this.actuator.brain.query(clauseOf('background', 'X').and(clauseOf('of', 'X', styleId))))[0]?.X

        // console.log('MakeButton', 'button id=', this.id, { styleId }, { bgId })

        // adding objects to entity dictionary
        this.actuator.ed.set(this.id, button)
        this.actuator.ed.set(styleId, button.style)
        this.actuator.ed.set(bgId, '')

        makeSensor(this.actuator, this.id, button)
    }
}
