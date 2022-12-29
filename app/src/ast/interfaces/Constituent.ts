import Ast from "./Ast";
import { Clause } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";

/**
 * Some syntactic structure that can be converted to a 
 * first-order logic formula.
 */
export default interface Constituent extends Ast {
    toClause(args?: ToClauseOpts): Promise<Clause>
    get isSideEffecty():boolean
}

export interface Roles {
    subject?: Id
    object?: Id
}

export interface ToClauseOpts {
    roles?: Roles,
    anaphora?: Clause
}
