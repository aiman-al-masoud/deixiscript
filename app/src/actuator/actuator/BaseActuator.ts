import { Clause } from "../../clauses/Clause";
import { Enviro } from "../../enviro/Enviro";
import { Actuator } from "./Actuator";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, enviro: Enviro): void {
        clause.toAction(clause).forEach(a => a.run(enviro))
    }

}