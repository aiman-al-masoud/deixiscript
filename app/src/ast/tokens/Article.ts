import AbstractToken from "./AbstractToken";

export default class Article extends AbstractToken {

    isDefinite() {
        return this.lexeme.type === 'defart'
    }
    
}