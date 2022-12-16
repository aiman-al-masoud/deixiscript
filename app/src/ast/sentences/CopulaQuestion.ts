import Brain from "../../brain/Brain";
import BinaryQuestion from "../interfaces/BinaryQuestion";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";

export default class CopulaQuestion implements BinaryQuestion{

    constructor(readonly subject:NounPhrase, readonly predicate:NounPhrase, readonly copula:Copula){

    }
    toProlog(args?: ToPrologArgs | undefined): Clause[] {
        throw new Error("Method not implemented.");
    }
    
}