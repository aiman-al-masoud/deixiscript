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
        button.innerText = 'button'
        button.id = this.id.toString()
        document.body.appendChild(button)
        this.actuator.ed.set(this.id, button)

        // adding a style-of-button entity
        const styleId = getRandomId()
        this.actuator.ed.set(styleId, button.style)

        // adding a background of style "entity"
        const bgId = getRandomId()
        this.actuator.ed.set(bgId, '', { jsName: 'background' })

        // const clause = clauseOf('style', styleId)
        // .and(clauseOf('of', styleId, this.id))
        // .and(clauseOf('background', bgId))
        // .and(clauseOf('of', bgId, styleId))
        // .copy({ noAnaphora: true })

        await this.actuator.onPushAbove([clauseOf('style', styleId)
            .and(clauseOf('of', styleId, this.id))
            .copy({ noAnaphora: true })])

        await this.actuator.onPushAbove([clauseOf('background', bgId)
            .and(clauseOf('of', bgId, styleId))
            .copy({ noAnaphora: true })])

        makeSensor(this.actuator, this.id, button)
    }
}
