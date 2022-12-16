import Brain from "../../brain/Brain";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";
import Phrase from "../interfaces/Phrase";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class MVerbSubordinateClause2 implements SubordinateClause{
    toProlog(args?: ToPrologArgs | undefined): Clause[] {
        throw new Error("Method not implemented.");
    }
    
}