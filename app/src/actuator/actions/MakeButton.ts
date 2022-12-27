import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { Ed } from "../Ed";
import { makeSensor } from "../sensors/Sensor";
import Action from "./Action";

export class MakeButton implements Action {

    constructor(readonly id: Id, readonly ed: Ed, readonly actuator:Actuator) {
        
    }

    async run(): Promise<void> {

        if (!this.ed.get(this.id)) {
            const button = document.createElement('button')
            button.innerText = 'button'
            document.body.appendChild(button)
            this.ed.set(this.id, button)
            makeSensor(this.actuator, this.id, button)
        }

    }
}
