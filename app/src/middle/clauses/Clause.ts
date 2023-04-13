import { AtomClause } from "./AtomClause"
import { Id } from "../id/Id"
import { Map } from "../id/Map"
import EmptyClause from "./EmptyClause"
import { Lexeme } from "../../frontend/lexer/Lexeme"

/**
 * An unambiguous predicate-logic-like intermediate representation
 * of the programmer's intent.
*/
export interface Clause {

    readonly hashCode: number
    readonly entities: Id[]
    readonly theme: Clause
    readonly rheme: Clause
    readonly simple: Clause
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    flatList(): Clause[]
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    query(clause: Clause, opts?: QueryOpts): Map[]
    // implies(conclusion: Clause): Clause

    readonly predicate?: Lexeme
    readonly args?: Id[]
    readonly negated?: boolean
    readonly hasSideEffects?: boolean

}

export function clauseOf(predicate: Lexeme, ...args: Id[]): Clause {
    return new AtomClause(predicate, args)
}

export const emptyClause: Clause = new EmptyClause()

export interface CopyOpts {
    negate?: boolean
    map?: Map
    sideEffecty?: boolean
    clause1?: Clause
    clause2?: Clause
    subjconj?: Lexeme
}

export interface AndOpts {
    asRheme?: boolean
}

export interface QueryOpts {
    it?: Id
}