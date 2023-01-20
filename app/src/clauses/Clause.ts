import { BasicClause } from "./BasicClause"
import { Id, Map } from "./Id"
import Action from "../actuator/Action"
import { EmptyClause } from "./EmptyClause"
import { Lexeme } from "../lexer/Lexeme"
// import { lexemes } from "../lexer/lexemes"
import { LexemeType } from "../config/LexemeType"

/**
 * A 'language-agnostic' first order logic representation.
*/
export interface Clause {
    readonly negated: boolean
    readonly isImply: boolean
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
    toAction(topLevel: Clause): Promise<Action[]>
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    describe(id: Id): string[]
    topLevel(): Id[]
    getOwnershipChain(entity: Id): Id[]
}

export function clauseOf(predicate: Lexeme<LexemeType>, ...args: Id[]): Clause {
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