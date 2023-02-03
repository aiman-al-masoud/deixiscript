import Action from "../actuator/actions/Action";
import { Lexeme } from "../lexer/Lexeme";
import { Clause, AndOpts, CopyOpts } from "./Clause";
import { getOwnershipChain } from "./getOwnershipChain";
import { getTopLevelOwnerOf } from "./getTopLevelOwnerOf";
import { hashString } from "./hashString";
import { Id, Map } from "./Id";
import Imply from "./Imply";
import { topLevel } from "./topLevel";

export default class And implements Clause {

    constructor(readonly clause1: Clause,
        readonly clause2: Clause,
        readonly clause2IsRheme: boolean,
        readonly negated = false,
        readonly exactIds = false,
        readonly isSideEffecty = false,
        readonly hashCode = hashString(JSON.stringify(arguments))) {

    }

    and(other: Clause, opts?: AndOpts): Clause {
        return new And(this, other, opts?.asRheme ?? false)
    }

    copy(opts?: CopyOpts): And {

        return new And(this.clause1.copy(opts),
            this.clause2.copy(opts),
            this.clause2IsRheme,
            opts?.negate ? !this.negated : this.negated,
            opts?.exactIds ?? this.exactIds,
            opts?.sideEffecty ?? this.isSideEffecty)

    }

    flatList(): Clause[] {

        return this.negated ? [this] :
            [...this.clause1.flatList(), ...this.clause2.flatList()]

    }

    get entities(): Id[] {

        return Array.from(
            new Set(
                this.clause1.entities.concat(this.clause2.entities)
            )
        )

    }

    implies(conclusion: Clause): Clause {
        return new Imply(this, conclusion)
    }

    about(id: Id): Clause { //TODO: if this is negated!
        return this.clause1.about(id).and(this.clause2.about(id))
    }

    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString()
        return this.negated ? `not(${yes})` : yes
    }

    ownedBy(id: Id): Id[] {
        return this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id))
    }

    ownersOf(id: Id): Id[] {
        return this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id))
    }

    describe(id: Id): Lexeme[] {
        return this.clause1.describe(id).concat(this.clause2.describe(id))
    }

    topLevel(): Id[] {
        return topLevel(this)
    }

    getOwnershipChain(entity: Id): Id[] {
        return getOwnershipChain(this, entity)
    }

    get theme(): Clause {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme)
    }

    get rheme() {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme)
    }

    toAction(topLevel: Clause): Action[] {
        return this.clause1.toAction(topLevel).concat(this.clause2.toAction(topLevel))
    }

    getTopLevelOwnerOf(id: Id): Id | undefined {
        return getTopLevelOwnerOf(id, this)
    }

    query(query: Clause): Map[] {

        // utility funcs
        const range = (n: number) => [...new Array(n).keys()]
        const uniq = (x: any[]) => Array.from(new Set(x))

        const universe = this.clause1.and(this.clause2)
        const multiMap: { [id: Id]: Id[] /* candidates */ } = {}

        query.entities.forEach(qe => {
            universe.entities.forEach(re => {

                // decide if qe is re ?

                const rd = universe.about(re).flatList()
                const qd = query.about(qe).flatList().filter(x => x.predicate?.root !== 'of') /* TODO remove filter eventually!  */

                // subsitute re by qe in real description
                const rd2 = rd.map(x => x.copy({ map: { [re]: qe } }))

                const qhashes = qd.map(x => x.toString())
                const r2hashes = rd2.map(x => x.toString())

                if (qhashes.every(x => r2hashes.includes(x))) { // entities match!
                    multiMap[qe] = uniq([...multiMap[qe] ?? [], re])
                }

            })
        })

        const maxSize = Math.max(Math.max(...Object.values(multiMap).map(x => x.length)), 0)

        const res = range(maxSize).map(i => {

            const m: Map = query.entities
                .filter(e => multiMap[e]?.[i] !== undefined)
                .map(e => ({ [e]: multiMap[e][i] }))
                .reduce((a, b) => ({ ...a, ...b }), {})

            return m

        })

        return res

    }

}