import Brain from "../../brain/Brain";
import Phrase from "../interfaces/Phrase";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class IVerbSubordinateClause implements SubordinateClause{
    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }
    
}