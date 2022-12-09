import definite_articles from "../../../res/definite_articles";
import Universe from "../../universe/Universe";
import Token from "../interfaces/Token";
import AbstractToken from "./AbstractToken";

export default class Article extends AbstractToken{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }

    isDefinite(){
        return definite_articles.includes(this.string)
    }

}