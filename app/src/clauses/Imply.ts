import { Clause, AndOpts, CopyOpts, Id } from "./Clause";
import And from "./And";

export default class Imply implements Clause {

    constructor(readonly condition: Clause, readonly conclusion: Clause, readonly negated = false, readonly isImply = true) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And([this.copy(), other.copy()])
    }

    copy(opts?: CopyOpts): Clause {
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return [this.copy()]
    }

    /**
     * Generates horn clauses, one for each conclusion. 
     * Since prolog only supports that kind of implication.
     * @returns 
     */
    toProlog(): string[] {

        const conditionString = this.condition
            .toProlog()
            .reduce((c1, c2) => `${c1}, ${c2}`)

        const conclusions = this.conclusion.flatList()

        return conclusions.map(c => `${c.toProlog()[0]} :- ${conditionString}`) //TODO: [0] is to be dealt with better

    }

    get entities(): Id[] {
        return this.condition.entities.concat(this.conclusion.entities)
    }

    get theme(): Clause {
        return this.condition.theme
    }

    get rheme(): Clause {
        return this.copy() // dunno what I'm doin'
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

}