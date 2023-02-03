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
        // console.log('Placeholder.set()', predicate.root, new Date().getMilliseconds())
        this.predicates.push(predicate)
    }

    is(predicate: Lexeme): boolean {
        return this.predicates.some(x => x.root == predicate.root)
    }


    get clause(): Clause {

        // console.log('Placeholder.clause()', 'predicates=', this.predicates, 'predicates.length=', this.predicates.length, new Date().getMilliseconds())

        const clauses = this.predicates
            .map(p => clauseOf(p, this.id))

        // console.log('Placeholder.clause()', 'clauses=',clauses)

        const clause = clauses.reduce((a, b) => a.and(b), emptyClause())

        // console.log('Placeholder.clause()', 'clause=', clause.toString())

        return clause
    }

    setAlias(conceptName: Lexeme, propPath: Lexeme[]) { }
    pointOut(opts?: { turnOff: boolean }) { }
    call(verb: Lexeme, args: Wrapper[]) { }


}
