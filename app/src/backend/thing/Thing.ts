import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import { Clause } from "../../middle/clauses/Clause"
import { Context } from "../../facade/context/Context"
import { Map } from "../../middle/id/Map"
import { BaseThing } from "./BaseThing"

export default interface Thing {

    get(id: Id): Thing | undefined
    set(predicate: Thing, opts?: SetArgs): Thing[]
    copy(opts?: CopyOpts): Thing
    unwrap(): any
    getLexemes(): Lexeme[]
    toClause(query?: Clause): Clause
    query(clause: Clause, parentMap?: Map): Map[]
    pointOut(doIt: boolean): void
    readonly id: Id

    // readonly parent?: Thing | Context
    equals(other: Thing): boolean
    setParent(parent: Context): void

}

export interface SetArgs {
    negated?: boolean
    args?: Thing[]
}

export interface CopyOpts {
    id?: Id
}

export function wrap(args: WrapArgs): Thing {
    return new BaseThing(args)
}

export interface WrapArgs {
    id: Id,
    object?: Object,
    parent?: Thing | Context,
    base?: Thing,
    superclass?: Thing,
}
