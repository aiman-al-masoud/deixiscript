import { Clause, AndOpts, CopyOpts, ToPrologOpts, hashString, emptyClause } from "./Clause";
import { Id } from "./Id";
import And from "./And";

export default class Imply implements Clause {

    constructor(readonly condition: Clause,
        readonly conclusion: Clause,
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isImply = true,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = condition.theme) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And([this, other])
    }

    copy(opts?: CopyOpts): Clause {

        return new Imply(this.condition.copy(opts),
            this.conclusion.copy(opts),
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora)

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

        const conclusions = this.conclusion
            .flatList()
            .filter(c => !this.condition.flatList().map(c => c.hashCode).includes(c.hashCode)) // filter out conclusions that are also premises, very important to avoid PROLOG INFINITE LOOPS in querying!

        return conclusions.map(c => `${c.toProlog({ ...opts, anyFactId: true /* or opposite?*/ })[0]} :- ${conditionString}`) //TODO: [0] is to be dealt with better
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

    about(id: Id): Clause {
        return emptyClause() ///TODO!!!!!!!!
    }

}