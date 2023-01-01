import { Clause, AndOpts, CopyOpts, emptyClause, hashString } from "./Clause";
import { Id, isVar } from "./Id";
import Imply from "./Imply";
import And from "./And";
import { PrologClause } from "../prologclause/PrologClause";
import { BasicPrologClause } from "../prologclause/BasicPrologClause";


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
        return new And([this, ...other.flatList()])
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

    toProlog(): PrologClause {
        return new BasicPrologClause(this.predicate, this.args, this.negated)
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    about(id: Id): Clause {
        return this.entities.includes(id) ? this : emptyClause()
    }

    get theme(): Clause {
        return this
    }

    get entities(): Id[] {
        return Array.from(new Set(this.args)) // filter out variables ???
    }

}