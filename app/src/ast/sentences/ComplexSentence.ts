import Brain from "../../brain/Brain";
import CompoundSentence from "../interfaces/CompoundSentence";
import SimpleSentence from "../interfaces/SimpleSentence";
import SubordinatingConjunction from "../tokens/SubordinatingConjunction";

export default class ComplexSentence implements CompoundSentence{

    constructor(readonly condition:SimpleSentence, readonly outcome:SimpleSentence, readonly subconj:SubordinatingConjunction){

    }
    
}