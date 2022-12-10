import Universe from "../../universe/Universe";
import Phrase from "../interfaces/Phrase";
import SubordinateClause from "../interfaces/SubordinateClause";

export default class IVerbSubordinateClause implements SubordinateClause{
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}