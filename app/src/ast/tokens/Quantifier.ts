import { formsOf } from "../../lexer/Lexeme";
import { lexemes } from "../../lexer/lexemes";
import AbstractToken from "./AbstractToken";

export default class Quantifier extends AbstractToken {

    isUniversal() {

        return lexemes
            .filter(x => x.type === 'uniquant')
            .flatMap(x => formsOf(x))
            .includes(this.string)

    }

    isExistential() {

        return lexemes
            .filter(x => x.type === 'existquant')
            .flatMap(x => formsOf(x))
            .includes(this.string)

    }

}