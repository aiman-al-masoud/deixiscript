import { formsOf } from "../../lexer/Lexeme";
import { lexemes } from "../../lexer/lexemes";
import AbstractToken from "./AbstractToken";

export default class Article extends AbstractToken {

    isDefinite() {

        return lexemes
            .filter(x => x.type === 'defart')
            .flatMap(x => formsOf(x))
            .includes(this.string)
    }

    toString() {
        return `Article(${this.string}, isDefinite=${this.isDefinite()})`
    }

}