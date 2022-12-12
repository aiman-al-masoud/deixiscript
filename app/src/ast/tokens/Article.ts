import definite_articles from "../../../res/definite_articles";
import Brain from "../../brain/Brain";
import AbstractToken from "./AbstractToken";

export default class Article extends AbstractToken{
    
    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }

    isDefinite(){
        return definite_articles.includes(this.string)
    }

    toString(){
        return `Article(${this.string}, isDefinite=${this.isDefinite()})`
    }

}