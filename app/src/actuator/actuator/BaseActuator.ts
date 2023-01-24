import { Clause } from "../../clauses/Clause";
import { Context } from "../../Context";
import { Actuator } from "./Actuator";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, context: Context): void {
        clause.toAction(clause).forEach(a => a.run(context))
    }

}