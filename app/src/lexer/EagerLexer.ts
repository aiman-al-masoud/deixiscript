import { getLexemes, Lexeme } from "./Lexeme";
import Lexer from "./Lexer";
import { Config } from "../config/Config";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme[]
    protected _pos: number

    constructor(readonly sourceCode: string, readonly config: Config) {

        this.tokens = sourceCode
            // .toLowerCase()
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .flatMap(s => getLexemes(s, config.lexemes))

        this._pos = 0
    }

    next(): void {
        this._pos++
    }

    get pos(): number {
        return this._pos
    }

    backTo(pos: number): void {
        this._pos = pos
    }

    get peek(): Lexeme {
        return this.tokens[this._pos]
    }

    croak(errorMsg: string): void {
        throw new Error(`${errorMsg} at ${this._pos}`);
    }

    get isEnd(): boolean {
        return this.pos >= this.tokens.length
    }

}