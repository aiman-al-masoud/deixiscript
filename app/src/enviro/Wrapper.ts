import { Clause } from "../clauses/Clause"
import { Id } from "../clauses/Id"
import { LexemeType } from "../config/LexemeType"
import { Lexeme } from "../lexer/Lexeme"
import BaseWrapper from "./BaseWrapper"

export default interface Wrapper {

    readonly id: Id
    readonly object: any
    readonly clause: Clause

    set(predicate: Lexeme, opts?: SetOps): any
    is(predicate: Lexeme): boolean
    setAlias(conceptName: Lexeme, propPath: Lexeme[]): void
    pointOut(opts?: { turnOff: boolean }): void
    typeOf(word: string): LexemeType | undefined
    copy(opts?: CopyOpts): Wrapper

}

export interface SetOps {
    props?: Lexeme[]
    negated?: boolean
    args?: Wrapper[]
}

export interface CopyOpts {
    object?: object
}

export function wrap(id: Id, o?: Object): Wrapper {
    return new BaseWrapper(o ?? {}, id, o === undefined)
}
