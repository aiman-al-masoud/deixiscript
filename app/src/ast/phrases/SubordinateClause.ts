import Universe from "../../universe/Universe";
import Phrase from "../interfaces/Phrase";

export default class SubordinateClause implements Phrase{
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}