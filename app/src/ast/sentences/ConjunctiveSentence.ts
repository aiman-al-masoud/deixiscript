import CompoundSentence from "../interfaces/CompoundSentence";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";

export default class ConjunctiveSentence implements CompoundSentence{
    async toClause(args?: ToClauseOpts): Promise<Clause> {
        throw new Error("Method not implemented.");
    }

    get isSideEffecty(): boolean {
        return true
    }
        
}