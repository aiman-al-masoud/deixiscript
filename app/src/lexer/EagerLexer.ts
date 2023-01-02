import Token from "../ast/interfaces/Token";
import Lexer, { AssertArgs, Constructor } from "./Lexer";
import tokenOf from "./tokenOf";


export default class EagerLexer implements Lexer {

    protected readonly tokens: Token[]
    protected _pos: number

    constructor(readonly sourceCode: string) {

        this.tokens = sourceCode
            .trim()
            .split(/\s+|\./)
            .map(e => !e ? '.' : e)
            .flatMap(tokenOf)

        console.debug('tokens', this.tokens)
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

    get peek(): Token {
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
    assert<T>(clazz: Constructor<T>, args: AssertArgs): T | undefined {

        const current = this.peek

        if (current instanceof clazz) {
            this.next()
            return current
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