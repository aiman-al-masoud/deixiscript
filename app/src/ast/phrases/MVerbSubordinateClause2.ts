import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class MVerbSubordinateClause2 implements SubordinateClause{
    toClause(args?: ToClauseOpts): Clause {
        throw new Error("Method not implemented.");
    }

    get isSideEffecty(): boolean {
        return true
    }
    
}