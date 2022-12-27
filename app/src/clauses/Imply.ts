import { Clause, AndOpts, CopyOpts, ToPrologOpts, hashString } from "./Clause";
import { Id } from "./Id";
import And from "./And";

export default class Imply implements Clause {

    constructor(readonly condition: Clause,
        readonly conclusion: Clause,
        readonly negated = false,
        readonly isImply = true,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = condition.theme) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And([this, other])
    }

    copy(opts?: CopyOpts): Clause {
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return [this]
    }

    /**
     * Generates horn clauses, one for each conclusion. 
     * Since prolog only supports that kind of implication.
     * @returns 
     */
    toProlog(opts?: ToPrologOpts): string[] {

        const conditionString = this.condition
            .toProlog({ ...opts, anyFactId: true })
            .reduce((c1, c2) => `${c1}, ${c2}`)

        const conclusions = this.conclusion.flatList()
        return conclusions.map(c => `${c.toProlog({ ...opts, anyFactId: true })[0]} :- ${conditionString}`) //TODO: [0] is to be dealt with better

    }

    get entities(): Id[] {
        return this.condition.entities.concat(this.conclusion.entities)
    }

    get rheme(): Clause {
        return this // dunno what I'm doin'
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

}