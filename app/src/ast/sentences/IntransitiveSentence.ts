import Brain from "../../brain/Brain";
import { ToPrologArgs, Clause, getRandomId } from "../interfaces/Constituent";
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

    toProlog(args?: ToPrologArgs): Clause[] {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } };

        return [{ string: `${this.iverb.string}(${subjectId})` }]
            .concat(this.subject.toProlog(newArgs))
            .concat(this.complements.flatMap(c=>c.toProlog(newArgs)))

    }

}

