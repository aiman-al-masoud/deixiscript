import Lexer from "./Lexer";
import { Lexeme, makeLexeme } from "./Lexeme";
import { Context } from "../../backend/Context";

export default class EagerLexer implements Lexer {

    protected tokens: Lexeme[] = []
    protected words: string[]
    protected _pos: number = 0

    constructor(readonly sourceCode: string, readonly context: Context) {
        this.words =
            sourceCode
                .trim()
                .split(/\s+|\./)
                .map(s => !s ? '.' : s)

        this.refreshTokens()
    }

    refreshTokens() {
        this.tokens = this.words.map(w => this.context.getLexeme(w) ?? makeLexeme({ root: w, token: w, type: 'noun' }))
    }

    next(): void {
        this.refreshTokens()
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