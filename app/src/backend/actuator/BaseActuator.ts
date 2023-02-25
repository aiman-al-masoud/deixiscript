import { Context } from "../../facade/context/Context";
import { Clause } from "../../middle/clauses/Clause";
import { getAction } from "../actions/getAction";
import { Actuator } from "./Actuator";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, context: Context): any[] {

        const actions = clause.flatList().map(x => getAction(x, clause))
        return actions.flatMap(a => a.run(context)??[])

    }

}