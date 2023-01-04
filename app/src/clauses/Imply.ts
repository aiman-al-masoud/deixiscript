import { Clause, AndOpts, CopyOpts, hashString, emptyClause } from "./Clause";
import { Id } from "./Id";
import And from "./And";
import Action from "../action/Action";
import Brain from "../brain/Brain";

export default class Imply implements Clause {

    constructor(readonly condition: Clause,
        readonly conclusion: Clause,
        readonly negated = false,
        readonly noAnaphora = false,
        readonly isSideEffecty = false,
        readonly isImply = true,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly theme = condition.theme) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And([this, other])
    }

    copy(opts?: CopyOpts): Clause {

        return new Imply(this.condition.copy(opts),
            this.conclusion.copy(opts),
            opts?.negate ? !this.negated : this.negated,
            opts?.noAnaphora ?? this.noAnaphora,
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

    toAction(brain: Brain): Action {
        throw new Error('unimplemented!')
    }

    toString() {
        const yes = `${this.condition.toString()} ---> ${this.conclusion.toString()}`
        return this.negated ? `not(${yes})` : yes
    }

}