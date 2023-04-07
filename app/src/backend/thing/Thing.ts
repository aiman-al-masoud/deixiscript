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
    query(clause: Clause): Map[]
    pointOut(doIt: boolean): void
    readonly id: Id

    setParent(parent: Context): void
    getAllKeys(): string[]
    readonly name: string
    
    isAlready(relation: Relation): boolean
    equals(other: Thing): boolean
    extends(thing: Thing): void

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


export type Relation = {
    predicate: Thing,
    args: Thing[],//implied subject = this object
}

export function relationsEqual(r1: Relation, r2: Relation) {
    return r1.predicate.equals(r2.predicate)
        && r1.args.length === r2.args.length
        && r1.args.every((x, i) => r2.args[i] === x)
}