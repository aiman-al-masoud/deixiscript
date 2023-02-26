import { Id } from "../../middle/id/Id"
import { Lexeme } from "../../frontend/lexer/Lexeme"
import BaseWrapper from "./BaseWrapper"
import { Clause } from "../../middle/clauses/Clause"

export default interface Wrapper {

    readonly id: Id
    readonly parent?: Wrapper
    toClause(clause?: Clause): Clause
    set(predicate: Lexeme, opts?: SetOps): any
    is(predicate: Lexeme): boolean
    copy(opts?: CopyOpts): Wrapper
    get(clause: Clause): Wrapper | undefined
    dynamic(): Lexeme[] /* extrapolated nouns and verbs associated to this object */
    unwrap():any|undefined
}

export interface SetOps {
    props?:string[]
    negated?: boolean
    args?: Wrapper[]
    aliasPath?: Lexeme[]
}

export interface CopyOpts {
    object?: object
}

export function wrap(id: Id, o?: Object): Wrapper {
    return new BaseWrapper(o ?? {}, id, o === undefined)
}