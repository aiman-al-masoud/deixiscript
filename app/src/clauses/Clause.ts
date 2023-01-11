import { BasicClause } from "./BasicClause"
import And from "./And"
import { Id, Map } from "./Id"
import Action from "../actuator/Action"

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
    readonly noAnaphora: boolean
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    flatList(): Clause[]
    about(id: Id): Clause
    toAction(): Promise<Action>
    ownedBy(id: Id): Id[]
    ownersOf(id: Id): Id[]
    describe(id: Id): string[]
    topLevel(): Id[]
}

export function clauseOf(predicate: string, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new And([])

export interface CopyOpts {
    negate?: boolean
    map?: Map
    noAnaphora?: boolean // interpret every id as exact
    sideEffecty?: boolean
}

export interface AndOpts {
    asRheme?: boolean
}