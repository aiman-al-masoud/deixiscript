import { Clause, AndOpts, CopyOpts, emptyClause, Id } from "./Clause";
import Imply from "./Imply";
import And from "./And";


export class BasicClause implements Clause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated = false, readonly isImply = false) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this.flatList().concat(other.flatList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate, this.args.map(a => opts?.map ? opts?.map[a] ?? a : a), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return [this.copy()]
    }

    toProlog(): string[] {
        const core = `${this.predicate}(${this.args.reduce((a, b) => `${a}, ${b}`)})`
        return this.negated ? [`logicNot(${core})`] : [core]
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

    implies(conclusion: Clause): Clause {
        return new Imply(this.copy(), conclusion.copy())
    }

}