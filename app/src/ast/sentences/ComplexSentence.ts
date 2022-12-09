import Universe from "../../universe/Universe";
import CompoundSentence from "../interfaces/CompoundSentence";

export default class ComplexSentence implements CompoundSentence{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}