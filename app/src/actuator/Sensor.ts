import { clauseOf } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import Actuator from "./Actuator";

export interface Sensor {

}

export function makeSensor(actuator: Actuator, id: Id, object: Element): Sensor {
    return new ClickSensor(id, object, actuator)
}

class ClickSensor implements Sensor {

    constructor(readonly id: Id, readonly object: Element, readonly actuator: Actuator) {

        object.addEventListener('click', () => {
            actuator.onSense([clauseOf('clicked', id)])
        })

    }
}

