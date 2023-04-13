import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { Id } from "../id/Id";
import { Map } from "../id/Map";
import And from "./And";
import { Lexeme } from "../../frontend/lexer/Lexeme";
import { uniq } from "../../utils/uniq";
import { hashString } from "../../utils/hashString";
// import Imply from "./Imply";

export class AtomClause implements Clause {

    readonly simple = this
    readonly theme = this
    readonly rheme = emptyClause
    readonly entities = uniq(this.args)
    readonly hashCode = hashString(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }))
    readonly hasSideEffects = this.rheme !== emptyClause


    constructor(
        readonly predicate: Lexeme,
        readonly args: Id[],
        readonly negated = false,
    ) {

    }

    copy = (opts?: CopyOpts) => new AtomClause(
        this.predicate,
        this.args.map(a => opts?.map?.[a] ?? a),
        opts?.negate ?? this.negated,
    )

    and = (other: Clause, opts?: AndOpts): Clause => new And(this, other, opts?.asRheme ?? false)
    flatList = () => [this]
    ownedBy = (id: Id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : []
    ownersOf = (id: Id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : []
    
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

    // implies = (conclusion: Clause): Clause => new Imply(this, conclusion)
    
}