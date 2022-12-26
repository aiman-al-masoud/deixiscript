import { BasicClause } from "./BasicClause"
import And from "./And"

export type Id = number | string

/**
 * A 'language-agnostic' first order logic representation.
 */
export interface Clause {
    and(other: Clause, opts?: AndOpts): Clause
    implies(conclusion: Clause): Clause
    copy(opts?: CopyOpts): Clause
    flatList(): Clause[]
    toProlog(opts?: ToPrologOpts): string[]
    readonly negated: boolean
    readonly isImply: boolean
    get entities(): Id[]
    get theme(): Clause
    get rheme(): Clause
    get hashCode(): number
}

export function clauseOf(predicate: string, ...args: Id[]): Clause {
    return new BasicClause(predicate, args)
}

export const emptyClause = (): Clause => new And([])

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

export interface ToPrologOpts {
    anyFactId?: boolean
}

export function getRandomId(opts?: GetRandomIdOpts): Id { // TODO: higher const for production to avoid collisions
    return `${opts?.asVar ? 'Id' : 'id'}${parseInt(1000 * Math.random() + '')}`
}

export function toVar(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase()
}

export const isVar = (e: Id) => Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase())


/**
 * Mapping any given id in the sandbox to an id in the 
 * larger universe.
 */
export type Map = { [a: Id]: Id }


export function hashString(string: string): number {

    return string.split('').map(c => c.charCodeAt(0)).reduce((hash, cc) => {
        const h1 = ((hash << 5) - hash) + cc;
        return h1 & h1; // Convert to 32bit integer
    })

}