import { BasicClause } from "./BasicClause"
import { Id } from "../id/Id"
import { Map } from "../id/Map"
import { Lexeme } from "../lexer/Lexeme"
import EmptyClause from "./EmptyClause"

/**
 * A 'language-agnostic' first order logic representation.
*/
export interface Clause {

    readonly hashCode: number
    readonly entities: Id[]
    readonly theme: Clause
    readonly rheme: Clause
    readonly simple: Clause
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    flatList(): Clause[]
    about(id: Id): Clause
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    describe(id: Id): Lexeme[]
    query(clause: Clause, opts?: QueryOpts): Map[]

    readonly predicate?: Lexeme
    readonly args?: Id[]
    readonly negated?: boolean
    readonly isSideEffecty?: boolean

}

export function clauseOf(predicate: Lexeme, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}

export const emptyClause: Clause = new EmptyClause()

export interface CopyOpts {
    negate?: boolean
    map?: Map
    exactIds?: boolean
    sideEffecty?: boolean
    clause1?: Clause
    clause2?: Clause
}

export interface AndOpts {
    asRheme?: boolean
}

export interface QueryOpts {
    it?: Id
}