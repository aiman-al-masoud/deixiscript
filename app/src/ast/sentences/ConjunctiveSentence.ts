import CompoundSentence from "../interfaces/CompoundSentence";
import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../interfaces/Clause";

export default class ConjunctiveSentence implements CompoundSentence{
    toProlog(args?: ToPrologArgs | undefined): Clause {
        throw new Error("Method not implemented.");
    }
        
}