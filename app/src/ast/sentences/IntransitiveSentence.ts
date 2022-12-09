import Universe from "../../universe/Universe";
import VerbSentence from "../interfaces/VerbSentence";

export default class IntransitiveSentence implements VerbSentence{
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}