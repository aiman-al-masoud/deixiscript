import { Clause, AndOpts, CopyOpts, ToPrologOpts, hashString } from "./Clause";
import { Id } from "./Id";
import Imply from "./Imply";

export default class And implements Clause {

    constructor(readonly clauses: Clause[],
        readonly negated = false,
        readonly isImply = false,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = clauses[0],
        readonly rheme = clauses[1]) {

    }

    and(other: Clause, opts?: AndOpts): Clause {

        return opts?.asRheme ?
            new And([this, other]) :
            new And([...this.flatList(), ...other.flatList()])

    }

    copy(opts?: CopyOpts): And {
        return new And(this.clauses.map(c => c.copy({ ...opts, negate: false })), opts?.negate ? !this.negated : this.negated)
    }

    flatList(): Clause[] {
        return this.negated ? [this] : this.clauses.flatMap(c => c.flatList())
    }

    get entities(): Id[] {
        return Array.from(new Set(this.clauses.flatMap(c => c.entities)))
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    toProlog(opts?: ToPrologOpts): string[] {

        return this.clauses.length === 1 && this.negated ? //TODO: fix this crap
            this.clauses[0].copy({ negate: true }).toProlog(opts) :
            this.clauses.flatMap(c => c.toProlog(opts))

    }

}