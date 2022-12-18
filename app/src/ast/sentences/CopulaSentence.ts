import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause, getRandomId, makeHornClauses } from "../../clauses/Clause";
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

        const subject = this.subject.toProlog(newArgs)
        const predicate = this.predicate.toProlog(newArgs).copy({ negate: !!this.negation })

        return this.subject.isUniversallyQuantified() ?
            makeHornClauses(subject, predicate) :
            predicate.concat(subject)

    }

}