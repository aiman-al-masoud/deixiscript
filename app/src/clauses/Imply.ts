import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "./hashString";
import { Id } from "./Id";
import And from "./And";
import Action from "../actuator/Action";
import { topLevel } from "./topLevel";
import { getOwnershipChain } from "./getOwnershipChain";
import ImplyAction from "../actuator/ImplyAction";
import { Lexeme } from "../lexer/Lexeme";
import { LexemeType } from "../config/LexemeType";

export default class Imply implements Clause {

    constructor(readonly condition: Clause,
        readonly conclusion: Clause,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly isImply = true,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = condition.theme) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): Clause {

        return new Imply(this.condition.copy(opts),
            this.conclusion.copy(opts),
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty)

    }

    flatList(): Clause[] {
        return [this]
    }

    get entities(): Id[] {
        return this.condition.entities.concat(this.conclusion.entities)
    }

    get rheme(): Clause {
        return this // dunno what I'm doin'
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

    about(id: Id): Clause {
        return emptyClause() ///TODO!!!!!!!!
    }

    toString() {
        const yes = `${this.condition.toString()} ---> ${this.conclusion.toString()}`
        return this.negated ? `not(${yes})` : yes
    }

    ownedBy(id: Id): Id[] {
        return this.condition.ownedBy(id).concat(this.conclusion.ownedBy(id))
    }

    ownersOf(id: Id): Id[] {
        return this.condition.ownersOf(id).concat(this.conclusion.ownersOf(id))
    }

    describe(id: Id): Lexeme[] {
        return this.conclusion.describe(id).concat(this.condition.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

    toAction(topLevel: Clause): Action[] {
        return [new ImplyAction(this.condition, this.conclusion)]
    }

}