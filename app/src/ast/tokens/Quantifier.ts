import existential_quantifiers from "../../../res/existential_quantifiers";
import universal_quantifiers from "../../../res/universal_quantifiers";
import Universe from "../../universe/Universe";
import Token from "../interfaces/Token";
import AbstractToken from "./AbstractToken";

export default class Quantifier extends AbstractToken{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }

    isUniversal(){
        return universal_quantifiers.includes(this.string)
    }

    isExistential(){
        return existential_quantifiers.includes(this.string)
    }
    
}