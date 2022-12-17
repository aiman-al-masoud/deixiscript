import Ast from "./Ast";
import { Clause } from "./Clause";

/**
 * Some syntactic structure that can be converted to a 
 * first-order logic formula.
 */
export default interface Constituent extends Ast {
    toProlog(args?: ToPrologArgs): Clause
}

export type Id = number | string

export interface Roles {
    subject?: Id,
    object?: Id
}

export interface ToPrologArgs {
    withVars?: boolean,
    roles?: Roles,
    anaphora?: {
        [predicate: string]: Id
    }
}

export function getRandomId(): Id {
    return parseInt(1000000 * Math.random() + "")
}