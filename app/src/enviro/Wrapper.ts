import { Clause } from "../clauses/Clause"
import { Id } from "../clauses/Id"
import { LexemeType } from "../config/LexemeType"
import { Lexeme } from "../lexer/Lexeme"
import BaseWrapper from "./BaseWrapper"

export default interface Wrapper {

    readonly id: Id
    readonly clause: Clause

    set(predicate: Lexeme, opts?: SetOps): any
    is(predicate: Lexeme): boolean
    typeOf(word: string): LexemeType | undefined
    copy(opts?: CopyOpts): Wrapper

}

export interface SetOps {
    props?: Lexeme[]
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

export function unwrap(wrapper: Wrapper): object | undefined {
    return (wrapper as any).object
}