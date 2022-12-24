import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class MVerbSubordinateClause1 implements SubordinateClause{
    toClause(args?: ToPrologArgs): Clause {
        throw new Error("Method not implemented.");
    }

    get isSideEffecty(): boolean {
        return true
    }
    
}