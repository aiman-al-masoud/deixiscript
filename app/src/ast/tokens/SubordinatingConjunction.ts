import Universe from "../../universe/Universe";
import Token from "../interfaces/Token";
import AbstractToken from "./AbstractToken";

export default class SubordinatingConjunction extends AbstractToken{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}