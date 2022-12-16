import Brain from "../../brain/Brain";
import CompoundSentence from "../interfaces/CompoundSentence";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";

export default class ConjunctiveSentence implements CompoundSentence{
    toProlog(args?: ToPrologArgs | undefined): Clause[] {
        throw new Error("Method not implemented.");
    }
        
}