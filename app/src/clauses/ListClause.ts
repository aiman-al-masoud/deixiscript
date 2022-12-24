import { Clause, ConcatOpts, CopyOpts, Id } from "./Clause";
import Imply from "./Imply";

export default class ListClause implements Clause {

    constructor(readonly clauses: Clause[], readonly negated = false) {

    }

    concat(other: Clause, opts?: ConcatOpts): Clause {

        return opts?.asRheme ?
            new ListClause([this.copy(), other.copy()]) :
            new ListClause([...this.flatList(), ...other.flatList()])

    }

    copy(opts?: CopyOpts): ListClause {
        return new ListClause(this.clauses.map(c => c.copy({ ...opts, negate: false })), opts?.negate? !this.negated : this.negated)
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

    get isImply(): boolean {
        return this.clauses.some(e => e.isImply)
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this.copy(), conclusion.copy())
    }

    toProlog(): string[] {
        return this.flatList().map(c => c.toString())
    }

    toString() {
        return this.negated ? `not(${this.clauses.toString()})` : this.clauses.toString()
    }
}