import { BasicClause } from "../../clauses/BasicClause";
import { Clause } from "../../clauses/Clause";
import Actuator from "../Actuator";
import { ChangeColor } from "./ChangeColor";
import DefaultSetter from "./DefaultSetter";
import { MakeButton } from "./MakeButton";
import { NoOp } from "./NoOp";

export default interface Action {
    run(): Promise<void>
}

export function getAction(clause: Clause, actuator: Actuator): Action {

    if (clause instanceof BasicClause) { // TODO: DON'T EXPOSE CLASS!!

        switch (clause.predicate) {

            case 'button':
                return new MakeButton(clause.args[0], actuator)

            case 'red':
                return new ChangeColor(clause.args[0], 'red', actuator)

            case 'green':
                return new ChangeColor(clause.args[0], 'green', actuator)

            default:

                if (clause.args.length === 1) {
                    return new DefaultSetter(clause.args[0], clause.predicate, actuator)
                }

        }

    }

    return new NoOp(clause)

}

