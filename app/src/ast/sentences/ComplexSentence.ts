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

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const newArgs1 = { ...args, roles: { subject: getRandomId() } }

        const condition = await this.condition.toClause(newArgs1)
        const outcome = await this.outcome.toClause({ ...args, anaphora: condition })
        return condition.implies(outcome)
    }

    get isSideEffecty(): boolean {
        return true
    }

}