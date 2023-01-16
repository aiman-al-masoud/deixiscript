import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "./hashString";
import { Id } from "./Id";
import Imply from "./Imply";
import And from "./And";
import Action from "../actuator/Action";
import { topLevel } from "./topLevel";
import { getOwnershipChain } from "./getOwnershipChain";

export class BasicClause implements Clause {

    constructor(readonly predicate: string,
        readonly args: Id[],
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isSideEffecty = false,
        readonly isImply = false,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly rheme = emptyClause()) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate,
            this.args.map(a => opts?.map ? opts?.map[a] ?? a : a),
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora,
            opts?.sideEffecty ?? this.isSideEffecty)
    }

    flatList(): Clause[] {
        return [this]
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
        return Array.from(new Set(this.args))
    }

    async toAction(): Promise<Action> {
        throw new Error('unimplemented!')
    }

    ownedBy(id: Id): Id[] {
        return this.predicate === 'of' && this.args[1] === id ? [this.args[0]] : []
    }

    ownersOf(id: Id): Id[] {
        return this.predicate === 'of' && this.args[0] === id ? [this.args[1]] : []
    }

    toString() {
        const yes = `${this.predicate}(${this.args})`
        return this.negated ? `not(${yes})` : yes
    }

    describe(id: Id): string[] {
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : []
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

}