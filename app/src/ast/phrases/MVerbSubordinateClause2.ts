import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class MVerbSubordinateClause2 implements SubordinateClause{
    toProlog(args?: ToPrologArgs): Clause {
        throw new Error("Method not implemented.");
    }
    
}