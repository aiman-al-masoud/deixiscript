import Lexer from "./Lexer";
import { Lexeme, makeLexeme } from "./Lexeme";
import { Context } from "../../backend/Context";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme[]
    protected _pos: number = 0

    constructor(readonly sourceCode: string, readonly context: Context) {

        const words =
            sourceCode
                .trim()
                .split(/\s+|\./)
                .map(s => !s ? '.' : s)

        const isMacroContext =
            words.some(x => context.getLexeme(x)?.type === 'grammar')
            && !words.some(x => ['defart', 'indefart', 'nonsubconj'].includes(context.getLexeme(x)?.type as any))//TODO: why dependencies('macro') doesn't work?!

        this.tokens = words.map(w => context.getLexeme(w) ?? makeLexeme({ root: w, token: w, type: isMacroContext ? 'grammar' : 'noun' }))

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