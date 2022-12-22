import { Id } from "../clauses/Clause"
import TauProlog from "./TauProlog"

export default interface Prolog {
    assert(clause: string, opts?: AssertOpts): Promise<void>
    retract(clause: string): Promise<void>
    query(code: string): Promise<{ [id: Id]: Id[] } | boolean>
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