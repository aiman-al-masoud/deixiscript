import { Clause } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import { Actuator } from "./Actuator";
import { getAction } from "../actions/getAction";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, context: Context): void {

        const actions = clause.flatList().map(x => getAction(x, clause))
        actions.forEach(a => a.run(context))

    }

}