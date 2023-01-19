import { Clause } from "../clauses/Clause";
import { Enviro } from "../enviro/Enviro";
import { Actuator } from "./Actuator";

export default class BaseActuator implements Actuator {

    async takeAction(clause: Clause, enviro: Enviro): Promise<void> {

        for (const a of await clause.toAction(clause)) {
            await a.run(enviro)
        }

    }

}