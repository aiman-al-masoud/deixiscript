import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import { Heirloom } from "./Heirloom"
import BaseWrapper from "./BaseWrapper"
import { Clause } from "../../middle/clauses/Clause"
import { Context } from "../../facade/context/Context"
import { Map, ThingMap } from "../../middle/id/Map"

export default interface Wrapper {

    query(clause: Clause, parentMap?: Map): Map[]
    get(id: Id): Wrapper | undefined
    set(predicate: Lexeme, opts?: SetOps): Wrapper | undefined
    copy(opts?: CopyOpts): Wrapper
    unwrap(): any
    /** describe the object */ toClause(query?: Clause): Clause
    /** infer grammatical types of props */ dynamic(): Lexeme[]
    readonly id: Id
    readonly parent?: Wrapper

    setAlias(alias: string, path: string[]): void
    getHeirlooms(): Heirloom[]
    getConcepts(): string[]
}

export interface SetOps {
    negated?: boolean
    args?: Wrapper[]
    context?: Context
}

export interface CopyOpts {
    object?: object
    preds?: Lexeme[]
    id?: Id
}

export function wrap(args: WrapArgs): Wrapper {
    return new BaseWrapper(args.object ?? {}, args.id/* , args.preds ?? [] */, args.parent, args.name)
}

export interface WrapArgs {
    id: Id,
    preds?: Lexeme[],
    object?: Object,
    parent?: Wrapper,
    name?: string
}
