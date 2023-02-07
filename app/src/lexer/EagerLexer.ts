import Lexer from "./Lexer";
import { Lexeme } from "./Lexeme";
import { getLexemes } from "./functions/getLexemes";
import { Context } from "../brain/Context";
import { respace } from "./functions/respace";
import { stdspace } from "./functions/stdspace";
import { joinMultiWordLexemes } from "./functions/joinMultiWordLexemes";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme[]
    protected _pos: number

    constructor(readonly sourceCode: string, readonly context: Context) { // TODO: make case insensitive

        const words =
            joinMultiWordLexemes(stdspace(sourceCode), context.config.lexemes)
                .trim()
                .split(/\s+|\./)
                .map(s => !s ? '.' : s)
                .map(s => respace(s))

        this.tokens = words.flatMap(w => getLexemes(w, context, words))
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