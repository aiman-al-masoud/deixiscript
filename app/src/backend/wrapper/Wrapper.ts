import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import BaseWrapper from "./BaseWrapper"
import { Clause } from "../../middle/clauses/Clause"

export default interface Wrapper {

    readonly id: Id
    readonly parent?: Wrapper
    set(predicate: Lexeme, opts?: SetOps): any
    is(predicate: Lexeme): boolean
    copy(opts?: CopyOpts): Wrapper
    get(clause: Clause): Wrapper | undefined
    /** describe the object */ toClause(clause?: Clause): Clause
    /** infer grammatical types of props */ dynamic(): Lexeme[]
    unwrap(): any | undefined
}

export interface SetOps {
    props?: string[]
    negated?: boolean
    args?: Wrapper[]
}

export interface CopyOpts {
    object?: object
    preds?: Lexeme[]
}

export function wrap(id: Id, preds: Lexeme[], o?: Object): Wrapper {
    return new BaseWrapper(o ?? {}, id, preds)
}