import existential_quantifiers from "../../../res/existential_quantifiers";
import universal_quantifiers from "../../../res/universal_quantifiers";
import Brain from "../../brain/Brain";
import Token from "../interfaces/Token";
import AbstractToken from "./AbstractToken";

export default class Quantifier extends AbstractToken{
    
    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }

    isUniversal(){
        return universal_quantifiers.includes(this.string)
    }

    isExistential(){
        return existential_quantifiers.includes(this.string)
    }
    
}