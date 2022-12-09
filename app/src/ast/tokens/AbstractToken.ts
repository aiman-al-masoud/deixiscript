import Universe from "../../universe/Universe";
import Token from "../interfaces/Token";

export default abstract class AbstractToken implements Token{

    constructor(readonly string:string){

    }
    
    abstract exec(universe: Universe):any
    
}