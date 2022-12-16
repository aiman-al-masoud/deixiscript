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

        return this.predicate.toProlog(newArgs)
            .concat(this.subject.toProlog(newArgs))

    }

}