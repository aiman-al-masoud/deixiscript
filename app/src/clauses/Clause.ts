import { BasicClause } from "./BasicClause"
import { Id, Map } from "./Id"
import Action from "../actuator/actions/Action"
import { EmptyClause } from "./EmptyClause"
import { Lexeme } from "../lexer/Lexeme"

/**
 * A 'language-agnostic' first order logic representation.
*/
export interface Clause {
    readonly predicate?: Lexeme
    readonly args?: Id[]
    readonly negated: boolean
    readonly hashCode: number
    readonly entities: Id[]
    readonly theme: Clause
    readonly rheme: Clause
    readonly isSideEffecty: boolean
    readonly exactIds: boolean
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    flatList(): Clause[]
    about(id: Id): Clause
    toAction(topLevel: Clause): Action[]
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    describe(id: Id): Lexeme[]
    topLevel(): Id[]
    getOwnershipChain(entity: Id): Id[]
    getTopLevelOwnerOf(id: Id): Id | undefined
}

export function clauseOf(predicate: Lexeme, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new EmptyClause()

export interface CopyOpts {
    negate?: boolean
    map?: Map
    exactIds?: boolean
    sideEffecty?: boolean
}

export interface AndOpts {
    asRheme?: boolean
}