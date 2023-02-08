import { Clause } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import { Actuator } from "./Actuator";
import { getAction } from "../actions/getAction";

export default class BaseActuator implements Actuator {

    takeAction(clause: Clause, context: Context): void {

        clause.flatList().forEach(x => getAction(x, clause).run(context))

    }

}