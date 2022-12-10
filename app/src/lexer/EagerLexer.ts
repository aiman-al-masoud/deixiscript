import Token from "../ast/interfaces/Token";
import Lexer, { AssertArgs } from "./Lexer";
import tokenOf from "./tokenOf";

export default class EagerLexer implements Lexer{

    protected readonly tokens:Token[]
    protected _pos:number

    constructor(readonly sourceCode:string){ 
        //TODO: reconstruct "do not" and "does not" tokens
        //TODO: nouns vs adjectives
        this.tokens = sourceCode.split(/\s+|\./).map(e=>!e?'.':e).map(tokenOf)
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

    assert <T extends Token>(args:AssertArgs): T|undefined {

        const check = <T extends Token>(t:T):t is T=>t!==undefined

        if (check(this.peek as T)) {
            this.next()
            return (this.peek as T)
        } else if (args.errorOut??true) {
            this.croak(args.errorMsg??'')
        }else{
            return undefined
        }
    }

}