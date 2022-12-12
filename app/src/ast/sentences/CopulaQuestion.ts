import Brain from "../../brain/Brain";
import BinaryQuestion from "../interfaces/BinaryQuestion";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";

export default class CopulaQuestion implements BinaryQuestion{

    constructor(readonly subject:NounPhrase, readonly predicate:NounPhrase, readonly copula:Copula){

    }
    
    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }
    
}