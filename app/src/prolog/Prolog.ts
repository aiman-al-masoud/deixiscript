import { Map } from "../clauses/Id"
import { PrologClause } from "../clauses/PrologClause"
import TauProlog from "./TauProlog"

export default interface Prolog {
    assert(clause:PrologClause, opts?: AssertOpts): Promise<Map[]>
    retract(clause:PrologClause): Promise<Map[]>
    query(clause:PrologClause): Promise<Map[]>
}

export interface AssertOpts {
    /** if true calls assertz */
    z: boolean
}

export function getProlog(): Prolog {
    return new TauProlog()
}