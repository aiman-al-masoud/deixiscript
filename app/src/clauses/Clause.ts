import { BasicClause } from "./BasicClause"
import And from "./And"
import { Id, Map } from "./Id"
import { PrologClause } from "./PrologClause"


/**
 * A 'language-agnostic' first order logic representation.
*/
export interface Clause {
    readonly negated: boolean
    readonly isImply: boolean
    readonly hashCode: number
    readonly entities:Id[]
    readonly theme: Clause
    readonly rheme: Clause
    readonly noAnaphora : boolean
    copy(opts?: CopyOpts): Clause
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    flatList(): Clause[]
    toProlog(opts?: ToPrologOpts): PrologClause[]
    about(id:Id):Clause
}

export function clauseOf(predicate: string, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new And([])

export interface CopyOpts {
    negate?: boolean
    map?: Map
    noAnaphora? : boolean // interpret every id as exact
}

export interface AndOpts {
    asRheme?: boolean
}

export interface ToPrologOpts {
    anyFactId?: boolean
}

export function hashString(string: string) {
    return string.split('').map(c => c.charCodeAt(0)).reduce((hash, cc) => {
        const h1 = ((hash << 5) - hash) + cc;
        return h1 & h1; // Convert to 32bit integer
    })
}