import Action from "../actuator/Action";
import Brain from "../brain/Brain";
import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "./hashString";
import { Id } from "./Id";
import Imply from "./Imply";
import { topLevel } from "./topLevel";

export default class And implements Clause {

    constructor(readonly clauses: Clause[],
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isSideEffecty = false,
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
        return new And(this.clauses.map(c => c.copy({ ...opts, negate: false })),
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora,
            opts?.sideEffecty ?? this.isSideEffecty)
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

    about(id: Id): Clause {

        if (this.negated) {
            return emptyClause() // TODO!!!!!!!!!
        } else {
            return this.clauses.flatMap(c => c.about(id)).reduce((c1, c2) => c1.and(c2), emptyClause())
        }

    }

    async toAction(): Promise<Action> {
        throw new Error('unimplemented!')
    }

    toString() {
        const yes = this.clauses.map(x => x.toString()).toString()
        return this.negated ? `not(${yes})` : yes
    }

    ownedBy(id: Id): Id[] {
        return this.clauses.flatMap(x=>x.ownedBy(id))
    }

    ownersOf(id: Id): Id[] {
        return this.clauses.flatMap(x=>x.ownersOf(id))
    }

    describe(id: Id): string[] {
        return this.clauses.flatMap(x=>x.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

}