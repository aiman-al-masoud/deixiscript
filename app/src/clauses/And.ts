import Action from "../actuator/actions/Action";
import { Lexeme } from "../lexer/Lexeme";
import { Clause, AndOpts, CopyOpts } from "./Clause";
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
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly isImply = false,
        readonly hashCode = hashString(JSON.stringify(arguments))) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): And {

        return new And(this.clause1.copy(opts),
            this.clause2.copy(opts),
            this.clause2IsRheme,
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
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

    describe(id: Id): Lexeme[] {
        return this.clause1.describe(id).concat(this.clause2.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

    get theme(): Clause {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme)
    }

    get rheme() {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme)
    }

    toAction(topLevel: Clause): Action[] {
        return this.clause1.toAction(topLevel).concat(this.clause2.toAction(topLevel))
    }

}