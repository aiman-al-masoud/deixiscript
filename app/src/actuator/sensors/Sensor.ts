import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { ClickSensor } from "./ClickSensor";

export interface Sensor {

}

export function makeSensor(actuator: Actuator, id: Id, object: Element): Sensor {
    return new ClickSensor(id, object, actuator)
}


