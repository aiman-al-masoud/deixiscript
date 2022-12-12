import Brain from "../../brain/Brain";
import Token from "../interfaces/Token";

export default abstract class AbstractToken implements Token{

    constructor(readonly string:string){

    }
    
    abstract exec(universe: Brain):any
    
}