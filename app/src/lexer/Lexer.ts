import EagerLexer from "./EagerLexer"
import { Lexeme } from "./Lexeme"
import { Config } from "../config/Config"
import { Context } from "../brain/Context"

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