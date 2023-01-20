import { LexemeType } from "../ast/interfaces/LexemeType";
import { getLexemes, Lexeme } from "./Lexeme";
import Lexer, { AssertArgs } from "./Lexer";

export default class EagerLexer implements Lexer {

    protected readonly tokens: Lexeme<LexemeType>[]
    protected _pos: number

    constructor(readonly sourceCode: string) {

        this.tokens = sourceCode
            // .toLowerCase()
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .flatMap(s => getLexemes(s))

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

    get peek(): Lexeme<LexemeType> {
        return this.tokens[this._pos]
    }

    croak(errorMsg: string): void {
        throw new Error(`${errorMsg} at ${this._pos}`);
    }

    /**
     * Return current token iff of given type and move to next; 
     * else return undefined and don't move.
     * @param args 
     * @returns 
     */
    assert<T extends LexemeType>(type: T, args: AssertArgs): Lexeme<T> | undefined {

        const current = this.peek

        if (current && current.type === type) {
            this.next()
            return current as Lexeme<T>
        } else if (args.errorOut ?? true) {
            this.croak(args.errorMsg ?? '')
        } else {
            return undefined
        }

    }

    get isEnd(): boolean {
        return this.pos >= this.tokens.length
    }

}