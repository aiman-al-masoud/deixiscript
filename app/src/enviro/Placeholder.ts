import { LexemeType } from "../config/LexemeType"
import { Lexeme } from "../lexer/Lexeme"
import Wrapper from "./Wrapper"

export class Placeholder implements Wrapper {

    constructor(readonly predicates: Lexeme<LexemeType>[] = [], readonly object: any = {}) {

    }

    set(predicate: Lexeme<LexemeType>, props?: Lexeme<LexemeType>[]) {
        this.predicates.push(predicate)
    }

    is(predicate: Lexeme<LexemeType>): boolean {
        // return this.predicates.includes(predicate.root)
        return this.predicates.some(x => x.root == predicate.root)
    }

    setAlias(conceptName: Lexeme<LexemeType>, propPath: Lexeme<LexemeType>[]) { }
    pointOut(opts?: { turnOff: boolean }) { }


    // set(predicate: string, props: string[]): void {
    //     this.predicates.push(predicate)
    // }

    // is(predicate: string, ...args: Wrapper[]): boolean {
    //     return this.predicates.includes(predicate)
    // }

    // setAlias(conceptName: string, propPath: string[]): void { }
    // pointOut(opts?: { turnOff: boolean }): void { }

}
