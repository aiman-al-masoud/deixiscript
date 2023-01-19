import AbstractToken from "./AbstractToken";

export default class Quantifier extends AbstractToken {

    isUniversal() {
        return this.lexeme.type === 'uniquant'
    }

    isExistential() {
        return this.lexeme.type === 'existquant'
    }

}