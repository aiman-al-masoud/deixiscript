import { Lexeme } from "../lexer/Lexeme";
import { uniq } from "../utils/uniq";
import { Clause, AndOpts, CopyOpts, emptyClause, QueryOpts } from "./Clause";
import { hashString } from "../utils/hashString";
import { Id } from "../id/Id";
import { sortIds } from "../id/functions/sortIds";
import { Map } from "../id/Map";
import Imply from "./Imply";

export default class And implements Clause {

    constructor(
        readonly clause1: Clause,
        readonly clause2: Clause,
        readonly clause2IsRheme: boolean = false,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(clause1.toString() + clause2.toString() + negated),
        readonly entities = uniq(clause1.entities.concat(clause2.entities))

    ) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): Clause {
        return new And(
            opts?.clause1 ?? this.clause1.copy(opts),
            opts?.clause2 ?? this.clause2.copy(opts),
            this.clause2IsRheme,
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty
        )
    }

    flatList(): Clause[] {

        return this.negated ? [this] :
            [...this.clause1.flatList() ?? [], ...this.clause2.flatList() ?? []]

    }

    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString()
        return yes ? this.negated ? `not${yes}` : yes : ''
    }

    implies = (conclusion: Clause): Clause => new Imply(this, conclusion)
    about = (id: Id): Clause => this.clause1.about(id).and(this.clause2.about(id))
    ownedBy = (id: Id): Id[] => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id))
    ownersOf = (id: Id): Id[] => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id))
    describe = (id: Id): Lexeme[] => this.clause1.describe(id).concat(this.clause2.describe(id))

    get theme(): Clause {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme)
    }

    get rheme(): Clause {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme)
    }

    query(query: Clause, opts?: QueryOpts): Map[] {

        function unify(qe: Id, re: Id, result: Map[]) {

            const i = result.findIndex(x => !x[qe])
            const m = result[i] ?? {}
            m[qe] = re
            result[i > -1 ? i : result.length] = m

        }

        const universe = this.clause1.and(this.clause2)
        const result: Map[] = []
        const it = opts?.it ?? sortIds(universe.entities).at(-1)

        query.entities.forEach(qe => {
            universe.entities.forEach(re => {

                const rd = universe.about(re).flatList()
                const qd = query.about(qe).flatList().filter(x => x.predicate?.root !== 'of') /* TODO remove filter eventually!  */

                const rd2 = rd.map(x => x.copy({ map: { [re]: qe } })) // subsitute re by qe in real description

                const qhashes = qd.map(x => x.hashCode)
                const r2hashes = rd2.map(x => x.hashCode)

                if (qhashes.every(x => r2hashes.includes(x))) { // qe unifies with re!
                    unify(qe, re, result)
                }

                if (it && qd.some(x => x.predicate?.type === 'pronoun')) {
                    unify(qe, it, result)
                }

            })
        })

        return result
    }

    get simple() {

        const c1 = this.clause1.simple
        const c2 = this.clause2.simple

        if (c2.hashCode === emptyClause.hashCode) {
            return c1
        }

        if (c1.hashCode === emptyClause.hashCode) {
            return c2
        }

        return this.copy({ clause1: c1, clause2: c2 })

    }

}
