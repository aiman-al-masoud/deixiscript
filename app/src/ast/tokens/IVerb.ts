import Brain from "../../brain/Brain";
import Token from "../interfaces/Token";
import AbstractToken from "./AbstractToken";

export default class IVerb extends AbstractToken{
    
    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }
    
}