import CompoundSentence from "../interfaces/CompoundSentence";
import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";

export default class ConjunctiveSentence implements CompoundSentence{
    toClause(args?: ToPrologArgs | undefined): Clause {
        throw new Error("Method not implemented.");
    }

    get isSideEffecty(): boolean {
        return true
    }
        
}