import Action from "../actuator/Action";
import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { getOwnershipChain } from "./getOwnershipChain";
import { hashString } from "./hashString";
import { Id } from "./Id";
import Imply from "./Imply";
import { topLevel } from "./topLevel";

export default class And implements Clause {

    constructor(readonly clause1: Clause,
        readonly clause2: Clause,
        readonly clause2IsRheme: boolean,
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isSideEffecty = false,
        readonly isImply = false,
        readonly hashCode = hashString(JSON.stringify(arguments))) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): And {

        return new And(this.clause1.copy({ map: opts?.map }),
            this.clause2.copy({ map: opts?.map }),
            this.clause2IsRheme,
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora,
            opts?.sideEffecty ?? this.isSideEffecty)

    }

    flatList(): Clause[] {

        return this.negated ? [this] :
            [...this.clause1.flatList(), ...this.clause2.flatList()]

    }

    get entities(): Id[] {

        return Array.from(
            new Set(
                this.clause1.entities.concat(this.clause2.entities)
            )
        )

    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    about(id: Id): Clause { //TODO: if this is negated!
        return this.clause1.about(id).and(this.clause2.about(id))
    }

    async toAction(): Promise<Action> {
        throw new Error('unimplemented!')
    }

    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString()
        return this.negated ? `not(${yes})` : yes
    }

    ownedBy(id: Id): Id[] {
        return this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id))
    }

    ownersOf(id: Id): Id[] {
        return this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id))
    }

    describe(id: Id): string[] {
        return this.clause1.describe(id).concat(this.clause2.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

    get theme(): Clause {
        return this.clause2IsRheme ? this.clause1 : this
    }

    get rheme() {
        return this.clause2IsRheme ? this.clause2 : emptyClause()
    }

}