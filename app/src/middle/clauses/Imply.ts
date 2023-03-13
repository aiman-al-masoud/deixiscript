import { Clause, AndOpts, CopyOpts } from "./Clause";
import { Id } from "../id/Id";
import { Map } from "../id/Map";
import And from "./And";
import { Lexeme } from "../../frontend/lexer/Lexeme";
import { hashString } from "../../utils/hashString";
import { uniq } from "../../utils/uniq";

export default class Imply implements Clause {

    readonly theme = this.condition
    readonly rheme = this.consequence
    readonly hashCode = hashString(this.condition.toString() + this.consequence.toString() + this.negated)

    constructor(
        readonly condition: Clause,
        readonly consequence: Clause,
        readonly negated = false,
        readonly isSideEffecty = false,
        readonly subjconj?: Lexeme,
        readonly exactIds = false
    ) {

    }

    copy = (opts?: CopyOpts) => new Imply(
        opts?.clause1 ?? this.condition.copy(opts),
        opts?.clause2 ?? this.consequence.copy(opts),
        opts?.negate ?? this.negated,
        opts?.sideEffecty ?? this.isSideEffecty,
        opts?.subjconj ?? this.subjconj,
        opts?.exactIds ?? this.exactIds
    )

    toString() {
        const yes = `${this.subjconj?.root ?? ''} ${this.condition.toString()} ---> ${this.consequence.toString()}`
        return this.negated ? `not(${yes})` : yes
    }

    flatList = () => [this]
    and = (other: Clause, opts?: AndOpts): Clause => new And(this, other, opts?.asRheme ?? false)
    ownedBy = (id: Id) => this.condition.ownedBy(id).concat(this.consequence.ownedBy(id))
    ownersOf = (id: Id) => this.condition.ownersOf(id).concat(this.consequence.ownersOf(id))
    describe = (id: Id) => this.consequence.describe(id).concat(this.condition.describe(id))
    about = (id: Id) => this.condition.about(id).and(this.consequence.about(id))

    query(clause: Clause): Map[] {// TODO
        throw new Error('not implemented!')
    }

    implies(conclusion: Clause): Clause {
        throw new Error('not implemented!')
    }

    get simple(): Clause {
        return this.copy({
            clause1: this.condition.simple,
            clause2: this.consequence.simple
        })
    }

    get entities(): Id[] {
        return uniq(this.condition.entities.concat(this.consequence.entities))
    }
}