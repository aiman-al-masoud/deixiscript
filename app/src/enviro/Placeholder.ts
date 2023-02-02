import { Clause, clauseOf, emptyClause } from "../clauses/Clause"
import { Id } from "../clauses/Id"
import { Lexeme } from "../lexer/Lexeme"
import Wrapper from "./Wrapper"

export class Placeholder implements Wrapper {

    constructor(
        readonly id: Id,
        readonly predicates: Lexeme[] = [],
        readonly object: any = {}) {

    }

    set(predicate: Lexeme, props?: Lexeme[]) {
        this.predicates.push(predicate)
    }

    is(predicate: Lexeme): boolean {
        return this.predicates.some(x => x.root == predicate.root)
    }


    get clause(): Clause {
        return this.predicates
            .map(p => clauseOf(p, this.id))
            .reduce((a, b) => a.and(b), emptyClause())
    }

    setAlias(conceptName: Lexeme, propPath: Lexeme[]) { }
    pointOut(opts?: { turnOff: boolean }) { }
    call(verb: Lexeme, args: Wrapper[]) { }


}
