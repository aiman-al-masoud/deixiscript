import Brain from "../../brain/Brain";
import CompoundSentence from "../interfaces/CompoundSentence";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";
import SimpleSentence from "../interfaces/SimpleSentence";
import SubordinatingConjunction from "../tokens/SubordinatingConjunction";

export default class ComplexSentence implements CompoundSentence{

    constructor(readonly condition:SimpleSentence, readonly outcome:SimpleSentence, readonly subconj:SubordinatingConjunction){

    }
    toProlog(args?: ToPrologArgs | undefined): Clause[] {
        throw new Error("Method not implemented.");
    }
    
}