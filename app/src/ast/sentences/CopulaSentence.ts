import Brain from "../../brain/Brain";
import { Clause, getRandomId, makeHornClauses, ToPrologArgs } from "../interfaces/Constituent";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    toProlog(args?: ToPrologArgs): Clause[] {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }

        const predicate = this.predicate.toProlog(newArgs)
        const subject = this.subject.toProlog(newArgs)

        return this.subject.isUniversallyQuantified() ?
                            makeHornClauses(subject, predicate) :
                            predicate.concat(subject)
                            
    }

}