import { AndOpts, Clause, CopyOpts } from "./Clause";
import { Id } from "../id/Id";
import { Map } from "../id/Map";

export default class EmptyClause implements Clause {

    readonly hashCode = 0
    readonly entities = []
    readonly theme = this
    readonly rheme = this
    readonly simple = this
    readonly hasSideEffects = false

    copy = (opts?: CopyOpts): Clause => this
    and = (other: Clause, opts?: AndOpts): Clause => other
    implies = (conclusion: Clause): Clause => conclusion
    flatList = () => []
    ownedBy = (id: Id): Id[] => []
    ownersOf = (id: Id): Id[] => []
    query = (clause: Clause): Map[] => []
    toString = () => ''

}