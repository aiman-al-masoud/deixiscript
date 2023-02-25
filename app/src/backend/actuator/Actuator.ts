import { Context } from "../../facade/context/Context";
import { Clause } from "../../middle/clauses/Clause";
import BaseActuator from "./BaseActuator";

export interface Actuator {
    takeAction(clause: Clause, context: Context): any[]
}

export function getActuator(): Actuator {
    return new BaseActuator()
}