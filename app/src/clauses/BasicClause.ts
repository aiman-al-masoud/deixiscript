import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "../utils/hashString";
import { Id, Map } from "./Id";
import Imply from "./Imply";
import And from "./And";
import { Lexeme } from "../lexer/Lexeme";

export class BasicClause implements Clause {

    constructor(
        readonly predicate: Lexeme,
        readonly args: Id[],
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(JSON.stringify({ predicate: predicate.root, args, negated })),
        readonly rheme = emptyClause) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate,
            this.args.map(a => opts?.map ? opts?.map[a] ?? a : a),
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty)
    }

    flatList(): Clause[] {
        return [this]
    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    about(id: Id): Clause {
        return this.entities.includes(id) ? this : emptyClause
    }

    ownedBy(id: Id): Id[] {
        return this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : []
    }

    ownersOf(id: Id): Id[] {
        return this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : []
    }

    toString() {
        const yes = `${this.predicate.root}(${this.args})`
        return this.negated ? `not(${yes})` : yes
    }

    describe(id: Id): Lexeme[] {
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : []
    }

    get theme(): Clause {
        return this
    }

    get entities(): Id[] {
        return Array.from(new Set(this.args))
    }

    query(clause: Clause): Map[] { // all ids treated as vars

        clause = clause.flatList()[0] //TODO!

        if (!(clause instanceof BasicClause)) { // TODO: what about And of same BasicClause
            return []
        }

        if (clause.predicate.root !== this.predicate.root) {
            return []
        }

        // TODO what about exact ids?

        const map = clause.args
            .map((x, i) => ({ [x]: this.args[i] }))
            .reduce((a, b) => ({ ...a, ...b }))

        return [map]
    }

    get simple(): Clause {
        return this
    }

}