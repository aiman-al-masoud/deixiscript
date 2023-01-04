import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class IVerbSubordinateClause implements SubordinateClause{
    
    async toClause(args?: ToClauseOpts): Promise<Clause> {
        throw new Error("Method not implemented.");
    }
    
}