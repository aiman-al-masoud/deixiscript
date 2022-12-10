import Universe from "../../universe/Universe";
import Phrase from "../interfaces/Phrase";
import Preposition from "../tokens/Preposition";
import NounPhrase from "./NounPhrase";

export default class Complement implements Phrase{

    constructor(readonly preposition:Preposition, readonly nounPhrase:NounPhrase){

    }
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}