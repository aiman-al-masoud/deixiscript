import definite_articles from "../../../res/tokens/definite_articles";
import Brain from "../../brain/Brain";
import AbstractToken from "./AbstractToken";

export default class Article extends AbstractToken{

    isDefinite(){
        return definite_articles.includes(this.string)
    }

    toString(){
        return `Article(${this.string}, isDefinite=${this.isDefinite()})`
    }

}