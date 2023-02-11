import { Lexeme } from "../lexer/Lexeme";
import { AndOpts, Clause, CopyOpts } from "./Clause";
import { Id } from "../id/Id";
import { Map } from "../id/Map";

export default class EmptyClause implements Clause {

    readonly hashCode = 0
    readonly entities = []
    readonly theme = this
    readonly rheme = this
    readonly simple = this

    copy = (opts?: CopyOpts): Clause => this
    and = (other: Clause, opts?: AndOpts): Clause => other
    implies = (conclusion: Clause): Clause => conclusion
    flatList = () => []
    about = (id: Id): Clause => this
    ownedBy = (id: Id): Id[] => []
    ownersOf = (id: Id): Id[] => []
    describe = (id: Id): Lexeme[] => []
    query = (clause: Clause): Map[] => []
    toString = () => ''

}