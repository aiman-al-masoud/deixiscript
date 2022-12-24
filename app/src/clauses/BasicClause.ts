import { Clause, ConcatOpts, CopyOpts, emptyClause, Id } from "./Clause";
import Imply from "./Imply";
import ListClause from "./ListClause";


export class BasicClause implements Clause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated = false) {

    }

    concat(other: Clause, opts?: ConcatOpts): Clause {
        return new ListClause(this.flatList().concat(other.flatList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate, this.args.map(a => opts?.map ? opts?.map[a] ?? a : a), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return [this.copy()]
    }

    toProlog(): string[] {
        return [this.toString()]
    }

    toString() {
        const core = `${this.predicate}(${this.args.reduce((a1, a2) => a1 + ', ' + a2)})`
        return this.negated ? `not(${core})` : core
    }

    get entities(): Id[] {
        return Array.from(new Set(this.args.concat([])))
    }

    get theme(): Clause {
        return this.copy()
    }

    get rheme(): Clause {
        return emptyClause()
    }

    get isImply(): boolean {
        return false
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this.copy(), conclusion.copy())
    }

}