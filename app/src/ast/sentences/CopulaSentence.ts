// TODO: problem: need to negate predicate clause ONLY!
import { getRandomId, ToPrologArgs } from "../interfaces/Constituent";
import { Clause, makeHornClauses } from "../interfaces/Clause";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    toProlog(args?: ToPrologArgs): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }

        const predicate = this.negation? this.predicate.toProlog(newArgs).negate() :  this.predicate.toProlog(newArgs)
        const subject = this.subject.toProlog(newArgs)

        const result = this.subject.isUniversallyQuantified() ?
            makeHornClauses(subject, predicate) :
            predicate.concat(subject)

        return result

    }

}