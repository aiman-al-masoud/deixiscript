import { LexemeType } from "../ast/interfaces/LexemeType"
import EagerLexer from "./EagerLexer"
import { Lexeme } from "./Lexeme"

export default interface Lexer {
    get peek(): Lexeme<LexemeType>
    get pos(): number
    get isEnd(): boolean
    next(): void
    backTo(pos: number): void
    croak(errorMsg: string): void
    assert<T extends LexemeType>(type: T, args: AssertArgs): Lexeme<T> | undefined
}

export interface AssertArgs {
    errorMsg?: string
    errorOut?: boolean
}

export function getLexer(sourceCode: string): Lexer {
    return new EagerLexer(sourceCode)
}

export type Constructor<T> = new (...args: any[]) => T
