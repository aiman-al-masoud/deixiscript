import Prolog from "../prolog/Prolog"
import { AndPrologClause } from "./AndPrologClause"

/**
 * Represent prolog-syntax compliant clauses, accepted by {@link Prolog}.
 */
export interface PrologClause {
    toString(): string
    copy(opts?: CopyPrologClauseOpts): PrologClause
    and(clause: PrologClause): PrologClause
    toList(): PrologClause[]
}

export interface CopyPrologClauseOpts {
    anyFact: boolean
}

export const emptyPrologClause = ()=> new AndPrologClause([])