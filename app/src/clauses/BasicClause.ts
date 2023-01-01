import { Clause, AndOpts, CopyOpts, emptyClause, ToPrologOpts, hashString } from "./Clause";
import { Id, getRandomId } from "./Id";
import Imply from "./Imply";
import And from "./And";
import { BasicPrologClause, PrologClause } from "./PrologClause";


export class BasicClause implements Clause {

    constructor(readonly predicate: string,
        readonly args: Id[],
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isImply = false,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly rheme = emptyClause()) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this.flatList().concat(other.flatList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate,
            this.args.map(a => opts?.map ? opts?.map[a] ?? a : a),
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora)
    }

    flatList(): Clause[] {
        return [this]
    }

    toProlog(opts?: ToPrologOpts): PrologClause[] {
        return [new BasicPrologClause(this.args.length === 1 ? 'be' : 'rel', [...this.args, this.predicate, !this.negated]   )]
    }

    get entities(): Id[] {
        return Array.from(new Set(this.args))
    }

    get theme(): Clause {
        return this
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    about(id: Id): Clause {
        return this.args.includes(id) ? this : emptyClause()
    }

}