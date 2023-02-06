import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "./hashString";
import { Id, Map } from "./Id";
import And from "./And";
import Action from "../actuator/actions/Action";
import { topLevel } from "./topLevel";
import { getOwnershipChain } from "./getOwnershipChain";
import { Lexeme } from "../lexer/Lexeme";
import { getTopLevelOwnerOf } from "./getTopLevelOwnerOf";
import { getAction } from "../actuator/actions/getAction";

export default class Imply implements Clause {

    constructor(
        readonly condition: Clause,
        readonly consequence: Clause,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = condition,
        readonly rheme = consequence) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): Clause {

        return new Imply(this.condition.copy(opts),
            this.consequence.copy(opts),
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty)

    }

    flatList(): Clause[] {
        return [this]
    }

    get entities(): Id[] {
        return this.condition.entities.concat(this.consequence.entities)
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

    about(id: Id): Clause {
        return emptyClause() ///TODO!!!!!!!!
    }

    toString() {
        const yes = `${this.condition.toString()} ---> ${this.consequence.toString()}`
        return this.negated ? `not(${yes})` : yes
    }

    ownedBy(id: Id): Id[] {
        return this.condition.ownedBy(id).concat(this.consequence.ownedBy(id))
    }

    ownersOf(id: Id): Id[] {
        return this.condition.ownersOf(id).concat(this.consequence.ownersOf(id))
    }

    describe(id: Id): Lexeme[] {
        return this.consequence.describe(id).concat(this.condition.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

    toAction(topLevel: Clause): Action[] {
        return [getAction(this, topLevel)]
    }

    getTopLevelOwnerOf(id: Id): Id | undefined {
        return getTopLevelOwnerOf(id, this)
    }

    query(clause: Clause): Map[] {// TODO
        return []
    }
}