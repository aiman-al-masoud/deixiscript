import { Map } from "../clauses/Id"
import TauProlog from "./TauProlog"

export default interface Prolog {
    assert(clause: string, opts?: AssertOpts): Promise<void>
    retract(clause: string): Promise<void>
    query(code: string): Promise<Map[]>
    predicates(opts?: PreidcatesOpts): string[]
}

export interface AssertOpts {
    /** if true calls assertz */
    z: boolean
}

export interface PreidcatesOpts {
    arity: number
}

export function getProlog(): Prolog {
    return new TauProlog()
}