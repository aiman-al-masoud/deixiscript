import Brain from "../../brain/Brain";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";
import VerbSentence from "../interfaces/VerbSentence";
import Complement from "../phrases/Complement";
import NounPhrase from "../phrases/NounPhrase";
import IVerb from "../tokens/IVerb";
import Negation from "../tokens/Negation";

export default class IntransitiveSentence implements VerbSentence {

    constructor(readonly subject: NounPhrase, 
                readonly iverb: IVerb, 
                readonly complements: Complement[], 
                readonly negation?: Negation) {

    }
    toProlog(args?: ToPrologArgs | undefined): Clause[] {
        throw new Error("Method not implemented.");
    }
    
}