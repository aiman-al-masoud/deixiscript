import { BasicClause } from "./BasicClause"
import { Id, Map } from "./Id"
import { Lexeme } from "../lexer/Lexeme"
import And from "./And"

/**
 * A 'language-agnostic' first order logic representation.
*/
export interface Clause {

    readonly hashCode: number
    readonly entities: Id[]
    readonly theme: Clause
    readonly rheme: Clause
    readonly simplify: Clause
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    flatList(): Clause[]
    about(id: Id): Clause
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    describe(id: Id): Lexeme[]
    query(clause: Clause): Map[]

    readonly predicate?: Lexeme
    readonly args?: Id[]
    readonly negated?: boolean
    readonly exactIds?: boolean
    readonly isSideEffecty?: boolean

}

export function clauseOf(predicate: Lexeme, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}


export const emptyClause: Clause = new And([])


export interface CopyOpts {
    negate?: boolean
    map?: Map
    exactIds?: boolean
    sideEffecty?: boolean
}

export interface AndOpts {
    asRheme?: boolean
}