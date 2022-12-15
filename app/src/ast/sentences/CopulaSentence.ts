import Brain from "../../brain/Brain";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence{

    constructor(readonly subject:NounPhrase, readonly copula:Copula, readonly predicate:NounPhrase, readonly negation?:Negation){
        
    }
    
}