import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "../utils/hashString";
import { Id, Map } from "./Id";
import And from "./And";
import { Lexeme } from "../lexer/Lexeme";
import { uniq } from "../utils/uniq";

export default class Imply implements Clause {

    constructor(
        readonly condition: Clause,
        readonly consequence: Clause,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(condition.toString() + consequence.toString() + negated),
        readonly theme = condition,
        readonly rheme = consequence) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): Clause {

        return new Imply(
            opts?.clause1 ?? this.condition.copy(opts),
            opts?.clause2 ?? this.consequence.copy(opts),
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty
        )

    }

    flatList(): Clause[] {
        return [this]
    }

    get entities(): Id[] {
        return uniq(this.condition.entities.concat(this.consequence.entities))
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

    about(id: Id): Clause {
        return emptyClause ///TODO!!!!!!!!
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

    query(clause: Clause): Map[] {// TODO
        throw new Error('not implemented!')
    }

    get simple(): Clause {
        return this.copy({
            clause1: this.condition.simple,
            clause2: this.consequence.simple
        })
    }
}