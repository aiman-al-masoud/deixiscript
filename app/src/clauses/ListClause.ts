import { Clause, AndOpts, CopyOpts, Id } from "./Clause";
import Imply from "./Imply";

export default class AndClause implements Clause {

    constructor(readonly clauses: Clause[], readonly negated = false, readonly isImply = false) {

    }

    and(other: Clause, opts?: AndOpts): Clause {

        return opts?.asRheme ?
            new AndClause([this.copy(), other.copy()]) :
            new AndClause([...this.flatList(), ...other.flatList()])

    }

    copy(opts?: CopyOpts): AndClause {
        return new AndClause(this.clauses.map(c => c.copy({ ...opts, negate: false })), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return this.negated ? [this.copy()] : this.clauses.flatMap(c => c.flatList())
    }

    get entities(): Id[] {
        return Array.from(new Set(this.clauses.flatMap(c => c.entities)))
    }

    get theme(): Clause {
        return this.clauses[0]
    }

    get rheme(): Clause {
        return this.clauses[1]
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this.copy(), conclusion.copy())
    }

    toProlog(): string[] {

        const prologClauses = this.clauses.flatMap(c => c.toProlog())

        return this.negated ?
            [`logicNot(${prologClauses.reduce((a, b) => `${a}, ${b}`)})`] :
            prologClauses

    }

}