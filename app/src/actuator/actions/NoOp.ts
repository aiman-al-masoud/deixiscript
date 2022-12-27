import { Clause } from "../../clauses/Clause";
import Action from "./Action";

export class NoOp implements Action {

    constructor(readonly clause: Clause) {
        
    }

    async run(): Promise<void> {
        console.warn(`No action corresponding to predicate: ${this.clause.toProlog()}`)
    }
}
