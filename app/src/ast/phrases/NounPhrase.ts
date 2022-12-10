import Universe from "../../universe/Universe";
import Phrase from "../interfaces/Phrase";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Noun from "../tokens/Noun";
import Quantifier from "../tokens/Quantifier";
import Complement from "./Complement";
import SubordinateClause from "./SubordinateClause";

export default class NounPhrase implements Phrase {

    constructor(readonly noun: Noun, 
                readonly adjectives: Adjective[], 
                readonly complements: Complement[], 
                readonly quantifier?: Quantifier, 
                readonly article?: Article, 
                readonly subordClause?: SubordinateClause) {

    }

    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }

}