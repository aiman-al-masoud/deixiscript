import { Clause, ConcatOpts, CopyOpts, Id } from "./Clause";
import Imply from "./Imply";

export default class ListClause implements Clause {

    constructor(readonly clauses: Clause[], readonly negated = false) {

    }

    concat(other: Clause, opts?: ConcatOpts): Clause {

        // TODO: this op is a little bit clumsy, consider using a simplify() method instead.

        if (opts?.asRheme) {
            return new ListClause([this.copy(), other.copy()])
        }else{
            return new ListClause([...this.flatList(), ...other.flatList()])
        }
        
    }

    copy(opts?: CopyOpts): ListClause {
        return new ListClause(this.clauses.map(c => c.copy(opts)), opts?.negate ? !this.negated : this.negated)
    }

    toString() {
        return this.negated ? `not(${this.clauses.toString()})` : this.clauses.toString()
    }

    flatList(): Clause[] {
        // TODO: if I'm negated return copy of myself as a whole in a list
        // return this.negated ? [this.copy()] : this.clauses.flatMap(c => c.flatList())
        return this.clauses.flatMap(c => c.flatList())
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
        return this.clauses.some(e=>e.isImply)
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this.copy(), conclusion.copy())
    }

    toProlog(): string[] {
        return this.flatList().map(c=>c.toString())
    }
}