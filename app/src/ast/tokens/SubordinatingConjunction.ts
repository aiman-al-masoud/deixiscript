import Universe from "../../universe/Universe";
import Token from "../interfaces/Token";

export default class SubordinatingConjunction implements Token{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}