import { Lexeme } from "../lexer/Lexeme";
import { AndOpts, Clause, CopyOpts } from "./Clause";
import { Id, Map } from "./Id";

export default class EmptyClause implements Clause {

    readonly theme
    readonly rheme
    readonly simplify

    constructor(
        readonly hashCode = 0,
        readonly entities = []) {

        this.theme = this
        this.rheme = this
        this.simplify = this
    }

    copy = (opts?: CopyOpts): Clause => this
    and = (other: Clause, opts?: AndOpts): Clause => other
    implies = (conclusion: Clause): Clause => conclusion
    flatList = () => []
    about = (id: Id): Clause => this
    ownedBy = (id: Id): Id[] => []
    ownersOf = (id: Id): Id[] => []
    describe = (id: Id): Lexeme[] => []
    query = (clause: Clause): Map[] => []

}