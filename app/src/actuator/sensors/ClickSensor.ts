import { clauseOf } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { Sensor } from "./Sensor";

export class ClickSensor implements Sensor {

    constructor(readonly id: Id, readonly object: Element, readonly actuator: Actuator) {

        object.addEventListener('click', () => {
            actuator.onSense([clauseOf('clicked', id)]);
        });

    }
}
