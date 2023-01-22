import Action from "../actuator/Action";
import { LexemeType } from "../config/LexemeType";
import { Lexeme } from "../lexer/Lexeme";
import { AndOpts, Clause, CopyOpts } from "./Clause";
import { Id } from "./Id";

export class EmptyClause implements Clause {

    constructor(readonly negated = false,
        readonly isImply = false,
        readonly hashCode = 99999999,
        readonly entities = [],
        readonly isSideEffecty = false,
        readonly exactIds = false) {

    }

    copy(opts?: CopyOpts): Clause {
        return this
    }

    get theme() {
        return this
    }

    get rheme() {
        return this
    }

    and(other: Clause, opts?: AndOpts): Clause {
        return other
    }

    implies(conclusion: Clause): Clause {
        return conclusion
    }

    flatList(): Clause[] {
        return []
    }

    about(id: Id): Clause {
        return this
    }

    ownedBy(id: Id): Id[] {
        return []
    }

    ownersOf(id: Id): Id[] {
        return []
    }

    describe(id: Id): Lexeme<LexemeType>[] {
        return []
    }

    topLevel(): Id[] {
        return []
    }
    getOwnershipChain(entity: Id): Id[] {
        return []
    }

    toString() {
        return ''
    }

    toAction(topLevel: Clause): Action[] {
        return []
    }

}