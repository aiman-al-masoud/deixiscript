import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { Ed } from "../Ed";
import Action from "./Action";

export class ChangeColor implements Action {

    constructor(readonly id: Id, readonly color: string, readonly actuator:Actuator) {

    }

    async run(): Promise<void> {        
        const object = await this.actuator.ed.get(this.id)
        object.object.style.background = this.color
    }
}
