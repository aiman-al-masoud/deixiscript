import { Lexeme } from "../lexer/Lexeme"
import Wrapper from "./Wrapper"

export class Placeholder implements Wrapper {

    constructor(readonly predicates: Lexeme[] = [], readonly object: any = {}) {

    }

    set(predicate: Lexeme, props?: Lexeme[]) {
        this.predicates.push(predicate)
    }

    is(predicate: Lexeme): boolean {
        return this.predicates.some(x => x.root == predicate.root)
    }

    setAlias(conceptName: Lexeme, propPath: Lexeme[]) { }
    pointOut(opts?: { turnOff: boolean }) { }
    call(verb: Lexeme, args: Wrapper[]) { }

}
