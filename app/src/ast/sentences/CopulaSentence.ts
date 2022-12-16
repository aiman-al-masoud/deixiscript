import Brain from "../../brain/Brain";
import { Clause, getRandomId, ToPrologArgs } from "../interfaces/Constituent";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    toProlog(args?: ToPrologArgs): Clause[] { // predicate(X) + subject.toProlog(subject=X)

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }

        const predicate = this.predicate.toProlog(newArgs)
        const subject = this.subject.toProlog(newArgs)

        if (this.subject.isUniversallyQuantified()) { // TODO: must return a Horn Clause instead, with most important conclusion on the LHS
            return [{ string: `${predicate.map(p=>p.string).reduce((a,b)=>`${a}, ${b}`)} :- ${subject.map(p=>p.string).reduce((a,b)=>`${a}, ${b}`)}` }]
        } else {
            return predicate.concat(subject)
        }

    }

}