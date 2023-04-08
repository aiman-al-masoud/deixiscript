import { Context } from "../../backend/Context"
import EagerLexer from "./EagerLexer"
import { Lexeme } from "./Lexeme"

export default interface Lexer {
    get peek(): Lexeme
    get pos(): number
    get isEnd(): boolean
    next(): void
    backTo(pos: number): void
    croak(errorMsg: string): void
}

export function getLexer(sourceCode: string, context: Context): Lexer {
    return new EagerLexer(sourceCode, context)
}