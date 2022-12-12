import Brain from "../../brain/Brain";
import VerbSentence from "../interfaces/VerbSentence";
import Complement from "../phrases/Complement";
import NounPhrase from "../phrases/NounPhrase";
import MVerb from "../tokens/MVerb";
import Negation from "../tokens/Negation";

export default class MonotransitiveSentence implements VerbSentence {

    constructor(readonly subject: NounPhrase,
                readonly mverb: MVerb,
                readonly object: NounPhrase,
                readonly complements: Complement[],
                readonly negation?: Negation) {

    }

    exec(universe: Brain) {
        throw new Error("Method not implemented.");
    }

}