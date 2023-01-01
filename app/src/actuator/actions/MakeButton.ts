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
        
        const styleId = getRandomId()
        const bgId = getRandomId()
        
        console.log(`CREATING STYLE ${styleId} FOR`, this.id)
        await this.actuator.onPushAbove([clauseOf('style', styleId)
            .and(clauseOf('of', styleId, this.id))
            .copy({ noAnaphora: true })])

        console.log(`CREATING BG ${bgId} FOR STYLE ${styleId} OF`, this.id)
        await this.actuator.onPushAbove([clauseOf('background', bgId)
            .and(clauseOf('of', bgId, styleId))
            .copy({ noAnaphora: true })])

        // adding objects to entity dictionary
        this.actuator.ed.set(styleId, button.style)
        this.actuator.ed.set(this.id, button)
        this.actuator.ed.set(bgId, '', { jsName: 'background' })

        makeSensor(this.actuator, this.id, button)
    }
}
