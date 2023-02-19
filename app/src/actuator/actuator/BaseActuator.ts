import { Clause } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import { Actuator } from "./Actuator";
import { getAction } from "../actions/getAction";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, context: Context): any[] {

        const actions = clause.flatList().map(x => getAction(x, clause))
        return actions.flatMap(a => a.run(context)??[])

    }

}