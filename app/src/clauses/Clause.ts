import { BasicClause } from "./BasicClause"
import { HornClause } from "./HornClause"
import ListClause from "./ListClause"

// export const CONST_PREFIX = 'id'
// export const VAR_PREFIX = 'Id'
export type Id = number | string


export interface Clause {
    concat(other: Clause, opts?: ConcatOpts): Clause
    copy(opts?: CopyOpts): Clause
    toList(): Clause[]
    about(id: Id): Clause[]
    flatList(): Clause[]
    readonly negated: boolean
    get entities(): Id[]
    get theme(): Clause
    get rheme(): Clause
    get isImply():boolean
}

export function clauseOf(predicate: string, ...args: Id[]) {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new ListClause([])

export interface CopyOpts {
    negate?: boolean
    map?: Map
}

export interface ConcatOpts {
    asRheme?: boolean
}

export function makeHornClauses(conditions: Clause, conclusions: Clause): Clause {

    // TODO: this breaks negated ListClauses or ListClauses with negated elements !!!!!!!

    const cond = conditions.toList().map(c => (c as BasicClause))
    const conc = conclusions.toList().map(c => (c as BasicClause))
    const results = conc.map(c => new HornClause(cond, c))

    return results.length == 1 ? results[0] : new ListClause(results)

}

export function getRandomId(opts?: GetRandomIdOpts): Id { // TODO: higher const for production to avoid collisions
    return `${opts?.asVar? 'Id' : 'id'}${parseInt(1000 * Math.random() + '')}`
}

export function toVar(id:Id):Id{
    return (id+'').toUpperCase()
}

export interface GetRandomIdOpts {
    asVar: boolean
}

/**
 * Mapping any given id in the sandbox to an id in the 
 * larger universe.
 */
export type Map = { [a: Id]: Id }