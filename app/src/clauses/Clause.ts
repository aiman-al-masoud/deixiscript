import { BasicClause } from "./BasicClause"
import AndClause from "./ListClause"

export type Id = number | string

/**
 * A 'language-agnostic' first order logic representation.
 */
export interface Clause {
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    copy(opts?: CopyOpts): Clause
    flatList(): Clause[]
    toProlog(): string[]
    readonly negated: boolean
    readonly isImply: boolean
    get entities(): Id[]
    get theme(): Clause
    get rheme(): Clause
}

export function clauseOf(predicate: string, ...args: Id[]) {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new AndClause([])

export interface CopyOpts {
    negate?: boolean
    map?: Map
}

export interface AndOpts {
    asRheme?: boolean
}

export interface GetRandomIdOpts {
    asVar: boolean
}

export function getRandomId(opts?: GetRandomIdOpts): Id { // TODO: higher const for production to avoid collisions
    return `${opts?.asVar ? 'Id' : 'id'}${parseInt(1000 * Math.random() + '')}`
}

export function toVar(id: Id): Id {
    return (Number(id) !== undefined ? `id${id}` : id + '').toUpperCase()
}

/**
 * Mapping any given id in the sandbox to an id in the 
 * larger universe.
 */
export type Map = { [a: Id]: Id }