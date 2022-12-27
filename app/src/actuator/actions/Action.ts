import { BasicClause } from "../../clauses/BasicClause";
import { Clause } from "../../clauses/Clause";
import Actuator from "../Actuator";
import { Ed } from "../Ed";
import { ChangeColor } from "./ChangeColor";
import { MakeButton } from "./MakeButton";
import { NoOp } from "./NoOp";

export default interface Action {
    run(): Promise<void>
}

export function getAction(clause: Clause, ed: Ed, actuator:Actuator): Action {

    if (clause instanceof BasicClause) { // TODO: DON'T EXPOSE CLASS!!

        switch (clause.predicate) {

            case 'button':
                return new MakeButton(clause.args[0], ed, actuator)

            case 'red':
                return new ChangeColor(clause.args[0], 'red', ed)

            case 'green':
                return new ChangeColor(clause.args[0], 'green', ed)

        }

    }

    return new NoOp(clause)

}

