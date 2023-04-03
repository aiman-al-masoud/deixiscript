import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { Id } from "../id/Id";
import { Map } from "../id/Map";
import Imply from "./Imply";
import And from "./And";
import { Lexeme } from "../../frontend/lexer/Lexeme";
import { uniq } from "../../utils/uniq";
import { hashString } from "../../utils/hashString";

export class AtomClause implements Clause {

    readonly simple = this
    readonly theme = this
    readonly rheme = emptyClause
    readonly entities = uniq(this.args)
    readonly hashCode = hashString(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }))

    constructor(
        readonly predicate: Lexeme,
        readonly args: Id[],
        readonly negated = false,
        readonly isSideEffecty = false,
        readonly exactIds = false
    ) {

    }

    copy = (opts?: CopyOpts) => new AtomClause(
        this.predicate,
        this.args.map(a => opts?.map?.[a] ?? a),
        opts?.negate ?? this.negated,
        opts?.sideEffecty ?? this.isSideEffecty,
    )

    and = (other: Clause, opts?: AndOpts): Clause => new And(this, other, opts?.asRheme ?? false)
    implies = (conclusion: Clause): Clause => new Imply(this, conclusion)
    flatList = () => [this]
    about = (id: Id) => this.entities.includes(id) ? this : emptyClause
    ownedBy = (id: Id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : []
    ownersOf = (id: Id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : []
    describe = (id: Id) => this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : []

    toString() {
        const yes = `${this.predicate.root}(${this.args})`
        return this.negated ? `not(${yes})` : yes
    }

    query(query: Clause): Map[] {

        if (!(query instanceof AtomClause)) {
            return []
        }

        if (this.predicate.root !== query.predicate.root) {
            return []
        }

        const map = query.args
            .map((x, i) => ({ [x]: this.args[i] }))
            .reduce((a, b) => ({ ...a, ...b }))

        return [map]
    }

}