import { Clause } from "../clauses/Clause"
import { Id } from "../clauses/Id"
import { Lexeme } from "../lexer/Lexeme"
import BaseWrapper from "./BaseWrapper"

export default interface Wrapper {

    readonly id: Id
    readonly object: any
    readonly clause: Clause
    set(predicate: Lexeme, opts?: SetOps): void
    is(predicate: Lexeme): boolean // TODO args
    setAlias(conceptName: Lexeme, propPath: Lexeme[]): void
    pointOut(opts?: { turnOff: boolean }): void
    call(verb: Lexeme, args: (Wrapper | undefined)[]): any

    readonly simplePredicates: Lexeme[]
    readonly isPlaceholder: boolean

}

export interface SetOps {
    props?: Lexeme[]
    negated?: boolean
}

export function wrap(id: Id, o?: Object): Wrapper {
    return new BaseWrapper(o ?? {}, id, o === undefined)
}
