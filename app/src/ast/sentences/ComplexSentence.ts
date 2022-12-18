import CompoundSentence from "../interfaces/CompoundSentence";
import { ToPrologArgs } from "../interfaces/Constituent";
import { makeHornClauses, Clause, getRandomId } from "../../clauses/Clause";
import SimpleSentence from "../interfaces/SimpleSentence";
import SubordinatingConjunction from "../tokens/SubordinatingConjunction";

/**
 * A sentence that relates two simple sentences hypotactically, in a 
 * condition-outcome relationship.
 */
export default class ComplexSentence implements CompoundSentence {

    constructor(readonly condition: SimpleSentence,
        readonly outcome: SimpleSentence,
        readonly subconj: SubordinatingConjunction) {

    }

    toProlog(args?: ToPrologArgs): Clause {
        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }

        //TODO: this is WRONG, subject of condition may NOT always be the subject of the outcome
        const condition = this.condition.toProlog(newArgs)
        const outcome = this.outcome.toProlog(newArgs)
        
        return makeHornClauses(condition, outcome)
    }

}