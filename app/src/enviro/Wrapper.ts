import { LexemeType } from "../config/LexemeType"
import { Lexeme } from "../lexer/Lexeme"
import ConcreteWrapper from "./ConcreteWrapper"

export default interface Wrapper {

    readonly object: any
    set(predicate: Lexeme<LexemeType>, props?: Lexeme<LexemeType>[]): void
    is(predicate: Lexeme<LexemeType>): boolean // TODO args
    setAlias(conceptName: Lexeme<LexemeType>, propPath: Lexeme<LexemeType>[]): void
    pointOut(opts?: { turnOff: boolean }): void
    // get(predicate: string): any

}

export function wrap(o: any): Wrapper {
    return new ConcreteWrapper(o)
}