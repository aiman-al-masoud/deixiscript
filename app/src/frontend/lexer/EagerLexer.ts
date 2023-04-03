import Lexer from "./Lexer";
import { Lexeme } from "./Lexeme";
import { Context } from "../../facade/context/Context";
import { dynamicLexeme } from "./functions/dynamicLexeme";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme[]
    protected _pos: number = 0

    constructor(readonly sourceCode: string, readonly context: Context) {

        const words =
            sourceCode
                .trim()
                .split(/\s+|\./)
                .map(s => !s ? '.' : s)

        this.tokens = words.flatMap(w => {
            const lex = context.getLexeme(w) ?? dynamicLexeme(w, context, words)
            return lex.contractionFor ?? [lex]
        })

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