import { Clause, ConcatOpts, CONST_PREFIX, CopyOpts, emptyClause, Id, VAR_PREFIX } from "./Clause";
import ListClause from "./ListClause";


export class BasicClause implements Clause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated = false) {

    }

    concat(other: Clause, opts?: ConcatOpts): Clause {
        return new ListClause(this.toList().concat(other.toList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate, this.args.map(a => opts?.map ? opts?.map[a] ?? a : a), opts?.negate ? !this.negated : this.negated)
    }

    toList(): Clause[] {
        return [this.copy()]
    }

    about(id: Id): Clause[] {
        return this.args.includes(id) ? this.toList() : []
    }

    flatList(): Clause[] {
        return this.toList()
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

}