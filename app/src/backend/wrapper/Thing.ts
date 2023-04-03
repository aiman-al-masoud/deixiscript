import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import { Heirloom } from "./Heirloom"
import BaseThing from "./BaseThing"
import { Clause } from "../../middle/clauses/Clause"
import { Context } from "../../facade/context/Context"
import { Map } from "../../middle/id/Map"

export default interface Thing {

    query(clause: Clause, parentMap?: Map): Map[]
    get(id: Id): Thing | undefined
    set(predicate: Lexeme, opts?: SetOps): Thing | undefined
    copy(opts?: CopyOpts): Thing
    unwrap(): any
    toClause(query?: Clause): Clause
    getLexemes(): Lexeme[]
    readonly id: Id
    readonly parent?: Thing

    setAlias(alias: string, path: string[]): void
    getHeirlooms(): Heirloom[]
    getConcepts(): string[]
}

export interface SetOps {
    negated?: boolean
    args?: Thing[]
    context?: Context
}

export interface CopyOpts {
    object?: object
    preds?: Lexeme[]
    id?: Id
}

export function wrap(args: WrapArgs): Thing {
    return new BaseThing(args.object ?? {}, args.id, args.parent, args.name)
}

export interface WrapArgs {
    id: Id,
    preds?: Lexeme[],
    object?: Object,
    parent?: Thing,
    name?: string
}
