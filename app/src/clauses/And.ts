import { Clause, AndOpts, CopyOpts, Id, ToPrologOpts, hashString } from "./Clause";
import Imply from "./Imply";

export default class And implements Clause {

    constructor(readonly clauses: Clause[], readonly negated = false, readonly isImply = false) {

    }

    and(other: Clause, opts?: AndOpts): Clause {

        return opts?.asRheme ?
            new And([this.copy(), other.copy()]) :
            new And([...this.flatList(), ...other.flatList()])

    }

    copy(opts?: CopyOpts): And {
        return new And(this.clauses.map(c => c.copy({ ...opts, negate: false })), opts?.negate ? !this.negated : this.negated)
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

    toProlog(opts: ToPrologOpts): string[] {

        return this.clauses.length === 1 && this.negated ? //TODO: fix this crap
            this.clauses[0].copy({ negate: true }).toProlog(opts) :
            this.clauses.flatMap(c => c.toProlog(opts))
            
    }

    get hashCode(): number {
        return hashString(JSON.stringify(this))
    }

}