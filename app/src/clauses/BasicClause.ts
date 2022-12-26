import { Clause, AndOpts, CopyOpts, emptyClause, ToPrologOpts, hashString } from "./Clause";
import { Id, getRandomId } from "./Id";
import Imply from "./Imply";
import And from "./And";


export class BasicClause implements Clause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated = false, readonly isImply = false, readonly hashCode = hashString(JSON.stringify(arguments)), readonly rheme = emptyClause()) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this.flatList().concat(other.flatList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate, this.args.map(a => opts?.map ? opts?.map[a] ?? a : a), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return [this]
    }

    toProlog(opts: ToPrologOpts): string[] {

        if (this.args.length <= 1) {
            return [`be(${opts.anyFactId ? '_' : getRandomId()}, ${this.args[0]}, ${this.predicate}, ${!this.negated})`]
        } else {
            return [`rel(${opts.anyFactId ? '_' : getRandomId()}, ${this.args[0]}, ${this.args[1]}, ${this.predicate}, ${!this.negated})`]
        }

    }

    get entities(): Id[] {
        return Array.from(new Set(this.args.concat([])))
    }

    get theme(): Clause {
        return this
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

}