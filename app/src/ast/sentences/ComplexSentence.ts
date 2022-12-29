import CompoundSentence from "../interfaces/CompoundSentence";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
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

    toClause(args?: ToClauseOpts): Clause {

        // TODO: sometimes the condition and outcome have the SAME subject
        const newArgs1 = { ...args, roles: { subject: getRandomId() } }
        const newArgs2 = { ...args, roles: { subject: getRandomId() } }

        const condition = this.condition.toClause(newArgs1)
        const outcome = this.outcome.toClause(newArgs2)

        return condition.implies(outcome)
    }

    get isSideEffecty(): boolean {
        return true
    }

}