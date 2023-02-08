import { Lexeme } from "../lexer/Lexeme";
import { uniq } from "../utils/uniq";
import { Clause, AndOpts, CopyOpts, emptyClause } from "./Clause";
import { hashString } from "./hashString";
import { Id, Map } from "./Id";
import Imply from "./Imply";

export default class And implements Clause {

    constructor(
        readonly clauses: [Clause?, Clause?],
        readonly clause2IsRheme: boolean = false,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(JSON.stringify(arguments)),
        readonly clause1 = clauses[0] ?? emptyClause,
        readonly clause2 = clauses[1] ?? emptyClause,

    ) {

    }

    and(other: Clause, opts?: AndOpts): Clause {

        if (isEmpty(this)) {
            return other
        }

        return new And([this, other], opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): Clause {

        if (isEmpty(this)) {
            return this
        }

        return new And(
            [this.clause1?.copy(opts), this.clause2?.copy(opts)],
            this.clause2IsRheme,
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty
        )

    }

    flatList(): Clause[] {

        return this.negated ? [this] :
            [...this.clause1?.flatList() ?? [], ...this.clause2?.flatList() ?? []]

    }

    get entities(): Id[] {
        return uniq(optionalCat(this.clause1?.entities, this.clause2?.entities))
    }

    implies(conclusion: Clause): Clause {

        if (isEmpty(this)) {
            return conclusion
        }

        return new Imply(this, conclusion)
    }

    toString() {
        const yes = this.clause1?.toString() + ',' + this.clause2?.toString()
        return yes ? this.negated ? `not${yes}` : yes : ''
    }

    about = (id: Id): Clause => optionalAnd(this.clause1?.about(id), this.clause2?.about(id))
    ownedBy = (id: Id): Id[] => optionalCat(this.clause1?.ownedBy(id), this.clause2?.ownedBy(id))
    ownersOf = (id: Id): Id[] => optionalCat(this.clause1?.ownersOf(id), this.clause2?.ownersOf(id))
    describe = (id: Id): Lexeme[] => optionalCat(this.clause1?.describe(id), this.clause2?.describe(id))

    get theme(): Clause {

        if (isEmpty(this)) {
            return this
        }

        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme)
    }

    get rheme(): Clause {

        if (isEmpty(this)) {
            return this
        }

        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme)

    }

    query(query: Clause): Map[] {

        const universe = optionalAnd(this.clause1, this.clause2)
        const result: Map[] = []

        query.entities.forEach(qe => {
            universe.entities.forEach(re => {

                const rd = universe.about(re).flatList()
                const qd = query.about(qe).flatList().filter(x => x.predicate?.root !== 'of') /* TODO remove filter eventually!  */

                const rd2 = rd.map(x => x.copy({ map: { [re]: qe } })) // subsitute re by qe in real description

                const qhashes = qd.map(x => x.hashCode)
                const r2hashes = rd2.map(x => x.hashCode)

                if (qhashes.every(x => r2hashes.includes(x))) { // qe unifies with re!

                    const i = result.findIndex(x => !x[qe])
                    const m = result[i] ?? {}
                    m[qe] = re
                    result[i > -1 ? i : result.length] = m

                }

            })
        })

        return result
    }


    get simplify(): Clause {

        const c1 = this.clause1?.simplify
        const c2 = this.clause2?.simplify

        if (!isEmpty(c1) && c1 && isEmpty(c2)) {
            return c1?.simplify
        }

        if (!isEmpty(c2) && c2 && isEmpty(c1)) {
            return c2?.simplify
        }

        if (!isEmpty(c1) && !isEmpty(c2)) {

            return new And(
                [c1?.simplify, c2?.simplify],
                this.clause2IsRheme,
                this.negated,
                this.exactIds,
                this.isSideEffecty
            )
        }

        return this
    }

}

export function isEmpty(object?: Clause) {

    if (object instanceof And) {
        return object.clauses.filter(x => x !== undefined).length === 0
    }

    return object === undefined
}

const optionalCat = (x: any[] | undefined, y: any[] | undefined) => {
    return [...x ?? [], ...y ?? []]
}

const optionalAnd = (x?: Clause, y?: Clause) => {
    return (x ?? emptyClause).and(y ?? emptyClause)
}
