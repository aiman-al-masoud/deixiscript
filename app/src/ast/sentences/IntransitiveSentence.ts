import Brain from "../../brain/Brain";
import { ToPrologArgs, getRandomId } from "../interfaces/Constituent";
import { Clause, clauseOf } from "../interfaces/Clause";
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

    toProlog(args?: ToPrologArgs): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } };

        return clauseOf(`${this.iverb.string}(${subjectId})`)
            .concat(this.subject.toProlog(newArgs))
            .concat(this.complements.map(c => c.toProlog(newArgs)).reduce((c1, c2) => c1.concat(c2)))
            //.copy({negated:this.negation?true:false})
    }

}

