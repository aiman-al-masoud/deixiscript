import { Clause, AndOpts, CopyOpts, emptyClause, QueryOpts } from "./Clause";
import { Id } from "../id/Id";
import { sortIds } from "../id/functions/sortIds";
import { Map } from "../id/Map";
import Imply from "./Imply";
import { hashString } from "../../utils/hashString";
import { uniq } from "../../utils/uniq";
import { solveMaps } from "./functions/solveMaps";

export default class And implements Clause {

    readonly hashCode = hashString(this.clause1.toString() + this.clause2.toString() + this.negated)
    readonly entities = uniq(this.clause1.entities.concat(this.clause2.entities))
    readonly hasSideEffects = this.rheme !== emptyClause

    constructor(
        readonly clause1: Clause,
        readonly clause2: Clause,
        readonly clause2IsRheme = false,
        readonly negated = false,
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
            opts?.negate ?? this.negated,
        )
    }

    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString()
        return this.negated ? `not${yes}` : yes
    }

    implies = (conclusion: Clause): Clause => new Imply(this, conclusion)
    ownedBy = (id: Id): Id[] => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id))
    ownersOf = (id: Id): Id[] => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id))

    flatList(): Clause[] {
        return this.negated ? [this] : [...this.clause1.flatList(), ...this.clause2.flatList()]
    }

    get theme(): Clause { // can't be prop, because would be called in And's cons, BasicCluse.and() calls And's cons, \inf recursion ensues
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme)
    }

    get rheme(): Clause {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme)
    }

    query(query: Clause, opts?: QueryOpts): Map[] {

        const universe = this.clause1.and(this.clause2)
        const it = opts?.it ?? sortIds(universe.entities).at(-1)! //TODO!

        const universeList = universe.flatList()
        const queryList = query.flatList()
        const maps = solveMaps(queryList, universeList)

        const pronMap: Map = queryList.filter(c => c.predicate?.type === 'pronoun').map(c => ({ [c.args?.at(0)!]: it })).reduce((a, b) => ({ ...a, ...b }), {})
        const res = maps.concat(pronMap).filter(m => Object.keys(m).length) // empty maps cause problems all around the code!

        return res
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
