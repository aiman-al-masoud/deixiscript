import { LexemeType } from "../config/LexemeType"
import { Lexeme } from "../lexer/Lexeme"
import ConcreteWrapper from "./ConcreteWrapper"

export default interface Wrapper {

    readonly object: any
    set(predicate: Lexeme, props?: Lexeme[]): void
    is(predicate: Lexeme): boolean // TODO args
    setAlias(conceptName: Lexeme, propPath: Lexeme[]): void
    pointOut(opts?: { turnOff: boolean }): void
    // get(predicate: string): any

}

export function wrap(o: any): Wrapper {
    return new ConcreteWrapper(o)
}