import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../interfaces/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class IVerbSubordinateClause implements SubordinateClause{
    toProlog(args?: ToPrologArgs | undefined): Clause {
        throw new Error("Method not implemented.");
    }
    
}