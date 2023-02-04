import Lexer from "./Lexer";
import { getLexemes, isMultiWord, Lexeme, respace, stdspace, unspace } from "./Lexeme";
import { Context } from "../brain/Context";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme[]
    protected _pos: number

    constructor(readonly sourceCode: string, readonly context: Context) { // TODO: make case insensitive

        const words =
            this.joinMultiWordLexemes(stdspace(sourceCode), context.config.lexemes)
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

    protected joinMultiWordLexemes(sourceCode: string, lexemes: Lexeme[]) {

        let newSource = sourceCode

        lexemes
            .filter(x => isMultiWord(x))
            .forEach(x => {
                const lexeme = stdspace(x.root)
                newSource = newSource.replaceAll(lexeme, unspace(lexeme))
            })

        return newSource
    }

}