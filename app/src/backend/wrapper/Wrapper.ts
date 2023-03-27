import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import { Heirloom } from "./Heirloom"
import BaseWrapper from "./BaseWrapper"
import { Clause } from "../../middle/clauses/Clause"
import { Context } from "../../facade/context/Context"

export default interface Wrapper {

    readonly id: Id
    readonly parent?: Wrapper
    set(predicate: Lexeme, opts?: SetOps): Wrapper | undefined
    is(predicate: Lexeme): boolean
    copy(opts?: CopyOpts): Wrapper
    get(predicate: Lexeme): Wrapper | undefined
    /** describe the object */ toClause(query?: Clause): Clause
    /** infer grammatical types of props */ dynamic(): Lexeme[]
    unwrap(): any



    setAlias(alias: string, path: string[]): void
    getHeilooms(): Heirloom[]
    setProto(proto?: string): void
    getProto(): object | undefined
    getConcepts(): string[] | undefined

}

export interface SetOps {
    negated?: boolean
    args?: Wrapper[]
    context?: Context
}

export interface CopyOpts {
    object?: object
    preds?: Lexeme[]
}

export function wrap(args: WrapArgs): Wrapper {
    return new BaseWrapper(args.object ?? {}, args.id, args.preds ?? [], args.parent, args.name)
}

export interface WrapArgs {
    id: Id,
    preds?: Lexeme[],
    object?: Object,
    parent?: Wrapper,
    name?: string
}
