import { Clause } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import BaseActuator from "./BaseActuator";

export interface Actuator {
    takeAction(clause: Clause, context: Context): void
}

export function getActuator(): Actuator {
    return new BaseActuator()
}