import { Clause, ConcatOpts, CopyOpts, Id } from "./Clause";
import ListClause from "./ListClause";

export default class Imply implements Clause {

    constructor(readonly condition: Clause, readonly conclusion: Clause, readonly negated = false) {

    }

    concat(other: Clause, opts?: ConcatOpts): Clause {
        return new ListClause([this.copy(), other.copy()])
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

        const conditions = this.condition.flatList()
        const conclusions = this.conclusion.flatList()

        const conditionString = conditions
            .map(c => c.toString())
            .reduce((c1, c2) => `${c1}, ${c2}`)

        return conclusions.map(c => `${c.toString()} :- ${conditionString}`)

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

    get isImply(): boolean {
        return true
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

}