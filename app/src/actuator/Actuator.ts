import { Clause } from "../clauses/Clause";
import { Enviro } from "../enviro/Enviro";
import BaseActuator from "./BaseActuator";

export interface Actuator {
    takeAction(clause: Clause, enviro: Enviro): Promise<void>
}

export function getActuator(): Actuator {
    return new BaseActuator()
}