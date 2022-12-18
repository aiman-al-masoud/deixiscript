import Ast from "./Ast";
import { Clause, Id } from "../../clauses/Clause";

/**
 * Some syntactic structure that can be converted to a 
 * first-order logic formula.
 */
export default interface Constituent extends Ast {
    toProlog(args?: ToPrologArgs): Clause
}

export interface Roles {
    subject?: Id
    object?: Id
}

export interface ToPrologArgs {
    withVars?: boolean,
    roles?: Roles,
    anaphora?: {
        [predicate: string]: Id
    }
}
