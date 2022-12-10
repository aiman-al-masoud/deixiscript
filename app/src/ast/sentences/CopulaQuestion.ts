import Universe from "../../universe/Universe";
import BinaryQuestion from "../interfaces/BinaryQuestion";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";

export default class CopulaQuestion implements BinaryQuestion{

    constructor(readonly subject:NounPhrase, readonly predicate:NounPhrase, readonly copula:Copula){

    }
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}