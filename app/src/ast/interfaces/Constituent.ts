import Ast from "./Ast";
import { Clause, Id } from "../../clauses/Clause";

/**
 * Some syntactic structure that can be converted to a 
 * first-order logic formula.
 */
export default interface Constituent extends Ast {
    toClause(args?: ToClauseOpts): Clause
    get isSideEffecty():boolean
}

export interface Roles {
    subject?: Id
    object?: Id
}

export interface ToClauseOpts {
    withVars?: boolean,
    roles?: Roles,
    anaphora?: {
        [predicate: string]: Id
    }
}
