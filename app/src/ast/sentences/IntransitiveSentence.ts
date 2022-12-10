import Universe from "../../universe/Universe";
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

    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }

}